import { Purchase, PurchaseItem, Product, User } from "../models/index.js";

/**
 * @api {get} /admin/purchases Obtener historial completo de compras
 * @apiName GetAllPurchases
 * @apiGroup Admin
 * @apiVersion 1.0.0
 * @apiDescription Devuelve una lista completa de todas las compras realizadas por los clientes,
 * incluyendo información del cliente, fecha, productos comprados y total acumulado.
 *
 * @apiPermission ADMIN
 *
 * @apiHeader {String} Authorization Token de autenticación en formato: Bearer <token>.
 *
 * @apiSuccess {Object[]} compras Lista de compras realizadas.
 * @apiSuccess {Number} compras.id ID de la compra.
 * @apiSuccess {String} compras.fecha Fecha de la compra.
 * @apiSuccess {String} compras.cliente Nombre del cliente que realizó la compra.
 * @apiSuccess {Number} compras.total Monto total de la compra.
 * @apiSuccess {Object[]} compras.productos Lista de productos adquiridos.
 * @apiSuccess {String} compras.productos.nombre Nombre del producto.
 * @apiSuccess {Number} compras.productos.cantidad Cantidad del producto comprada.
 * @apiSuccess {Number} compras.productos.precio Precio unitario del producto.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * [
 *   {
 *     "id": 4,
 *     "cliente": "cliente1",
 *     "fecha": "2025-01-18",
 *     "total": 4500.50,
 *     "productos": [
 *       { 
 *         "nombre": "Laptop Lenovo", 
 *         "cantidad": 1,
 *         "precio": 1500.50
 *       },
 *       {
 *         "nombre": "Mouse Logitech",
 *         "cantidad": 2,
 *         "precio": 60
 *       }
 *     ]
 *   },
 *   {
 *     "id": 5,
 *     "cliente": "cliente2",
 *     "fecha": "2025-01-20",
 *     "total": 980.00,
 *     "productos": [
 *       { 
 *         "nombre": "Teclado Mecánico", 
 *         "cantidad": 1,
 *         "precio": 980
 *       }
 *     ]
 *   }
 * ]
 *
 * @apiErrorExample {json} Error 401: Token faltante o inválido
 * {
 *   "error": "Acceso no autorizado"
 * }
 *
 * @apiErrorExample {json} Error 403: Usuario sin permisos
 * {
 *   "error": "No tiene permisos para acceder a este recurso"
 * }
 */
export const createPurchase = async (req, res) => {
  if (req.user.role !== "CLIENT")
    return res.status(403).json({ error: "Solo clientes" });

  const { items } = req.body;
  const t = await Purchase.sequelize.transaction();

  try {
    const purchase = await Purchase.create(
      { clientId: req.user.id, fecha: new Date(), total: 0 },
      { transaction: t }
    );
    let total = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      if (!product) throw new Error("Producto no encontrado");
      if (product.cantidad_disponible < item.cantidad)
        throw new Error("Stock insuficiente");

      const subtotal = product.precio * item.cantidad;
      total += subtotal;

      await PurchaseItem.create(
        {
          purchaseId: purchase.id,
          productId: product.id,
          cantidad: item.cantidad,
          precio_unitario: product.precio,
        },
        { transaction: t }
      );

      await product.update(
        { cantidad_disponible: product.cantidad_disponible - item.cantidad },
        { transaction: t }
      );
    }

    await purchase.update({ total }, { transaction: t });
    await t.commit();

    const factura = await Purchase.findByPk(purchase.id, {
      include: [{ model: PurchaseItem, include: [Product] }, User],
    });

    res.json(factura);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
};

/**
 * @api {get} /purchases/:id Obtener factura de una compra
 * @apiName GetPurchaseInvoice
 * @apiGroup Purchases
 * @apiVersion 1.0.0
 * @apiDescription Devuelve la factura detallada de una compra específica.  
 * Solo el cliente dueño de la compra o un administrador pueden acceder a ella.
 *
 * @apiPermission CLIENT o ADMIN
 *
 * @apiHeader {String} Authorization Token en formato: Bearer <token>.
 *
 * @apiParam {Number} id ID de la compra.
 *
 * @apiSuccess {Number} id ID de la compra.
 * @apiSuccess {String} fecha Fecha en que se realizó la compra.
 * @apiSuccess {Object} cliente Información del cliente.
 * @apiSuccess {Number} cliente.id ID del cliente.
 * @apiSuccess {String} cliente.username Nombre del usuario.
 *
 * @apiSuccess {Object[]} productos Productos incluidos en la compra.
 * @apiSuccess {Number} productos.id ID del producto.
 * @apiSuccess {String} productos.nombre Nombre del producto.
 * @apiSuccess {Number} productos.precio Precio unitario.
 * @apiSuccess {Number} productos.PurchaseItem.cantidad Cantidad adquirida.
 *
 * @apiSuccess {Number} total Monto total de la compra.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "id": 12,
 *   "fecha": "2025-01-25",
 *   "cliente": {
 *     "id": 3,
 *     "username": "cliente1"
 *   },
 *   "productos": [
 *     {
 *       "id": 1,
 *       "nombre": "Laptop Lenovo",
 *       "precio": 1500.50,
 *       "PurchaseItem": {
 *         "cantidad": 1
 *       }
 *     },
 *     {
 *       "id": 2,
 *       "nombre": "Mouse Logitech",
 *       "precio": 60,
 *       "PurchaseItem": {
 *         "cantidad": 2
 *       }
 *     }
 *   ],
 *   "total": 1620.50
 * }
 *
 * @apiErrorExample {json} Error 404: Compra no encontrada
 * {
 *   "error": "No existe"
 * }
 *
 * @apiErrorExample {json} Error 403: No autorizado
 * {
 *   "error": "No autorizado"
 * }
 */
export const getInvoice = async (req, res) => {
  const purchase = await Purchase.findByPk(req.params.id, {
    include: [{ model: PurchaseItem, include: [Product] }, User],
  });

  if (!purchase) return res.status(404).json({ error: "No existe" });
  if (req.user.role !== "ADMIN" && purchase.clientId !== req.user.id)
    return res.status(403).json({ error: "No autorizado" });

  res.json(purchase);
};

/**
 * @api {get} /purchases Obtener historial de compras del cliente
 * @apiName GetMyPurchases
 * @apiGroup Purchases
 * @apiVersion 1.0.0
 * @apiDescription Devuelve todas las compras realizadas por el cliente autenticado,
 * incluyendo los productos comprados y su detalle.
 *
 * @apiPermission CLIENT
 *
 * @apiHeader {String} Authorization Token en formato: Bearer <token>.
 *
 * @apiSuccess {Object[]} compras Lista de compras realizadas por el usuario.
 * @apiSuccess {Number} compras.id ID de la compra.
 * @apiSuccess {String} compras.fecha Fecha de la compra.
 * @apiSuccess {Object[]} compras.productos Productos incluidos en la compra.
 * @apiSuccess {Number} compras.productos.id ID del producto.
 * @apiSuccess {String} compras.productos.nombre Nombre del producto.
 * @apiSuccess {Number} compras.productos.precio Precio unitario.
 * @apiSuccess {Number} compras.productos.PurchaseItem.cantidad Cantidad adquirida del producto.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * [
 *   {
 *     "id": 10,
 *     "fecha": "2025-01-22",
 *     "productos": [
 *       {
 *         "id": 1,
 *         "nombre": "Laptop Lenovo",
 *         "precio": 1500.50,
 *         "PurchaseItem": {
 *           "cantidad": 1
 *         }
 *       },
 *       {
 *         "id": 3,
 *         "nombre": "Mouse Logitech",
 *         "precio": 60,
 *         "PurchaseItem": {
 *           "cantidad": 2
 *         }
 *       }
 *     ]
 *   },
 *   {
 *     "id": 14,
 *     "fecha": "2025-01-25",
 *     "productos": [
 *       {
 *         "id": 2,
 *         "nombre": "Teclado Mecánico",
 *         "precio": 120.00,
 *         "PurchaseItem": {
 *           "cantidad": 1
 *         }
 *       }
 *     ]
 *   }
 * ]
 */
export const myPurchases = async (req, res) => {
  const purchases = await Purchase.findAll({
    where: { clientId: req.user.id },
    include: [{ model: PurchaseItem, include: [Product] }],
  });

  res.json(purchases);
};

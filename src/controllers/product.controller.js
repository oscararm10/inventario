import { Product } from "../models/Product.js";

/**
 * @api {post} /products Crear un producto
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Crea un nuevo producto en el inventario. Solo disponible para administradores.
 *
 * @apiPermission ADMIN
 *
 * @apiHeader {String} Authorization Token en formato: Bearer <token>.
 *
 * @apiBody {String} lote Número de lote del producto.
 * @apiBody {String} nombre Nombre del producto.
 * @apiBody {Number} precio Precio unitario del producto.
 * @apiBody {Number} cantidad_disponible Cantidad disponible en inventario.
 * @apiBody {String} fecha_ingreso Fecha de ingreso (YYYY-MM-DD).
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "id": 1,
 *   "lote": "L-001",
 *   "nombre": "Laptop Lenovo",
 *   "precio": 1500.50,
 *   "cantidad_disponible": 10,
 *   "fecha_ingreso": "2025-01-15"
 * }
 *
 * @apiErrorExample {json} Error 400:
 * {
 *   "error": "Datos inválidos"
 * }
 */
export const createProduct = async (req, res) => {
  res.json(await Product.create(req.body));
};

/**
 * @api {get} /products Listar productos
 * @apiName ListProducts
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Devuelve la lista completa de productos disponibles en el inventario.
 *
 * @apiSuccess {Object[]} productos Lista de productos.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * [
 *   {
 *     "id": 1,
 *     "lote": "L-001",
 *     "nombre": "Laptop Lenovo",
 *     "precio": 1500.50,
 *     "cantidad_disponible": 10,
 *     "fecha_ingreso": "2025-01-15"
 *   }
 * ]
 */
export const listProducts = async (req, res) => {
  res.json(await Product.findAll());
};

/**
 * @api {get} /products/:id Obtener producto
 * @apiName GetProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Obtiene la información de un producto según su ID.
 *
 * @apiParam {Number} id ID del producto.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "id": 1,
 *   "lote": "L-001",
 *   "nombre": "Laptop Lenovo",
 *   "precio": 1500.50,
 *   "cantidad_disponible": 10,
 *   "fecha_ingreso": "2025-01-15"
 * }
 *
 * @apiErrorExample {json} Error 404:
 * {
 *   "error": "No encontrado"
 * }
 */
export const getProduct = async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: "No encontrado" });
  res.json(p);
};

/**
 * @api {put} /products/:id Actualizar producto
 * @apiName UpdateProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Actualiza la información de un producto existente. Solo administradores.
 *
 * @apiPermission ADMIN
 *
 * @apiHeader {String} Authorization Token en formato: Bearer <token>.
 *
 * @apiParam {Number} id ID del producto.
 *
 * @apiBody {String} [lote] Número de lote.
 * @apiBody {String} [nombre] Nombre del producto.
 * @apiBody {Number} [precio] Precio.
 * @apiBody {Number} [cantidad_disponible] Cantidad disponible.
 * @apiBody {String} [fecha_ingreso] Fecha de ingreso.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "id": 1,
 *   "lote": "L-001",
 *   "nombre": "Laptop Lenovo Gamer",
 *   "precio": 1800.00,
 *   "cantidad_disponible": 5,
 *   "fecha_ingreso": "2025-01-15"
 * }
 *
 * @apiErrorExample {json} Error 404:
 * {
 *   "error": "No encontrado"
 * }
 */
export const updateProduct = async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: "No encontrado" });
  await p.update(req.body);
  res.json(p);
};

/**
 * @api {delete} /products/:id Eliminar producto
 * @apiName DeleteProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Elimina un producto del inventario. Solo administradores.
 *
 * @apiPermission ADMIN
 *
 * @apiHeader {String} Authorization Token en formato: Bearer <token>.
 *
 * @apiParam {Number} id ID del producto a eliminar.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "msg": "Eliminado"
 * }
 *
 * @apiErrorExample {json} Error 404:
 * {
 *   "error": "No encontrado"
 * }
 */
export const deleteProduct = async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: "No encontrado" });
  await p.destroy();
  res.json({ msg: "Eliminado" });
};

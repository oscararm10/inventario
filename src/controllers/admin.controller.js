import { Purchase, PurchaseItem, Product, User } from "../models/index.js";

/**
 * @api {get} /admin/purchases Historial completo de compras
 * @apiName GetAllPurchases
 * @apiGroup Admin
 * @apiPermission ADMIN
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * [
 *   {
 *     "id": 4,
 *     "cliente": "cliente1",
 *     "fecha": "2025-01-18",
 *     "total": 4500.50,
 *     "productos": [
 *       { "nombre": "Laptop Lenovo", "cantidad": 1 }
 *     ]
 *   }
 * ]
 */
export const listAllPurchases = async (req, res) => {
  const purchases = await Purchase.findAll({
    include: [User, { model: PurchaseItem, include: [Product] }],
  });
  res.json(purchases);
};

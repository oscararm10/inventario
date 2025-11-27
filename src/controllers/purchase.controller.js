import { Purchase, PurchaseItem, Product, User } from "../models/index.js";


export const createPurchase = async (req, res) => {
if (req.user.role !== "CLIENT") return res.status(403).json({ error: "Solo clientes" });


const { items } = req.body;
const t = await Purchase.sequelize.transaction();


try {
const purchase = await Purchase.create({ clientId: req.user.id, fecha: new Date(), total: 0 }, { transaction: t });
let total = 0;


for (const item of items) {
const product = await Product.findByPk(item.productId);


if (!product) throw new Error("Producto no encontrado");
if (product.cantidad_disponible < item.cantidad) throw new Error("Stock insuficiente");


const subtotal = product.precio * item.cantidad;
total += subtotal;


await PurchaseItem.create({ purchaseId: purchase.id, productId: product.id, cantidad: item.cantidad, precio_unitario: product.precio }, { transaction: t });


await product.update({ cantidad_disponible: product.cantidad_disponible - item.cantidad }, { transaction: t });
}


await purchase.update({ total }, { transaction: t });
await t.commit();


const factura = await Purchase.findByPk(purchase.id, {
include: [{ model: PurchaseItem, include: [Product] }, User]
});


res.json(factura);


} catch (err) {
await t.rollback();
res.status(400).json({ error: err.message });
}
};


export const getInvoice = async (req, res) => {
const purchase = await Purchase.findByPk(req.params.id, {
include: [{ model: PurchaseItem, include: [Product] }, User]
});


if (!purchase) return res.status(404).json({ error: "No existe" });
if (req.user.role !== "ADMIN" && purchase.clientId !== req.user.id)
return res.status(403).json({ error: "No autorizado" });


res.json(purchase);
};


export const myPurchases = async (req, res) => {
const purchases = await Purchase.findAll({
where: { clientId: req.user.id },
include: [{ model: PurchaseItem, include: [Product] }]
});


res.json(purchases);
};
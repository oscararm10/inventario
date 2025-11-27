import { Purchase, PurchaseItem, Product, User } from "../models/index.js";

export const listAllPurchases = async (req, res) => {
  const purchases = await Purchase.findAll({
    include: [User, { model: PurchaseItem, include: [Product] }],
  });
  res.json(purchases);
};

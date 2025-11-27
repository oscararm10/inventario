import { User } from "./User.js";
import { Product } from "./Product.js";
import { Purchase } from "./Purchase.js";
import { PurchaseItem } from "./PurchaseItem.js";


// Relaciones
User.hasMany(Purchase, { foreignKey: "clientId" });
Purchase.belongsTo(User, { foreignKey: "clientId" });


Purchase.hasMany(PurchaseItem, { foreignKey: "purchaseId" });
PurchaseItem.belongsTo(Purchase, { foreignKey: "purchaseId" });


Product.hasMany(PurchaseItem, { foreignKey: "productId" });
PurchaseItem.belongsTo(Product, { foreignKey: "productId" });


export { User, Product, Purchase, PurchaseItem };
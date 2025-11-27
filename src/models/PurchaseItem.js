import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


export const PurchaseItem = sequelize.define("PurchaseItem", {
cantidad: DataTypes.INTEGER,
precio_unitario: DataTypes.FLOAT
});
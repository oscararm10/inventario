import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


export const Purchase = sequelize.define("Purchase", {
fecha: DataTypes.DATE,
total: DataTypes.FLOAT
});
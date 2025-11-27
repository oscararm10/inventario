import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


export const Product = sequelize.define("Product", {
lote: DataTypes.STRING,
nombre: DataTypes.STRING,
precio: DataTypes.FLOAT,
cantidad_disponible: DataTypes.INTEGER,
fecha_ingreso: DataTypes.DATE
});
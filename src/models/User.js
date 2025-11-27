import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


export const User = sequelize.define("User", {
username: { type: DataTypes.STRING, unique: true },
email: DataTypes.STRING,
role: { type: DataTypes.STRING, defaultValue: "CLIENT" },
password: DataTypes.STRING,
});
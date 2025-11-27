import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "inventario_db",
  "postgres",
  "1234567890",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

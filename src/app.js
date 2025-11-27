import express from "express";
import { sequelize } from "./config/db.js";

import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";

const app = express();
app.use(express.json());
app.use("/apidoc", express.static("apidoc"));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.json({ msg: "API funcionando" }));

sequelize.sync({ alter: true }).then(() => {
  console.log("Base de datos sincronizada");
  app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
});

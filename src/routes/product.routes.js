import { Router } from "express";
import { createProduct, listProducts, getProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { auth, admin } from "../middleware/auth.js";


const r = Router();
r.post("/", auth, admin, createProduct);
r.get("/", auth, listProducts);
r.get("/:id", auth, getProduct);
r.put("/:id", auth, admin, updateProduct);
r.delete("/:id", auth, admin, deleteProduct);
export default r;
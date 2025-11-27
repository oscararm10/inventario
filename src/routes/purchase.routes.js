import { Router } from "express";
import {
  createPurchase,
  getInvoice,
  myPurchases,
} from "../controllers/purchase.controller.js";
import { auth } from "../middleware/auth.js";

const r = Router();
r.post("/", auth, createPurchase);
r.get("/mine", auth, myPurchases);
r.get("/:id", auth, getInvoice);
export default r;

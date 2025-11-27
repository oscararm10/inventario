import { Router } from "express";
import { listAllPurchases } from "../controllers/admin.controller.js";
import { auth, admin } from "../middleware/auth.js";


const r = Router();
r.get("/purchases", auth, admin, listAllPurchases);
export default r;
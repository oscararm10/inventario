import { Product } from "../models/Product.js";


export const createProduct = async (req, res) => {
res.json(await Product.create(req.body));
};


export const listProducts = async (req, res) => {
res.json(await Product.findAll());
};


export const getProduct = async (req, res) => {
const p = await Product.findByPk(req.params.id);
if (!p) return res.status(404).json({ error: "No encontrado" });
res.json(p);
};


export const updateProduct = async (req, res) => {
const p = await Product.findByPk(req.params.id);
if (!p) return res.status(404).json({ error: "No encontrado" });
await p.update(req.body);
res.json(p);
};


export const deleteProduct = async (req, res) => {
const p = await Product.findByPk(req.params.id);
if (!p) return res.status(404).json({ error: "No encontrado" });
await p.destroy();
res.json({ msg: "Eliminado" });
};
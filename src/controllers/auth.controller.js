import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const SECRET = "SECRETO_SUPER_SEGURO";

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, email, password: hashed, role });
    res.json({ msg: "Usuario creado", user });
  } catch {
    res.status(400).json({ error: "Usuario ya existe" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Credenciales inválidas" });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
};

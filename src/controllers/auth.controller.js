import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const SECRET = "SECRETO_SUPER_SEGURO";

/**
 * @api {post} /auth/register Registro de usuario
 * @apiName RegisterUser
 * @apiGroup Auth
 *
 * @apiBody {String} username Nombre de usuario.
 * @apiBody {String} email Email del usuario.
 * @apiBody {String} password Contraseña del usuario.
 * @apiBody {String="ADMIN","CLIENT"} role Rol del usuario.
 *
 * @apiSuccess {Number} id ID del usuario.
 * @apiSuccess {String} username Nombre del usuario.
 * @apiSuccess {String} email Email del usuario.
 * @apiSuccess {String} role Rol asignado.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "id": 1,
 *   "username": "admin",
 *   "email": "admin@mail.com",
 *   "role": "ADMIN"
 * }
 */
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

/**
 * @api {post} /auth/login Login de usuario
 * @apiName LoginUser
 * @apiGroup Auth
 *
 * @apiBody {String} username Nombre de usuario.
 * @apiBody {String} password Contraseña.
 *
 * @apiSuccess {String} token Token JWT.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR..."
 * }
 */
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

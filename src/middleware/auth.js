import jwt from "jsonwebtoken";

const SECRET = "SECRETO_SUPER_SEGURO";

export function auth(req, res, next) {
const token = req.headers["authorization"]?.split(" ")[1];
if (!token) return res.status(401).json({ error: "Token requerido" });


try {
req.user = jwt.verify(token, SECRET);
next();
} catch (e) {
res.status(403).json({ error: "Token inválido" });
}
}


export function admin(req, res, next) {
if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Solo admins" });
next();
}
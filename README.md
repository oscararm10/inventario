# Inventario API - Node.js + Express + Sequelize + PostgreSQL

API REST para gestionar un inventario con roles **Administrador** y **Cliente**. Permite CRUD de productos, compras, facturas y visualización de historial de compras.

---

## 🛠 Requisitos
- Node.js >= 18
- PostgreSQL
- npm
- Postman (para pruebas)

---

## 📂 Estructura del proyecto

```
inventario-api/
├── package.json
├── README.md
└── src/
    ├── app.js
    ├── config/db.js
    ├── middleware/auth.js
    ├── models/
    ├── controllers/
    └── routes/
```

---

## ⚡ Instalación

1. Clonar repositorio:
```bash
git clone <https://github.com/oscararm10/inventario.git>
cd inventario-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear base de datos en PostgreSQL:
```sql
CREATE DATABASE inventario_db;
```

4. Configurar credenciales de DB en `src/config/db.js`

5. Crear usuario admin por defecto:
```bash
node scripts/createAdmin.js
```
Usuario: `admin` / Password: `admin123`

6. Ejecutar API:
```bash
npm run dev
```
Servidor disponible en `http://localhost:3000`

---

## 📌 Endpoints / Ejemplos Postman

### 1️⃣ POST /auth/register
Registrar usuario ADMIN o CLIENT.
```json
{
  "username": "admin",
  "email": "admin@mail.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

```json
{
  "username": "cliente1",
  "email": "cliente1@mail.com",
  "password": "123456",
  "role": "CLIENT"
}
```

---

### 2️⃣ POST /auth/login
Obtener JWT.
```json
{
  "username": "admin",
  "password": "admin123"
}
```
```json
{
  "username": "cliente1",
  "password": "123456"
}
```

> Guardar el token devuelto para usar en headers Authorization `Bearer <token>`

---

### 3️⃣ POST /products/ (ADMIN)
Agregar producto.
```json
{
  "lote": "L-001",
  "nombre": "Laptop Lenovo",
  "precio": 1500.50,
  "cantidad_disponible": 10,
  "fecha_ingreso": "2025-01-15"
}
```

---

### 4️⃣ POST /purchases/ (CLIENTE)
Realizar compra con 1 o varios productos.
```json
{
  "items": [
    {"productId": 1, "cantidad": 1},
    {"productId": 2, "cantidad": 3}
  ]
}
```

---

### 5️⃣ GET /purchases/:id (Factura)
Ver factura de compra por ID.
- Solo visible para cliente dueño o admin.

---

### 6️⃣ GET /admin/purchases (Historial completo)
Ver todas las compras realizadas por todos los clientes (ADMIN).

---

## 🔑 Autenticación
Todos los endpoints excepto `/auth/register` y `/auth/login` requieren **JWT en header**:
```
Authorization: Bearer <token>
```

---

## ✅ Notas
- Separación por roles: `ADMIN` y `CLIENT`.
- Compras actualizan automáticamente stock de productos.
- Facturas incluyen detalle de cada producto comprado y total.

---

Listo para probar en Postman o integrarse con frontend.

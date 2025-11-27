import bcrypt from "bcrypt";
import { sequelize } from "../src/config/db.js";
import { User } from "../src/models/User.js";

const run = async () => {
  try {
    await sequelize.sync();

    const exists = await User.findOne({ where: { username: "admin" } });
    if (exists) {
      console.log("Ya existe un admin");
      process.exit(0);
    }

    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      username: "admin",
      email: "admin@admin.com",
      password: hashed,
      role: "ADMIN",
    });

    console.log("Admin creado: admin / admin123");
    process.exit(0);
  } catch (e) {
    console.error("Error creando admin", e);
    process.exit(1);
  }
};

run();

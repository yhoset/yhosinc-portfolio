import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma.js";

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Faltan SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD en el entorno.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);

const admin = await prisma.adminUser.upsert({
  where: { email },
  update: { passwordHash },
  create: { email, passwordHash },
});

console.log("Usuario admin listo:", admin.email);
await prisma.$disconnect();

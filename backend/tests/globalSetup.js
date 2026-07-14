import { existsSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

const backendRoot = dirname(dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: join(backendRoot, ".env.test") });

export async function setup() {
  const dbPath = join(backendRoot, "test.db");
  if (existsSync(dbPath)) unlinkSync(dbPath);
  const journalPath = `${dbPath}-journal`;
  if (existsSync(journalPath)) unlinkSync(journalPath);

  // Migra la base de test desde cero contra el mismo schema que producción,
  // así los tests corren contra una estructura real, no una simulada.
  execSync("npx prisma migrate deploy", {
    cwd: backendRoot,
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    stdio: "inherit",
  });

  const { prisma } = await import("../src/lib/prisma.js");
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);
  await prisma.adminUser.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL },
    update: { passwordHash },
    create: { email: process.env.SEED_ADMIN_EMAIL, passwordHash },
  });
  await prisma.$disconnect();
}

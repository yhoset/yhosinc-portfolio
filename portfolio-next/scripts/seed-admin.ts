import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../src/server/db/client";
import { adminUsers } from "../src/server/db/schema";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Faltan SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD en el entorno.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

  if (existing) {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.email, email));
  } else {
    await db.insert(adminUsers).values({ email, passwordHash });
  }

  console.log("Usuario admin listo:", email);
}

main();

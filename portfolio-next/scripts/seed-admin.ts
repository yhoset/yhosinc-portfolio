import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { adminUsers } from "../src/server/db/schema";

// Este script corre standalone vía `tsx`, nunca dentro de un request de
// Next/Cloudflare Worker — por eso arma su propio cliente contra
// process.env en vez de usar getDb()/getEnv() de server/db/client.ts. Esos
// dos pasan por server/lib/env.ts, que importa el paquete `server-only`
// (una guarda que solo Next sabe resolver/stripear en su bundler); bajo
// `tsx` puro ese import revienta con "Cannot find module 'server-only'".
// Confirmado al convertir client.ts en singleton lazy (Fase 10): este
// script se rompió hasta separarlo así.
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Faltan SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD en el entorno.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const client = createClient({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client);

  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

  if (existing) {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.email, email));
  } else {
    await db.insert(adminUsers).values({ email, passwordHash });
  }

  console.log("Usuario admin listo:", email);
}

main();

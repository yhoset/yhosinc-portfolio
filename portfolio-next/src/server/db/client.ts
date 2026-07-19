import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { getEnv } from "@/server/lib/env";
import * as schema from "./schema";

// Fase 10: `db` pasó de ser un cliente creado a nivel de módulo (con
// fallback a process.env) a un singleton lazy — DATABASE_URL/TURSO_AUTH_TOKEN
// ahora se leen vía getEnv() (ver server/lib/env.ts), que en Cloudflare
// Workers lee el binding real de wrangler y en local cae a process.env. No
// se puede crear el cliente a nivel de módulo porque getEnv() es async
// (depende de getCloudflareContext()), así que cada Server Action pide el
// cliente con `const db = await getDb()` en vez de importar `db` directo.
// La promesa se cachea: la primera llamada crea el cliente, las siguientes
// reusan la misma instancia dentro del mismo Worker.
let dbPromise: Promise<LibSQLDatabase<typeof schema>> | null = null;

async function createDb() {
  const url = (await getEnv("DATABASE_URL")) ?? "file:./dev.db";
  const authToken = await getEnv("TURSO_AUTH_TOKEN");
  const client = createClient({ url, authToken });
  return drizzle(client, { schema });
}

export function getDb() {
  if (!dbPromise) {
    dbPromise = createDb();
  }
  return dbPromise;
}

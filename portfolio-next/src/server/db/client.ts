import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// En local, DATABASE_URL es un archivo sqlite (file:./dev.db) — no se toca
// Turso hasta que el proyecto lo requiera explícitamente. TURSO_AUTH_TOKEN
// solo aplica contra una URL libsql:// remota, no contra un archivo local.
const client = createClient({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

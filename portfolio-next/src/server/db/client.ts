import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// En local, DATABASE_URL es un archivo sqlite (file:./dev.db) — no se toca
// Turso hasta que el proyecto lo requiera explícitamente. TURSO_AUTH_TOKEN
// solo aplica contra una URL libsql:// remota, no contra un archivo local.
//
// Nota (Fase 6, confirmado con una ruta de diagnóstico temporal): en este
// adaptador (@opennextjs/cloudflare) las vars de .dev.vars / secrets de
// Cloudflare NO llegan a process.env — se leen vía getCloudflareContext().env
// (ver server/lib/env.ts, ya usado en auth/jwt.ts y lib/mailer.ts). Acá se
// deja process.env con fallback a propósito porque este archivo crea el
// client al cargar el módulo (top-level), no dentro de un request, y
// mientras la Fase 6 trabaja 100% contra el archivo local (nunca Turso real)
// el fallback ya resuelve al valor correcto. Pendiente antes de la Fase 10
// (cuando esto sí tenga que apuntar a la Turso de producción): convertir
// `db` en un singleton lazy que lea DATABASE_URL/TURSO_AUTH_TOKEN vía
// getEnv() en el primer uso real.
const client = createClient({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

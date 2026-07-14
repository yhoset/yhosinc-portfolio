import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Mismo adapter para local y producción: en desarrollo DATABASE_URL apunta a
// un archivo local ("file:./dev.db"), en producción apunta a Turso
// ("libsql://...") con TURSO_AUTH_TOKEN — el cliente libSQL entiende ambos
// formatos de URL sin cambiar código.
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prisma = new PrismaClient({ adapter });

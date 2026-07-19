"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { visitorUsers } from "@/server/db/schema";
import { visitorRegisterSchema, visitorLoginSchema } from "@/server/actions/schemas";
import { createVisitorSession, destroyVisitorSession } from "@/server/auth/session";
import { rateLimit } from "@/server/lib/rate-limit";
import { getClientIp } from "@/server/lib/client-ip";

export type VisitorAuthState = { ok: boolean; error?: string };

// Función construida a pedido del usuario pero mantenida sin ningún punto
// de entrada visible en el frontend hasta nuevo aviso (mismo criterio que
// v1) — igual queda protegida acá por las mismas buenas prácticas que el
// resto del backend (nunca depender solo de que el frontend no muestre el
// botón).
export async function registerVisitor(_prev: VisitorAuthState, formData: FormData): Promise<VisitorAuthState> {
  const ip = await getClientIp();
  const limit = rateLimit(`visitor-register:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return { ok: false, error: "Demasiados intentos. Probá de nuevo más tarde." };
  }

  const parsed = visitorRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, email, password } = parsed.data;

  const db = await getDb();
  const [existing] = await db.select().from(visitorUsers).where(eq(visitorUsers.email, email)).limit(1);
  if (existing) {
    return { ok: false, error: "Ya existe una cuenta con ese email" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [visitor] = await db.insert(visitorUsers).values({ name, email, passwordHash }).returning();

  await createVisitorSession(visitor);
  return { ok: true };
}

export async function loginVisitor(_prev: VisitorAuthState, formData: FormData): Promise<VisitorAuthState> {
  const ip = await getClientIp();
  const limit = rateLimit(`visitor-login:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return { ok: false, error: "Demasiados intentos. Probá de nuevo más tarde." };
  }

  const parsed = visitorLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Datos inválidos" };
  }

  const { email, password } = parsed.data;

  const db = await getDb();
  const [visitor] = await db.select().from(visitorUsers).where(eq(visitorUsers.email, email)).limit(1);
  if (!visitor) {
    return { ok: false, error: "Credenciales incorrectas" };
  }

  const valid = await bcrypt.compare(password, visitor.passwordHash);
  if (!valid) {
    return { ok: false, error: "Credenciales incorrectas" };
  }

  await createVisitorSession(visitor);
  return { ok: true };
}

export async function logoutVisitor() {
  await destroyVisitorSession();
}

"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { adminUsers } from "@/server/db/schema";
import { adminLoginSchema } from "@/server/actions/schemas";
import { createAdminSession, destroyAdminSession } from "@/server/auth/session";
import { rateLimit } from "@/server/lib/rate-limit";
import { getClientIp } from "@/server/lib/client-ip";

export type AdminLoginState = { ok: boolean; error?: string };

export async function loginAdmin(_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const ip = await getClientIp();
  const limit = rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return { ok: false, error: "Demasiados intentos. Probá de nuevo más tarde." };
  }

  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Datos inválidos" };
  }

  const { email, password } = parsed.data;

  const db = await getDb();
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (!admin) {
    return { ok: false, error: "Credenciales incorrectas" };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { ok: false, error: "Credenciales incorrectas" };
  }

  await createAdminSession(admin);
  return { ok: true };
}

export async function logoutAdmin() {
  await destroyAdminSession();
}

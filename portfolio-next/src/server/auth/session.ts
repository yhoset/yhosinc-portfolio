import "server-only";
import { cookies } from "next/headers";
import {
  signAdminToken,
  verifyAdminToken,
  signVisitorToken,
  verifyVisitorToken,
  type AdminTokenPayload,
  type VisitorTokenPayload,
} from "@/server/auth/jwt";

// Cookies httpOnly en vez del localStorage + Bearer header que usaba v1:
// un token en localStorage es legible por cualquier script que corra en la
// página (XSS = robo de sesión); httpOnly hace que el JS del cliente ni
// siquiera pueda leer la cookie. Nombres distintos para admin/visitante
// para que nunca puedan pisarse entre sí.
const ADMIN_COOKIE = "yhosinc_admin_session";
const VISITOR_COOKIE = "yhosinc_visitor_session";

const ADMIN_MAX_AGE = 60 * 60 * 2; // 2h, igual que la expiración del JWT
const VISITOR_MAX_AGE = 60 * 60 * 24 * 30; // 30d

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function createAdminSession(admin: { id: number; email: string }) {
  const token = await signAdminToken(admin);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, { ...cookieOptions, maxAge: ADMIN_MAX_AGE });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function createVisitorSession(visitor: { id: number; email: string; name: string }) {
  const token = await signVisitorToken(visitor);
  const store = await cookies();
  store.set(VISITOR_COOKIE, token, { ...cookieOptions, maxAge: VISITOR_MAX_AGE });
}

export async function destroyVisitorSession() {
  const store = await cookies();
  store.delete(VISITOR_COOKIE);
}

export async function getVisitorSession(): Promise<VisitorTokenPayload | null> {
  const store = await cookies();
  const token = store.get(VISITOR_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyVisitorToken(token);
  } catch {
    return null;
  }
}

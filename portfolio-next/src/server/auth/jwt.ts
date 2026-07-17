import { SignJWT, jwtVerify } from "jose";
import { getEnv } from "@/server/lib/env";

const ADMIN_EXPIRES_IN = "2h";
const VISITOR_EXPIRES_IN = "30d";

async function getSecret(): Promise<Uint8Array> {
  const secret = await getEnv("JWT_SECRET");
  if (!secret) {
    throw new Error("Falta JWT_SECRET en el entorno");
  }
  return new TextEncoder().encode(secret);
}

export type AdminTokenPayload = { sub: string; email: string; role: "admin" };
export type VisitorTokenPayload = { sub: string; email: string; name: string; role: "visitor" };

// Los dos tipos de token comparten el mismo JWT_SECRET, así que el claim
// "role" es lo único que los distingue — cada verify() de abajo lo chequea
// explícitamente y rechaza cualquier token del rol equivocado, aunque esté
// firmado correctamente. Sin este chequeo, un token de visitante sería
// indistinguible de uno de admin y podría usarse para entrar al panel.
export async function signAdminToken(admin: { id: number; email: string }) {
  return new SignJWT({ email: admin.email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(admin.id))
    .setIssuedAt()
    .setExpirationTime(ADMIN_EXPIRES_IN)
    .sign(await getSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload> {
  const { payload } = await jwtVerify(token, await getSecret());
  if (payload.role !== "admin" || typeof payload.sub !== "string" || typeof payload.email !== "string") {
    throw new Error("Token no es de administrador");
  }
  return { sub: payload.sub, email: payload.email, role: "admin" };
}

export async function signVisitorToken(visitor: { id: number; email: string; name: string }) {
  return new SignJWT({ email: visitor.email, name: visitor.name, role: "visitor" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(visitor.id))
    .setIssuedAt()
    .setExpirationTime(VISITOR_EXPIRES_IN)
    .sign(await getSecret());
}

export async function verifyVisitorToken(token: string): Promise<VisitorTokenPayload> {
  const { payload } = await jwtVerify(token, await getSecret());
  if (
    payload.role !== "visitor" ||
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.name !== "string"
  ) {
    throw new Error("Token no es de visitante");
  }
  return { sub: payload.sub, email: payload.email, name: payload.name, role: "visitor" };
}

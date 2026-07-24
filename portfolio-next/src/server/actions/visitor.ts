"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { visitorUsers } from "@/server/db/schema";
import { visitorRegisterSchema, visitorLoginSchema } from "@/server/actions/schemas";
import { createVisitorSession, destroyVisitorSession } from "@/server/auth/session";
import { rateLimit } from "@/server/lib/rate-limit";
import { getClientIp } from "@/server/lib/client-ip";

// Códigos, no texto — mismo criterio que actions/contact.ts: el sitio es
// bilingüe y el Server Action no sabe en qué idioma está el visitante, el
// componente cliente traduce cada código con next-intl (VisitorAuth.errors.*).
export type VisitorFieldErrorCode = "required" | "tooShort" | "tooLong" | "invalidEmail";
export type VisitorErrorCode =
  | "rateLimited"
  | "validation"
  | "emailTaken"
  | "invalidCredentials"
  | "serverError";

export type VisitorAuthState = {
  ok: boolean;
  errorCode?: VisitorErrorCode;
  fieldErrors?: Partial<Record<"name" | "email" | "password", VisitorFieldErrorCode>>;
};

function issueToFieldErrorCode(issue: {
  code: string;
  format?: string;
  minimum?: number | bigint;
}): VisitorFieldErrorCode {
  if (issue.code === "too_big") return "tooLong";
  if (issue.code === "too_small") return Number(issue.minimum ?? 1) > 1 ? "tooShort" : "required";
  if (issue.code === "invalid_format" && issue.format === "email") return "invalidEmail";
  return "required";
}

// Función construida a pedido del usuario pero mantenida sin ningún punto
// de entrada visible en el frontend hasta nuevo aviso (mismo criterio que
// v1) — igual queda protegida acá por las mismas buenas prácticas que el
// resto del backend (nunca depender solo de que el frontend no muestre el
// botón).
export async function registerVisitor(_prev: VisitorAuthState, formData: FormData): Promise<VisitorAuthState> {
  const ip = await getClientIp();
  const limit = rateLimit(`visitor-register:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return { ok: false, errorCode: "rateLimited" };
  }

  const parsed = visitorRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const fieldErrors: VisitorAuthState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "password") {
        fieldErrors[field] = issueToFieldErrorCode(issue);
      }
    }
    return { ok: false, errorCode: "validation", fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const db = await getDb();
  const [existing] = await db.select().from(visitorUsers).where(eq(visitorUsers.email, email)).limit(1);
  if (existing) {
    return { ok: false, errorCode: "emailTaken" };
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
    return { ok: false, errorCode: "rateLimited" };
  }

  const parsed = visitorLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, errorCode: "validation" };
  }

  const { email, password } = parsed.data;

  const db = await getDb();
  const [visitor] = await db.select().from(visitorUsers).where(eq(visitorUsers.email, email)).limit(1);
  if (!visitor) {
    return { ok: false, errorCode: "invalidCredentials" };
  }

  const valid = await bcrypt.compare(password, visitor.passwordHash);
  if (!valid) {
    return { ok: false, errorCode: "invalidCredentials" };
  }

  await createVisitorSession(visitor);
  return { ok: true };
}

export async function logoutVisitor() {
  await destroyVisitorSession();
}

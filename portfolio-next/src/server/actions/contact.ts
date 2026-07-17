"use server";

import { db } from "@/server/db/client";
import { contactMessages } from "@/server/db/schema";
import { contactSchema } from "@/server/actions/schemas";
import { sendContactEmail, sendVisitorConfirmationEmail } from "@/server/lib/mailer";
import { rateLimit } from "@/server/lib/rate-limit";
import { getClientIp } from "@/server/lib/client-ip";

// Códigos, no texto — el sitio es bilingüe y este Server Action no sabe en
// qué idioma está el visitante. El componente cliente traduce cada código
// con next-intl (ver Contact.errors.* en messages/{es,en}.json).
export type ContactFieldErrorCode = "required" | "tooLong" | "invalidEmail";
export type ContactErrorCode = "rateLimited" | "validation" | "serverError";

export type ContactFormState = {
  ok: boolean;
  errorCode?: ContactErrorCode;
  fieldErrors?: Partial<Record<"name" | "email" | "message", ContactFieldErrorCode>>;
};

function issueToFieldErrorCode(issue: { code: string; format?: string }): ContactFieldErrorCode {
  if (issue.code === "too_big") return "tooLong";
  if (issue.code === "invalid_format" && issue.format === "email") return "invalidEmail";
  return "required";
}

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const ip = await getClientIp();
  const limit = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return { ok: false, errorCode: "rateLimited" };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "email" || field === "message") {
        fieldErrors[field] = issueToFieldErrorCode(issue);
      }
    }
    return { ok: false, errorCode: "validation", fieldErrors };
  }

  const { name, email, message } = parsed.data;

  try {
    await db.insert(contactMessages).values({ name, email, message });
  } catch (err) {
    console.error("No se pudo guardar el mensaje de contacto:", err);
    return { ok: false, errorCode: "serverError" };
  }

  try {
    await sendContactEmail({ name, email, message });
  } catch (err) {
    // El mensaje ya quedó guardado en la base — no hacemos fallar la
    // request completa si Resend falla, para no perder el mensaje.
    console.error("No se pudo enviar el email de contacto:", err);
  }

  // La confirmación al visitante es "nice to have" — si Resend la rechaza
  // (ej. dirección con formato válido pero inexistente), no debe afectar
  // una petición que ya guardó el mensaje y avisó al dueño del sitio.
  sendVisitorConfirmationEmail({ name, email }).catch((err) => {
    console.error("No se pudo enviar la confirmación al visitante:", err);
  });

  return { ok: true };
}

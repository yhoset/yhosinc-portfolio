import "server-only";
import { getEnv } from "@/server/lib/env";

const RESEND_API_URL = "https://api.resend.com/emails";

async function sendEmail({
  to,
  replyTo,
  subject,
  text,
}: {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}) {
  const apiKey = await getEnv("RESEND_API_KEY");
  const from = await getEnv("RESEND_FROM_EMAIL");

  // Corta la llamada a Resend si tarda demasiado, para que una petición
  // externa colgada no vaya acumulando conexiones abiertas.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let res: Response;
  try {
    res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        text,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  const data = await res.json().catch(() => ({}) as { message?: string; id?: string });

  if (!res.ok) {
    console.error("Resend rechazó el envío:", data);
    throw new Error(data.message || "No se pudo enviar el email");
  }

  console.log("Email enviado vía Resend:", { id: data.id, to });
}

export async function sendContactEmail({ name, email, message }: { name: string; email: string; message: string }) {
  const inbox = await getEnv("CONTACT_INBOX_EMAIL");
  if (!inbox) throw new Error("Falta CONTACT_INBOX_EMAIL en el entorno");
  await sendEmail({
    to: inbox,
    replyTo: email,
    subject: `Nuevo mensaje de contacto — ${name}`,
    text: `De: ${name} <${email}>\n\n${message}`,
  });
}

export async function sendVisitorConfirmationEmail({ name, email }: { name: string; email: string }) {
  await sendEmail({
    to: email,
    subject: "Recibimos tu mensaje — YHOSINC",
    text: `Hola ${name},\n\nRecibimos tu mensaje y te vamos a responder pronto a esta misma dirección.\n\n— YHOSINC`,
  });
}

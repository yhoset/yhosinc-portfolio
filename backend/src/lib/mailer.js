const RESEND_API_URL = "https://api.resend.com/emails";

async function sendEmail({ to, replyTo, subject, text }) {
  // Corta la llamada a Resend si tarda demasiado, para que una petición
  // externa colgada no vaya acumulando conexiones abiertas en el servidor.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let res;
  try {
    res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
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

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Resend rechazó el envío:", data);
    throw new Error(data.message || "No se pudo enviar el email");
  }

  console.log("Email enviado vía Resend:", { id: data.id, to });
}

export async function sendContactEmail({ name, email, message }) {
  await sendEmail({
    to: process.env.CONTACT_INBOX_EMAIL,
    replyTo: email,
    subject: `Nuevo mensaje de contacto — ${name}`,
    text: `De: ${name} <${email}>\n\n${message}`,
  });
}

export async function sendVisitorConfirmationEmail({ name, email }) {
  await sendEmail({
    to: email,
    subject: "Recibimos tu mensaje — YHOSINC",
    text: `Hola ${name},\n\nRecibimos tu mensaje y te vamos a responder pronto a esta misma dirección.\n\n— YHOSINC`,
  });
}

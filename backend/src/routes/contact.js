import { Router } from "express";
import rateLimit from "express-rate-limit";
import { contactSchema } from "../schemas/contact.js";
import { prisma } from "../lib/prisma.js";
import { sendContactEmail, sendVisitorConfirmationEmail } from "../lib/mailer.js";

export const contactRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later." },
});

contactRouter.post("/", contactLimiter, async (req, res, next) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid data", details: parsed.error.issues.map((i) => i.message) });
  }

  const { name, email, message } = parsed.data;

  try {
    await prisma.contactMessage.create({ data: { name, email, message } });
    await sendContactEmail({ name, email, message });
    // La confirmación al visitante es un "nice to have" — si Resend la
    // rechaza (ej. dirección inválida que igual pasó la validación de
    // formato), no debe tumbar una petición que ya guardó el mensaje y
    // avisó al dueño del sitio correctamente.
    sendVisitorConfirmationEmail({ name, email }).catch((err) => {
      console.error("No se pudo enviar la confirmación al visitante:", err);
    });
    res.status(201).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
});

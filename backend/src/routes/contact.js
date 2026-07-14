import { Router } from "express";
import rateLimit from "express-rate-limit";
import { contactSchema } from "../schemas/contact.js";
import { prisma } from "../lib/prisma.js";
import { sendContactEmail } from "../lib/mailer.js";

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
    res.status(201).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
});

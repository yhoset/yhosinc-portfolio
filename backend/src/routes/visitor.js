import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { visitorRegisterSchema, visitorLoginSchema } from "../schemas/visitor.js";
import { prisma } from "../lib/prisma.js";
import { signVisitorToken } from "../lib/jwt.js";
import { requireVisitorAuth } from "../middleware/requireVisitorAuth.js";

export const visitorRouter = Router();

// Función construida a pedido del usuario pero mantenida sin ningún punto
// de entrada visible en el frontend hasta nuevo aviso — igual queda
// protegida acá por las mismas buenas prácticas que el resto del backend
// (nunca depender solo de que el frontend no muestre el botón).
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Intenta de nuevo más tarde." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Intenta de nuevo más tarde." },
});

visitorRouter.post("/register", registerLimiter, async (req, res, next) => {
  const parsed = visitorRegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.issues.map((i) => i.message) });
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await prisma.visitorUser.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Ya existe una cuenta con ese email" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const visitor = await prisma.visitorUser.create({ data: { name, email, passwordHash } });

    const token = signVisitorToken(visitor);
    res.status(201).json({ token, name: visitor.name, email: visitor.email });
  } catch (err) {
    next(err);
  }
});

visitorRouter.post("/login", loginLimiter, async (req, res, next) => {
  const parsed = visitorLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const { email, password } = parsed.data;

  try {
    const visitor = await prisma.visitorUser.findUnique({ where: { email } });
    if (!visitor) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const valid = await bcrypt.compare(password, visitor.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = signVisitorToken(visitor);
    res.status(200).json({ token, name: visitor.name, email: visitor.email });
  } catch (err) {
    next(err);
  }
});

visitorRouter.get("/me", requireVisitorAuth, (req, res) => {
  res.status(200).json({ name: req.visitor.name, email: req.visitor.email });
});

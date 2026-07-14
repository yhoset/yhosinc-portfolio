import { Router } from "express";
import rateLimit from "express-rate-limit";
import { analyticsEventSchema } from "../schemas/analytics.js";
import { prisma } from "../lib/prisma.js";

export const analyticsRouter = Router();

const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many events sent." },
});

analyticsRouter.post("/event", analyticsLimiter, async (req, res, next) => {
  const parsed = analyticsEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const { type, projectSlug } = parsed.data;

  try {
    await prisma.analyticsEvent.create({ data: { type, projectSlug: projectSlug ?? null } });
    res.status(201).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
});

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { commentSchema } from "../schemas/comment.js";
import { prisma } from "../lib/prisma.js";
import { requireVisitorAuth } from "../middleware/requireVisitorAuth.js";

export const commentsRouter = Router();

const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados comentarios enviados. Intenta de nuevo más tarde." },
});

// projectSlug viene de la URL, no del body — igual se acota el largo para
// no dejar pasar cualquier cosa a una consulta de Prisma.
function isValidSlug(slug) {
  return typeof slug === "string" && slug.length > 0 && slug.length <= 100;
}

commentsRouter.get("/:slug/comments", async (req, res, next) => {
  const { slug } = req.params;
  if (!isValidSlug(slug)) {
    return res.status(400).json({ error: "Proyecto inválido" });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { projectSlug: slug, status: "approved" },
      orderBy: { createdAt: "desc" },
      include: { visitor: { select: { name: true } } },
    });
    res.status(200).json(
      comments.map((c) => ({ id: c.id, content: c.content, createdAt: c.createdAt, name: c.visitor.name }))
    );
  } catch (err) {
    next(err);
  }
});

commentsRouter.post("/:slug/comments", commentLimiter, requireVisitorAuth, async (req, res, next) => {
  const { slug } = req.params;
  if (!isValidSlug(slug)) {
    return res.status(400).json({ error: "Proyecto inválido" });
  }

  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        projectSlug: slug,
        content: parsed.data.content,
        visitorId: req.visitor.sub,
        status: "pending",
      },
    });
    res.status(201).json({ id: comment.id, status: comment.status });
  } catch (err) {
    next(err);
  }
});

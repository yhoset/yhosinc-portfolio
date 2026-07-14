import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get("/messages", async (req, res, next) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/analytics", async (req, res, next) => {
  try {
    const [totalPageviews, totalProjectViews, byProject] = await Promise.all([
      prisma.analyticsEvent.count({ where: { type: "pageview" } }),
      prisma.analyticsEvent.count({ where: { type: "project_view" } }),
      prisma.analyticsEvent.groupBy({
        by: ["projectSlug"],
        where: { type: "project_view", projectSlug: { not: null } },
        _count: { _all: true },
      }),
    ]);

    res.status(200).json({
      totalPageviews,
      totalProjectViews,
      byProject: byProject.map((p) => ({ projectSlug: p.projectSlug, views: p._count._all })),
    });
  } catch (err) {
    next(err);
  }
});

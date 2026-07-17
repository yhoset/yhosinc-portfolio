"use server";

import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/server/db/client";
import { contactMessages, analyticsEvents, comments, visitorUsers } from "@/server/db/schema";
import { moderateCommentSchema } from "@/server/actions/schemas";
import { getAdminSession } from "@/server/auth/session";

// Cada función vuelve a chequear la sesión de admin en el propio server —
// nunca confía en que el que llama ya haya validado nada del lado cliente.
async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) {
    throw new Error("No autenticado");
  }
  return admin;
}

export async function getMessages() {
  await requireAdmin();
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function getAnalyticsSummary() {
  await requireAdmin();

  const [[{ count: totalPageviews }], [{ count: totalProjectViews }], byProject] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.type, "pageview")),
    db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.type, "project_view")),
    db
      .select({ projectSlug: analyticsEvents.projectSlug, views: sql<number>`count(*)` })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.type, "project_view"))
      .groupBy(analyticsEvents.projectSlug),
  ]);

  return {
    totalPageviews,
    totalProjectViews,
    byProject: byProject
      .filter((p) => p.projectSlug !== null)
      .map((p) => ({ projectSlug: p.projectSlug as string, views: p.views })),
  };
}

export async function getAllComments() {
  await requireAdmin();
  return db
    .select({
      id: comments.id,
      projectSlug: comments.projectSlug,
      content: comments.content,
      status: comments.status,
      createdAt: comments.createdAt,
      visitorName: visitorUsers.name,
      visitorEmail: visitorUsers.email,
    })
    .from(comments)
    .innerJoin(visitorUsers, eq(comments.visitorId, visitorUsers.id))
    .orderBy(desc(comments.createdAt));
}

export async function moderateComment(id: number, status: "approved" | "rejected") {
  await requireAdmin();

  const parsed = moderateCommentSchema.safeParse({ id, status });
  if (!parsed.success) {
    throw new Error("Datos inválidos");
  }

  const [updated] = await db
    .update(comments)
    .set({ status: parsed.data.status })
    .where(eq(comments.id, parsed.data.id))
    .returning();

  if (!updated) {
    throw new Error("Comentario no encontrado");
  }

  return updated;
}

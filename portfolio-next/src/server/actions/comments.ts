"use server";

import { and, eq, desc } from "drizzle-orm";
import { db } from "@/server/db/client";
import { comments, visitorUsers } from "@/server/db/schema";
import { commentSchema } from "@/server/actions/schemas";
import { getVisitorSession } from "@/server/auth/session";
import { rateLimit } from "@/server/lib/rate-limit";
import { getClientIp } from "@/server/lib/client-ip";

export type CommentState = { ok: boolean; error?: string };

export async function getApprovedComments(projectSlug: string) {
  const rows = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      name: visitorUsers.name,
    })
    .from(comments)
    .innerJoin(visitorUsers, eq(comments.visitorId, visitorUsers.id))
    .where(and(eq(comments.projectSlug, projectSlug), eq(comments.status, "approved")))
    .orderBy(desc(comments.createdAt));
  return rows;
}

export async function createComment(_prev: CommentState, formData: FormData): Promise<CommentState> {
  const visitor = await getVisitorSession();
  if (!visitor) {
    return { ok: false, error: "No autenticado" };
  }

  const ip = await getClientIp();
  const limit = rateLimit(`comment:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return { ok: false, error: "Enviaste demasiados comentarios. Probá de nuevo más tarde." };
  }

  const parsed = commentSchema.safeParse({
    projectSlug: formData.get("projectSlug"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Datos inválidos" };
  }

  await db.insert(comments).values({
    projectSlug: parsed.data.projectSlug,
    content: parsed.data.content,
    visitorId: Number(visitor.sub),
    status: "pending",
  });

  return { ok: true };
}

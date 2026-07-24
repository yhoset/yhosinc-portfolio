"use server";

import { and, eq, desc } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { comments, visitorUsers } from "@/server/db/schema";
import { commentSchema } from "@/server/actions/schemas";
import { getVisitorSession } from "@/server/auth/session";
import { rateLimit } from "@/server/lib/rate-limit";
import { getClientIp } from "@/server/lib/client-ip";

// Códigos, no texto — mismo criterio que actions/contact.ts y
// actions/visitor.ts: página bilingüe, el componente cliente traduce cada
// código con next-intl (Comments.errors.*).
export type CommentErrorCode = "notAuthenticated" | "rateLimited" | "validation" | "serverError";
export type CommentState = { ok: boolean; errorCode?: CommentErrorCode };

export async function getApprovedComments(projectSlug: string) {
  const db = await getDb();
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
    return { ok: false, errorCode: "notAuthenticated" };
  }

  const ip = await getClientIp();
  const limit = rateLimit(`comment:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return { ok: false, errorCode: "rateLimited" };
  }

  const parsed = commentSchema.safeParse({
    projectSlug: formData.get("projectSlug"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { ok: false, errorCode: "validation" };
  }

  const db = await getDb();
  try {
    await db.insert(comments).values({
      projectSlug: parsed.data.projectSlug,
      content: parsed.data.content,
      visitorId: Number(visitor.sub),
      status: "pending",
    });
  } catch (err) {
    console.error("No se pudo guardar el comentario:", err);
    return { ok: false, errorCode: "serverError" };
  }

  return { ok: true };
}

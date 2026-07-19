"use server";

import { getDb } from "@/server/db/client";
import { analyticsEvents } from "@/server/db/schema";
import { analyticsEventSchema } from "@/server/actions/schemas";
import { rateLimit } from "@/server/lib/rate-limit";
import { getClientIp } from "@/server/lib/client-ip";

export async function trackEvent(type: "pageview" | "project_view", projectSlug?: string) {
  const ip = await getClientIp();
  const limit = rateLimit(`analytics:${ip}`, 30, 15 * 60 * 1000);
  if (!limit.ok) return;

  const parsed = analyticsEventSchema.safeParse({ type, projectSlug });
  if (!parsed.success) return;

  try {
    const db = await getDb();
    await db.insert(analyticsEvents).values({
      type: parsed.data.type,
      projectSlug: parsed.data.projectSlug ?? null,
    });
  } catch (err) {
    // Analítica es "best effort" — nunca debe romper la navegación del
    // visitante si la escritura falla.
    console.error("No se pudo registrar el evento de analítica:", err);
  }
}

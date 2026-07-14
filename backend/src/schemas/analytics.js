import { z } from "zod";

export const analyticsEventSchema = z.object({
  type: z.enum(["pageview", "project_view"]),
  projectSlug: z.string().trim().min(1).max(100).optional(),
});

import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().trim().min(1, "El comentario no puede estar vacío").max(1000),
});

import { z } from "zod";

// Sin mensajes de error custom a propósito: el sitio es bilingüe (ES/EN) y
// estos issues nunca se muestran tal cual — el Server Action los traduce a
// códigos (ver ContactFormState en actions/contact.ts) que el componente
// cliente resuelve con next-intl, así el idioma del error siempre coincide
// con el idioma de la página.
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(2000),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const visitorRegisterSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("Email inválido").max(200),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(200),
});

export const visitorLoginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const commentSchema = z.object({
  projectSlug: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1, "El comentario no puede estar vacío").max(1000),
});

export const analyticsEventSchema = z.object({
  type: z.enum(["pageview", "project_view"]),
  projectSlug: z.string().trim().min(1).max(100).optional(),
});

export const moderateCommentSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["approved", "rejected"]),
});

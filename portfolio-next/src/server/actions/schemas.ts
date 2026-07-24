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

// CRUD de proyectos (panel admin, Fase 10 post-deploy). `slug` restringido
// a minúsculas/números/guiones porque termina siendo parte de la URL
// (/proyectos/<slug>) — mismo criterio que los slugs de tools. `tags` llega
// del form como texto separado por comas, se parte y limpia antes de
// validar cada tag individualmente.
const projectTranslationFieldsSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(120),
  tagline: z.string().trim().min(1, "El tagline es obligatorio").max(200),
  blurb: z.string().trim().min(1, "La descripción corta es obligatoria").max(400),
  content: z.string().trim().min(1, "El contenido es obligatorio").max(20000),
});

export const projectFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El slug es obligatorio")
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones (sin espacios)"),
  category: z.enum(["WEB", "DESIGN", "DEV", "RESEARCH"]),
  size: z.enum(["lg", "md", "sm"]),
  tags: z
    .string()
    .transform((v) =>
      v
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.string().max(40)).max(10, "Máximo 10 tags")),
  link: z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.string().url("URL inválida").max(300).optional()),
  es: projectTranslationFieldsSchema,
  en: projectTranslationFieldsSchema,
});

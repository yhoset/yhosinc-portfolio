import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";

// Modelo heredado de v1 (backend/prisma/schema.prisma), portado 1:1 a
// Drizzle — mismos nombres de tabla/columna para no perder los datos que
// ya existen en la Turso de producción cuando esta app apunte ahí.

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const analyticsEvents = sqliteTable("analytics_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  projectSlug: text("project_slug"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Cuentas de visitantes (distintas de adminUsers) — para comentar en
// proyectos y auto-completar el formulario de contacto. Backend listo,
// sin punto de entrada visible en el frontend todavía (mismo criterio que
// v1: feature construida pero oculta hasta nuevo aviso).
export const visitorUsers = sqliteTable("visitor_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const comments = sqliteTable(
  "comments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectSlug: text("project_slug").notNull(),
    content: text("content").notNull(),
    status: text("status").notNull().default("pending"), // pending | approved | rejected
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    visitorId: integer("visitor_id")
      .notNull()
      .references(() => visitorUsers.id),
  },
  (table) => [index("comments_project_slug_status_idx").on(table.projectSlug, table.status)]
);

// Fase 10 (post-deploy): Proyectos pasa de archivos .mdx a la base, para
// que el admin los cargue desde /admin en vez de tocar código. `tags` va
// como JSON-en-texto (array de strings) — son solo etiquetas cosméticas,
// no ameritan una tabla de join para esto. `category`/`size` se validan
// como enum en Zod (server/actions/schemas.ts), no a nivel de columna —
// SQLite no tiene CHECK enum nativo cómodo vía Drizzle acá.
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // WEB | DESIGN | DEV | RESEARCH
  size: text("size").notNull().default("md"), // lg | md | sm
  tags: text("tags").notNull().default("[]"),
  link: text("link"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Contenido por idioma, separado del proyecto en sí — mismo patrón que
// v1 tenía con es.mdx/en.mdx, pero como filas en vez de archivos. `content`
// es Markdown (no HTML ni JSX) — se renderiza server-side con un parser
// que escapa HTML crudo, nunca dangerouslySetInnerHTML directo sobre esto.
export const projectTranslations = sqliteTable(
  "project_translations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(), // "es" | "en"
    title: text("title").notNull(),
    tagline: text("tagline").notNull(),
    blurb: text("blurb").notNull(),
    content: text("content").notNull(),
  },
  (table) => [
    uniqueIndex("project_translations_project_locale_unique").on(table.projectId, table.locale),
  ]
);

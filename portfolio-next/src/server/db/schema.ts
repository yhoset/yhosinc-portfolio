import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";

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

"use server";

import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { projects, projectTranslations } from "@/server/db/schema";
import { projectFormSchema } from "@/server/actions/schemas";
import { requireAdmin } from "@/server/actions/admin";

export type ProjectFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseFormData(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    category: String(formData.get("category") ?? ""),
    size: String(formData.get("size") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    link: String(formData.get("link") ?? ""),
    es: {
      title: String(formData.get("title_es") ?? ""),
      tagline: String(formData.get("tagline_es") ?? ""),
      blurb: String(formData.get("blurb_es") ?? ""),
      content: String(formData.get("content_es") ?? ""),
    },
    en: {
      title: String(formData.get("title_en") ?? ""),
      tagline: String(formData.get("tagline_en") ?? ""),
      blurb: String(formData.get("blurb_en") ?? ""),
      content: String(formData.get("content_en") ?? ""),
    },
  };
}

function fieldErrorsFrom(error: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    out[issue.path.join(".")] = issue.message;
  }
  return out;
}

// Listado para la tabla del panel — trae ambos idiomas juntos en un solo
// viaje (dos queries chicas, no un join: project_translations tiene una
// fila por idioma, un join duplicaría cada proyecto).
export async function listProjectsAdmin() {
  await requireAdmin();
  const db = await getDb();
  const [allProjects, allTranslations] = await Promise.all([
    db.select().from(projects).orderBy(desc(projects.createdAt)),
    db.select().from(projectTranslations),
  ]);

  return allProjects.map((p) => ({
    ...p,
    tags: JSON.parse(p.tags) as string[],
    es: allTranslations.find((t) => t.projectId === p.id && t.locale === "es") ?? null,
    en: allTranslations.find((t) => t.projectId === p.id && t.locale === "en") ?? null,
  }));
}

export async function getProjectForEdit(id: number) {
  await requireAdmin();
  const db = await getDb();
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!project) return null;

  const translations = await db
    .select()
    .from(projectTranslations)
    .where(eq(projectTranslations.projectId, id));

  return {
    ...project,
    tags: JSON.parse(project.tags) as string[],
    es: translations.find((t) => t.locale === "es") ?? null,
    en: translations.find((t) => t.locale === "en") ?? null,
  };
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const parsed = projectFormSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { ok: false, error: "Revisá los campos marcados.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const db = await getDb();

  const existing = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, parsed.data.slug))
    .limit(1);
  if (existing.length > 0) {
    return {
      ok: false,
      error: "Ya existe un proyecto con ese slug.",
      fieldErrors: { slug: "Ya existe un proyecto con ese slug." },
    };
  }

  const [created] = await db
    .insert(projects)
    .values({
      slug: parsed.data.slug,
      category: parsed.data.category,
      size: parsed.data.size,
      tags: JSON.stringify(parsed.data.tags),
      link: parsed.data.link ?? null,
    })
    .returning();

  await db.insert(projectTranslations).values([
    { projectId: created.id, locale: "es", ...parsed.data.es },
    { projectId: created.id, locale: "en", ...parsed.data.en },
  ]);

  return { ok: true };
}

export async function updateProject(
  id: number,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const parsed = projectFormSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { ok: false, error: "Revisá los campos marcados.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const db = await getDb();

  const duplicateSlug = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, parsed.data.slug))
    .limit(1);
  if (duplicateSlug.length > 0 && duplicateSlug[0].id !== id) {
    return {
      ok: false,
      error: "Ya existe otro proyecto con ese slug.",
      fieldErrors: { slug: "Ya existe otro proyecto con ese slug." },
    };
  }

  const [updated] = await db
    .update(projects)
    .set({
      slug: parsed.data.slug,
      category: parsed.data.category,
      size: parsed.data.size,
      tags: JSON.stringify(parsed.data.tags),
      link: parsed.data.link ?? null,
    })
    .where(eq(projects.id, id))
    .returning();

  if (!updated) {
    return { ok: false, error: "Proyecto no encontrado." };
  }

  // AND explícito por locale: cada proyecto tiene 2 filas de traducción
  // (una por idioma) con el mismo projectId — sin filtrar también por
  // locale, el update de "en" pisaría la fila de "es" (y viceversa) en
  // vez de actualizar solo la suya.
  for (const locale of ["es", "en"] as const) {
    await db
      .update(projectTranslations)
      .set(parsed.data[locale])
      .where(
        and(eq(projectTranslations.projectId, id), eq(projectTranslations.locale, locale))
      );
  }

  return { ok: true };
}

export async function deleteProject(id: number) {
  await requireAdmin();
  const db = await getDb();
  const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning();
  if (!deleted) {
    throw new Error("Proyecto no encontrado");
  }
  return deleted;
}

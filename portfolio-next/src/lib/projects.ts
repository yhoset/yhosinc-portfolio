import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { projects, projectTranslations } from "@/server/db/schema";
import type { routing } from "@/i18n/routing";

export type ProjectCategory = "WEB" | "DESIGN" | "DEV" | "RESEARCH";
export type ProjectSize = "lg" | "md" | "sm";

export type ProjectMetadata = {
  title: string;
  category: ProjectCategory;
  tagline: string;
  blurb: string;
  tags: string[];
  size: ProjectSize;
  link?: string;
};

export type ProjectDetail = ProjectMetadata & { content: string };

type Locale = (typeof routing.locales)[number];

// Fase 10 (post-deploy): reemplaza la lista cerrada PROJECT_SLUGS + imports
// dinámicos de .mdx — los proyectos ahora viven en la DB (projects +
// project_translations) y se cargan desde /admin, no desde el filesystem.
// El slug ya no necesita una allowlist en código: `WHERE slug = ?`
// parametrizado es seguro para cualquier string, a diferencia del import
// dinámico por path que sí requería ese cierre.
export async function getAllProjectsMetadata(
  locale: Locale
): Promise<Array<ProjectMetadata & { slug: string }>> {
  const db = await getDb();
  const rows = await db
    .select({
      slug: projects.slug,
      category: projects.category,
      size: projects.size,
      tags: projects.tags,
      link: projects.link,
      title: projectTranslations.title,
      tagline: projectTranslations.tagline,
      blurb: projectTranslations.blurb,
    })
    .from(projects)
    .innerJoin(
      projectTranslations,
      and(eq(projectTranslations.projectId, projects.id), eq(projectTranslations.locale, locale))
    )
    .orderBy(desc(projects.createdAt));

  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    category: r.category as ProjectCategory,
    size: r.size as ProjectSize,
    tags: JSON.parse(r.tags) as string[],
    link: r.link ?? undefined,
    tagline: r.tagline,
    blurb: r.blurb,
  }));
}

export async function getProjectDetail(
  slug: string,
  locale: Locale
): Promise<ProjectDetail | null> {
  const db = await getDb();
  const [row] = await db
    .select({
      category: projects.category,
      size: projects.size,
      tags: projects.tags,
      link: projects.link,
      title: projectTranslations.title,
      tagline: projectTranslations.tagline,
      blurb: projectTranslations.blurb,
      content: projectTranslations.content,
    })
    .from(projects)
    .innerJoin(
      projectTranslations,
      and(eq(projectTranslations.projectId, projects.id), eq(projectTranslations.locale, locale))
    )
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!row) return null;

  return {
    title: row.title,
    category: row.category as ProjectCategory,
    size: row.size as ProjectSize,
    tags: JSON.parse(row.tags) as string[],
    link: row.link ?? undefined,
    tagline: row.tagline,
    blurb: row.blurb,
    content: row.content,
  };
}

export async function getProjectSlugs(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.select({ slug: projects.slug }).from(projects);
  return rows.map((r) => r.slug);
}

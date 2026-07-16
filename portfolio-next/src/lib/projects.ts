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

type Locale = (typeof routing.locales)[number];

// Lista cerrada y explícita de proyectos publicados — no se auto-descubre
// desde el filesystem. Ver src/content/projects/README.md. Agregar acá el
// slug es lo que realmente "publica" un proyecto: generateStaticParams y
// getProjectSlugs() solo devuelven lo que está en este array, así que
// ninguna carpeta suelta en src/content/projects/ queda accesible por
// accidente.
export const PROJECT_SLUGS: string[] = [];

export function getProjectSlugs(): string[] {
  return PROJECT_SLUGS;
}

export async function getProjectMetadata(
  slug: string,
  locale: Locale
): Promise<ProjectMetadata | null> {
  if (!PROJECT_SLUGS.includes(slug)) return null;
  try {
    const mod = await import(`@/content/projects/${slug}/${locale}.mdx`);
    return mod.metadata as ProjectMetadata;
  } catch {
    return null;
  }
}

export async function getAllProjectsMetadata(
  locale: Locale
): Promise<Array<ProjectMetadata & { slug: string }>> {
  const entries = await Promise.all(
    PROJECT_SLUGS.map(async (slug) => {
      const metadata = await getProjectMetadata(slug, locale);
      return metadata ? { ...metadata, slug } : null;
    })
  );
  return entries.filter((p): p is ProjectMetadata & { slug: string } => p !== null);
}

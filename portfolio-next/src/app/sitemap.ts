import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { TOOLS } from "@/lib/tools";
import { getProjectSlugs } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

// Rutas estáticas de [locale] — /admin queda afuera a propósito (noindex,
// ver robots.ts). Tools y proyectos se agregan dinámicamente desde sus
// listas cerradas (lib/tools.ts, lib/projects.ts) para no tener que
// recordar actualizar este archivo cada vez que se suma uno.
const STATIC_PATHS = ["", "/proyectos", "/skills", "/roadmap", "/tools", "/sobre-mi", "/contacto", "/cuenta"];

// Los slugs de proyectos ahora vienen de la DB (Fase 10 post-deploy) — sin
// force-dynamic, Next prerenderiza este sitemap en build time y un
// proyecto agregado desde /admin después del deploy no aparecería acá
// hasta el próximo rebuild.
export const dynamic = "force-dynamic";

function localizedEntry(path: string): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
  );

  return {
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const toolPaths = TOOLS.map((tool) => `/tools/${tool.id}`);
  const slugs = await getProjectSlugs();
  const projectPaths = slugs.map((slug) => `/proyectos/${slug}`);

  return [...STATIC_PATHS, ...toolPaths, ...projectPaths].map(localizedEntry);
}

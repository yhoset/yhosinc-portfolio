import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { TOOLS } from "@/lib/tools";
import { getProjectSlugs } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

// Rutas estáticas de [locale] — /admin queda afuera a propósito (noindex,
// ver robots.ts). Tools y proyectos se agregan dinámicamente desde sus
// listas cerradas (lib/tools.ts, lib/projects.ts) para no tener que
// recordar actualizar este archivo cada vez que se suma uno.
const STATIC_PATHS = ["", "/proyectos", "/skills", "/roadmap", "/tools", "/sobre-mi", "/contacto"];

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

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPaths = TOOLS.map((tool) => `/tools/${tool.id}`);
  const projectPaths = getProjectSlugs().map((slug) => `/proyectos/${slug}`);

  return [...STATIC_PATHS, ...toolPaths, ...projectPaths].map(localizedEntry);
}

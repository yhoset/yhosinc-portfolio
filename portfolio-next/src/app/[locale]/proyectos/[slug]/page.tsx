import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getProjectMetadata, getProjectSlugs } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjectSlugs().map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !getProjectSlugs().includes(slug)) {
    notFound();
  }

  const meta = await getProjectMetadata(slug, locale as (typeof routing.locales)[number]);
  if (!meta) notFound();

  return pageMetadata({
    locale,
    path: `/proyectos/${slug}`,
    title: meta.title,
    description: meta.blurb,
  });
}

// Lista cerrada: un slug que no esté en src/lib/projects.ts da 404 directo,
// nunca intenta importar un archivo arbitrario. Ver seguridad-y-optimizacion.md
// y src/content/projects/README.md.
//
// dynamicParams=true (no false) a propósito: con @opennextjs/cloudflare
// 1.20.1, dynamicParams=false hace que el runtime de Cloudflare Workers
// rechace con NoFallbackError (404) incluso los slugs VÁLIDOS listados en
// generateStaticParams — confirmado con wrangler dev real en /tools/[tool],
// mismo patrón de ruta (arquitectura.md §8.7). El corte de la lista cerrada
// lo siguen garantizando los chequeos manuales de abajo
// (`getProjectSlugs().includes(slug)`, en generateMetadata Y en el default
// export, antes del import dinámico del MDX) — ya existían como defensa en
// profundidad, dynamicParams=true solo cambia DÓNDE se aplica el corte.
export const dynamicParams = true;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  if (!getProjectSlugs().includes(slug)) {
    notFound();
  }

  const { default: CaseStudy, metadata } = await import(
    `@/content/projects/${slug}/${locale}.mdx`
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-label text-sm tracking-widest text-cyan">{metadata.category}</p>
      <h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">{metadata.title}</h1>
      <p className="font-label mt-2 text-lg text-white/60">{metadata.tagline}</p>
      <div className="mt-10">
        <CaseStudy />
      </div>
    </article>
  );
}

import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getProjectSlugs } from "@/lib/projects";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjectSlugs().map((slug) => ({ locale, slug }))
  );
}

// Ninguna ruta fuera de generateStaticParams se renderiza on-demand — un
// slug que no esté en la lista cerrada de src/lib/projects.ts da 404
// directo, nunca intenta importar un archivo arbitrario. Ver
// seguridad-y-optimizacion.md y src/content/projects/README.md.
export const dynamicParams = false;

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

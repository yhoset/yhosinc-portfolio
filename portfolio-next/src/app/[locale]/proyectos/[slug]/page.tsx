import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import ReactMarkdown from "react-markdown";
import { routing } from "@/i18n/routing";
import { getProjectDetail } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";
import { markdownComponents } from "@/lib/markdown-components";
import { CommentsSection } from "@/components/comments/comments-section";

// Contenido viene de la DB y lo agrega el admin en runtime — sin
// generateStaticParams (la lista de slugs ya no es fija en build time) y
// force-dynamic para que un proyecto nuevo aparezca sin rebuild/redeploy.
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const project = await getProjectDetail(slug, locale);
  if (!project) notFound();

  return pageMetadata({
    locale,
    path: `/proyectos/${slug}`,
    title: project.title,
    description: project.blurb,
  });
}

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

  const project = await getProjectDetail(slug, locale);
  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-label text-sm tracking-widest text-cyan">{project.category}</p>
      <h1 className="font-display mt-2 text-4xl text-white sm:text-5xl">{project.title}</h1>
      <p className="font-label mt-2 text-lg text-white/60">{project.tagline}</p>
      <div className="mt-10">
        <ReactMarkdown components={markdownComponents}>{project.content}</ReactMarkdown>
      </div>
      <CommentsSection slug={slug} locale={locale} />
    </article>
  );
}

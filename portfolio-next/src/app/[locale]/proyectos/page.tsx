import type { Metadata } from "next";
import { Suspense } from "react";
import { useTranslations, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAllProjectsMetadata } from "@/lib/projects";
import { FilteredProjectsGrid } from "@/components/projects/filtered-projects-grid";
import { FloatingGlyph } from "@/components/decor/floating-glyph";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Contenido viene de la DB y lo agrega el admin en runtime — force-dynamic
// para que aparezca sin esperar un rebuild/redeploy (evita además cualquier
// problema de ISR/incremental cache en Cloudflare Workers, ver arquitectura.md).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.projects" });
  return pageMetadata({ locale, path: "/proyectos", title: t("title"), description: t("description") });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const projects = await getAllProjectsMetadata(locale);

  return <ProjectsList projects={projects} />;
}

function ProjectsList({
  projects,
}: {
  projects: Awaited<ReturnType<typeof getAllProjectsMetadata>>;
}) {
  const t = useTranslations("Projects");

  if (projects.length === 0) {
    return (
      <div className="halftone-bg flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
        <FloatingGlyph className="chapter-num" style={{ color: "var(--color-cyan)" }}>
          ?
        </FloatingGlyph>
        <h1 className="font-display mt-4 text-4xl text-white sm:text-5xl">
          {t("emptyTitle")}
        </h1>
        <p className="mt-3 max-w-md text-white/60">{t("emptyBody")}</p>
      </div>
    );
  }

  return (
    <div className="halftone-bg min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="section-title-panel mb-10">{t("title")}</h1>
        {/* useSearchParams (para el filtro ?skill=) necesita un límite de
            Suspense — el resto de la página sigue prerenderizándose estático,
            solo esta parte se hidrata en el cliente. */}
        <Suspense fallback={null}>
          <FilteredProjectsGrid projects={projects} />
        </Suspense>
      </div>
    </div>
  );
}

import type { ComponentType } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { TOOLS, type ToolId } from "@/lib/tools";
import { pageMetadata } from "@/lib/metadata";

// Cada tool en su propio chunk: las seis viven en este único page.tsx (una
// sola ruta dinámica /tools/[tool] para todos los slugs), así que importarlas
// de forma directa las bundlea juntas — visitar /tools/paleta descargaría
// también el Sobel+halftone de Manga-fy. Con next/dynamic, el navegador solo
// pide el chunk del tool que realmente se renderiza.
const PaletteExtractor = dynamic(() =>
  import("@/components/tools/palette-extractor").then((m) => m.PaletteExtractor)
);
const GradientGenerator = dynamic(() =>
  import("@/components/tools/gradient-generator").then((m) => m.GradientGenerator)
);
const TypeScaleGenerator = dynamic(() =>
  import("@/components/tools/type-scale-generator").then((m) => m.TypeScaleGenerator)
);
const ComicShadowGenerator = dynamic(() =>
  import("@/components/tools/comic-shadow-generator").then((m) => m.ComicShadowGenerator)
);
const EasingEditor = dynamic(() =>
  import("@/components/tools/easing-editor").then((m) => m.EasingEditor)
);
const Mangafy = dynamic(() => import("@/components/tools/mangafy").then((m) => m.Mangafy));

// Lista cerrada: solo los slugs de TOOLS generan una ruta válida — cualquier
// otro valor de [tool] cae en notFound() sin intentar resolver nada
// dinámicamente (mismo criterio de seguridad que /proyectos/[slug]).
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => TOOLS.map((tool) => ({ locale, tool: tool.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}): Promise<Metadata> {
  const { locale, tool } = await params;
  const meta = TOOLS.find((t) => t.id === tool);
  if (!meta) notFound();

  const t = await getTranslations({ locale, namespace: `Tools.items.${meta.id}` });
  return pageMetadata({
    locale,
    path: `/tools/${meta.id}`,
    title: t("title"),
    description: t("description"),
  });
}

const TOOL_COMPONENTS: Record<ToolId, ComponentType> = {
  paleta: PaletteExtractor,
  gradientes: GradientGenerator,
  "escala-tipografica": TypeScaleGenerator,
  "sombra-comic": ComicShadowGenerator,
  "editor-de-easing": EasingEditor,
  mangafy: Mangafy,
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}) {
  const { locale, tool } = await params;
  setRequestLocale(locale);

  const meta = TOOLS.find((t) => t.id === tool);
  if (!meta) notFound();

  const ToolComponent = TOOL_COMPONENTS[meta.id];

  return <ToolDetail toolId={meta.id} ToolComponent={ToolComponent} />;
}

function ToolDetail({ toolId, ToolComponent }: { toolId: ToolId; ToolComponent: ComponentType }) {
  const t = useTranslations("Tools");

  return (
    <div className="halftone-panel min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-6">
      <div className="mx-auto mb-8 max-w-2xl">
        <Link
          href="/tools"
          className="font-label mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-cyan"
        >
          <ArrowLeft size={16} /> {t("backToIndex")}
        </Link>
        <h1 className="font-display mb-2 text-3xl text-white">{t(`items.${toolId}.title`)}</h1>
        <p className="text-white/70">{t(`items.${toolId}.description`)}</p>
      </div>
      <ToolComponent />
    </div>
  );
}

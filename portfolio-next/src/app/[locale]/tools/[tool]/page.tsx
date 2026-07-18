import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { TOOLS, type ToolId } from "@/lib/tools";
import { PaletteExtractor } from "@/components/tools/palette-extractor";
import { GradientGenerator } from "@/components/tools/gradient-generator";
import { TypeScaleGenerator } from "@/components/tools/type-scale-generator";
import { ComicShadowGenerator } from "@/components/tools/comic-shadow-generator";
import { EasingEditor } from "@/components/tools/easing-editor";
import { Mangafy } from "@/components/tools/mangafy";

// Lista cerrada: solo los slugs de TOOLS generan una ruta válida — cualquier
// otro valor de [tool] cae en notFound() sin intentar resolver nada
// dinámicamente (mismo criterio de seguridad que /proyectos/[slug]).
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => TOOLS.map((tool) => ({ locale, tool: tool.id })));
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

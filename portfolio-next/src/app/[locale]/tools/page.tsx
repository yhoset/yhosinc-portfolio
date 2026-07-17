import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { TOOLS } from "@/lib/tools";
import { ToolCard } from "@/components/tools/tool-card";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ToolsIndex />;
}

function ToolsIndex() {
  const t = useTranslations("Tools");

  return (
    <div className="halftone-panel min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-6">
      <header className="mb-12 text-center">
        <p className="font-mono mb-3 text-sm font-bold tracking-[0.2em] text-cyan">{t("eyebrow")}</p>
        <h1 className="section-title-panel" style={{ background: "#00f5ff" }}>
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-white/70">{t("body")}</p>
      </header>
      <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            color={tool.color}
            title={t(`items.${tool.id}.title`)}
            description={t(`items.${tool.id}.description`)}
          />
        ))}
      </div>
    </div>
  );
}

import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SkillsGrid } from "@/components/skills/skills-grid";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Skills />;
}

function Skills() {
  const t = useTranslations("Skills");

  return (
    <div className="halftone-panel min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-6">
      <header className="mb-12 text-center">
        <p className="font-mono mb-3 text-sm font-bold tracking-[0.2em] text-yellow">
          {t("eyebrow")}
        </p>
        <h1 className="section-title-panel" style={{ background: "#ffe000", boxShadow: "var(--shadow-3d-yellow)" }}>
          {t("title")}
        </h1>
      </header>
      <SkillsGrid />
    </div>
  );
}

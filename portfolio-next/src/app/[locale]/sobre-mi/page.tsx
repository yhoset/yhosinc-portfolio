import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.about" });
  return pageMetadata({ locale, path: "/sobre-mi", title: t("title"), description: t("description") });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <About />;
}

function About() {
  const t = useTranslations("About");

  return (
    <div className="halftone-bg min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-6">
      <header className="mb-12 text-center">
        <p className="font-mono mb-3 text-sm font-bold tracking-[0.2em] text-cyan">{t("eyebrow")}</p>
        <h1 className="section-title-panel" style={{ background: "#00f5ff" }}>
          {t("title")}
        </h1>
      </header>
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <p className="leading-relaxed text-white/80">{t("paragraph1")}</p>
        <p className="leading-relaxed text-white/80">{t("paragraph2")}</p>
        <p className="leading-relaxed text-white/80">{t("paragraph3")}</p>
      </div>
    </div>
  );
}

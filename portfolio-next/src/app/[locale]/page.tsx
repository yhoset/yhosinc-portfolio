import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Home />;
}

function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-6xl tracking-wide text-cyan sm:text-7xl">
        {t("title")}
      </h1>
      <p className="font-label text-xl tracking-wide text-white/80">
        {t("subtitle")}
      </p>
      <p className="max-w-md text-sm text-white/50">{t("body")}</p>
    </div>
  );
}

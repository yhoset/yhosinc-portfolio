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
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#0A0A0F] px-6 text-center text-white">
      <h1 className="text-5xl font-bold tracking-tight text-[#00F5FF]">
        {t("title")}
      </h1>
      <p className="text-xl text-white/80">{t("subtitle")}</p>
      <p className="max-w-md text-sm text-white/50">{t("body")}</p>
    </div>
  );
}

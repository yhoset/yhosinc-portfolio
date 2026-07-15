import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ComingSoon } from "@/components/layout/coming-soon";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComingSoon messageKey="contact" />;
}

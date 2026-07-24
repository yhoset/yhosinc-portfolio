import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getVisitorSession } from "@/server/auth/session";
import { pageMetadata } from "@/lib/metadata";
import { VisitorAuthForm } from "@/components/visitor/visitor-auth-form";
import { LogoutVisitorButton } from "@/components/visitor/logout-visitor-button";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.account" });
  return pageMetadata({ locale, path: "/cuenta", title: t("title"), description: t("description") });
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // getVisitorSession() lee cookies() — fuerza render dinámico en Next
  // automáticamente, igual que /admin con getAdminSession().
  const visitor = await getVisitorSession();

  if (visitor) {
    const t = await getTranslations({ locale, namespace: "VisitorAuth" });
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center sm:px-6">
        <h1 className="font-display mb-2 text-3xl text-white">{t("welcomeBack")}</h1>
        <p className="mb-6 text-white/70">{t("loggedInAs", { name: visitor.name })}</p>
        <LogoutVisitorButton />
      </div>
    );
  }

  return <VisitorAuthForm />;
}

import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { MotionConfig } from "motion/react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Bangers, Bebas_Neue, Rajdhani } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/interaction/custom-cursor";
import { GameBackground } from "@/components/interaction/game-background";
import { CommandPaletteProvider } from "@/components/interaction/command-palette-context";
import { CommandPalette } from "@/components/interaction/command-palette";
import { PowerLevelProvider } from "@/components/interaction/power-level-context";
import { PowerLevelHUD } from "@/components/interaction/power-level-hud";
import { AnalyticsBeacon } from "@/components/analytics/analytics-beacon";
import { getGithubPowerLevelBase } from "@/lib/github-power-level";
import "./globals.css";

// Trío tipográfico de marca — ver branding-y-filosofia.md §4.
const bangers = Bangers({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-label",
  weight: "400",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const siteTitle = t("siteTitle");
  const siteDescription = t("siteDescription");

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: siteTitle, template: "%s · YHOSINC" },
    description: siteDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", en: "/en" },
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: `/${locale}`,
      siteName: "YHOSINC",
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Habilita el renderizado estático de esta ruta pese a leer el locale
  // dinámicamente (patrón recomendado por next-intl para App Router).
  setRequestLocale(locale);

  const { level: powerLevelBase } = await getGithubPowerLevelBase();
  const t = await getTranslations({ locale, namespace: "Nav" });

  return (
    <html
      lang={locale}
      className={`${bangers.variable} ${bebasNeue.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* reducedMotion="user" hace que TODAS las animaciones de Motion en
            el árbol respeten prefers-reduced-motion automáticamente, igual
            que ya hacen los @keyframes CSS en globals.css. */}
        <a href="#main-content" className="skip-link">
          {t("skipToContent")}
        </a>
        <MotionConfig reducedMotion="user">
          <NextIntlClientProvider>
            <PowerLevelProvider initialLevel={powerLevelBase}>
              <CommandPaletteProvider>
                <GameBackground />
                <CustomCursor />
                <AnalyticsBeacon />
                <Header />
                {/* pb reserva espacio para que el HUD de Power Level (fixed,
                    esquina inferior) nunca tape el contenido — branding-y-filosofia.md §7. */}
                <main id="main-content" className="flex-1 pb-20">
                  <ViewTransition>{children}</ViewTransition>
                </main>
                <Footer />
                <CommandPalette />
                <PowerLevelHUD />
              </CommandPaletteProvider>
            </PowerLevelProvider>
          </NextIntlClientProvider>
        </MotionConfig>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { MotionConfig } from "motion/react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Bangers, Bebas_Neue, Rajdhani } from "next/font/google";
import { routing } from "@/i18n/routing";
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

export const metadata: Metadata = {
  title: "YHOSINC",
  description: "Frontend architect & creative director — ink & code.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  return (
    <html
      lang={locale}
      className={`${bangers.variable} ${bebasNeue.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* reducedMotion="user" hace que TODAS las animaciones de Motion en
            el árbol respeten prefers-reduced-motion automáticamente, igual
            que ya hacen los @keyframes CSS en globals.css. */}
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
                <main className="flex-1 pb-20">
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

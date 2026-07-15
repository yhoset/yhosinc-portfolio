import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Bangers, Bebas_Neue, Rajdhani } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/interaction/custom-cursor";
import { CommandPaletteProvider } from "@/components/interaction/command-palette-context";
import { CommandPalette } from "@/components/interaction/command-palette";
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

  return (
    <html
      lang={locale}
      className={`${bangers.variable} ${bebasNeue.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <CommandPaletteProvider>
            <CustomCursor />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CommandPalette />
          </CommandPaletteProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

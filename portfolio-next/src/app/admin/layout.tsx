import type { Metadata } from "next";
import { Bangers, Bebas_Neue, Rajdhani } from "next/font/google";
import "../[locale]/globals.css";

// El panel admin es una herramienta interna, no pasa por next-intl (siempre
// en español) y por eso vive fuera de [locale] — necesita su propio layout
// raíz con <html>/<body> (patrón "multiple root layouts" de Next App
// Router: https://nextjs.org/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts).
const bangers = Bangers({ variable: "--font-display", weight: "400", subsets: ["latin"] });
const bebasNeue = Bebas_Neue({ variable: "--font-label", weight: "400", subsets: ["latin"] });
const rajdhani = Rajdhani({ variable: "--font-sans", weight: ["400", "500", "600", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panel Admin — YHOSINC",
  // Panel privado sin link público — nunca debería aparecer en buscadores.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${bangers.variable} ${bebasNeue.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}

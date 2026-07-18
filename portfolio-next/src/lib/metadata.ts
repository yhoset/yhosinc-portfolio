import type { Metadata } from "next";

// next-intl no mapea rutas por idioma (i18n/routing.ts no define
// `pathnames`) — el mismo path sirve para /es y /en, solo cambia el
// prefijo de locale. Por eso alternates.languages es un simple swap de
// prefijo, sin tabla de traducción de rutas.
const OG_LOCALE: Record<string, string> = { es: "es_ES", en: "en_US" };

// Reconstruye openGraph/twitter completos en cada página (no solo title/
// description) porque Next.js reemplaza el objeto `openGraph` entero si
// una página define uno propio, en vez de mezclarlo campo a campo con el
// del layout padre — ver generateMetadata docs, sección "Merging".
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const cleanPath = path === "/" ? "" : path;
  const url = `/${locale}${cleanPath}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { es: `/es${cleanPath}`, en: `/en${cleanPath}` },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "YHOSINC",
      type: "website",
      locale: OG_LOCALE[locale] ?? OG_LOCALE.es,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

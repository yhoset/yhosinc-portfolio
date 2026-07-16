import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX();

const nextConfig: NextConfig = {
  // Transiciones de página nativas — ver branding-y-filosofia.md §8
  // principio 6 ("cambiar de sección se siente como pasar de página de
  // manga, no como recargar"). Estilos en globals.css.
  experimental: {
    viewTransition: true,
  },
  // Case studies de proyectos (Fase 3) como .mdx importados por slug —
  // ver herramientas.md. No se usan como rutas de archivo directas, solo
  // como imports dinámicos desde src/content/projects/.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default withNextIntl(withMDX(nextConfig));

initOpenNextCloudflareForDev();

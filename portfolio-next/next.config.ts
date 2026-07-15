import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Transiciones de página nativas — ver branding-y-filosofia.md §8
  // principio 6 ("cambiar de sección se siente como pasar de página de
  // manga, no como recargar"). Estilos en globals.css.
  experimental: {
    viewTransition: true,
  },
};

export default withNextIntl(nextConfig);

initOpenNextCloudflareForDev();

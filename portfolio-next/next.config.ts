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
  // Fase 10: @libsql/client (y su cadena de dependencias — hrana-client,
  // isomorphic-ws) resuelve bajo la condición de export "workerd" (la que
  // usa el bundle de Cloudflare Workers), pero el output file tracing de
  // Next solo sigue la rama "node" por defecto al analizar requires
  // estáticamente — nunca copia los archivos *.workerd.js/web.js/web.mjs
  // correspondientes, y el build de OpenNext falla con "Could not resolve"
  // en cascada (primero @libsql/client, después @libsql/isomorphic-ws)
  // en cualquier página que llegue a getDb(). Confirmado en el build real
  // (arquitectura.md §8.6) — se incluye todo el scope @libsql en vez de ir
  // agregando archivo por archivo cada vez que aparece un nuevo eslabón.
  outputFileTracingIncludes: {
    "/*": ["node_modules/@libsql/**/*"],
  },
};

export default withNextIntl(nextConfig);

initOpenNextCloudflareForDev();

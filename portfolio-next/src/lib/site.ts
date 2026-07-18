// Dominio real de producción todavía no existe (deploy es la Fase 10 —
// arquitectura.md §9). NEXT_PUBLIC_SITE_URL se define recién ahí, vía
// wrangler; hasta entonces todo (metadataBase, sitemap, robots) cae al
// localhost de dev sin romper el build.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

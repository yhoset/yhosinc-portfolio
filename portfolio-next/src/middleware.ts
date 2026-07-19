// Fase 10 (2026-07-18): swap temporal de la convención nativa `proxy.ts`
// (Node.js runtime, usada durante el desarrollo local de las Fases 1-9) a
// la convención legacy `middleware.ts` (Edge runtime) — @opennextjs/cloudflare
// v1.20.1 todavía no soporta el proxy Node.js de Next 16 en Workers
// (`async_hooks` no existe ahí). Ver arquitectura.md §8.1 y
// github.com/cloudflare/workers-sdk#13755. Revertir a `proxy.ts` en cuanto
// ese issue se resuelva — revisar antes de cada actualización de
// @opennextjs/cloudflare.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export const middleware = createMiddleware(routing);

export const config = {
  // admin excluido: vive fuera de [locale] (siempre en español, sin
  // prefijo de idioma) — ver src/app/admin/layout.tsx.
  matcher: ["/((?!api|trpc|_next|_vercel|admin|.*\\..*).*)"],
};

// Convención nativa de Next 16. `next dev` corre en Node.js normal (no en
// Workers), así que este archivo funciona bien para desarrollo local. Solo
// para el build de producción vía OpenNext/Cloudflare hay que cambiar
// temporalmente a la convención legacy "middleware.ts" (Edge runtime) —
// ver arquitectura.md §8.1 y github.com/cloudflare/workers-sdk/issues/13755.
// Ese swap se hace justo antes de la Fase 10 (deploy), no durante el
// desarrollo local de las fases intermedias.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

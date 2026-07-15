// Next.js 16 renombró "middleware" a "proxy" y "proxy.ts" corre por defecto
// en runtime Node.js. El adaptador OpenNext para Cloudflare (v1.20.1) todavía
// no soporta ese runtime en Cloudflare Workers (usa `async_hooks`, no
// disponible ahí) — ver github.com/cloudflare/workers-sdk/issues/13755.
// Mientras tanto usamos la convención legacy "middleware.ts" (deprecada pero
// soportada), que sigue corriendo en Edge runtime y sí es compatible con
// Workers. Volver a proxy.ts en cuanto OpenNext soporte Node.js middleware.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export const middleware = createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

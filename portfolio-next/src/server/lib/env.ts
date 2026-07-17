import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// En Cloudflare Workers (vía OpenNext) las variables/secrets de .dev.vars
// (y, en producción, los secrets reales de wrangler) NO llegan a
// process.env — se exponen como bindings en el contexto de Cloudflare.
// Confirmado con una ruta de diagnóstico temporal: process.env.* volvía
// vacío para TODO, incluidas DATABASE_URL/NEXTJS_ENV que "funcionaban" solo
// por su valor de fallback hardcodeado. getCloudflareContext().env es la
// forma correcta de leerlas tanto en dev (next dev, vía
// initOpenNextCloudflareForDev en next.config.ts) como en producción.
export async function getEnv(key: string): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const val = (env as Record<string, unknown>)[key];
    if (typeof val === "string" && val.length > 0) return val;
  } catch {
    // getCloudflareContext puede no estar disponible fuera de un request
    // real (ej. scripts standalone como seed-admin.ts) — cae a process.env.
  }
  return process.env[key];
}

import "server-only";
import { headers } from "next/headers";

// cf-connecting-ip es la que pone Cloudflare Workers (la real, no
// falsificable por el cliente); x-forwarded-for es el fallback para local
// (next dev/start detrás de un proxy común) — en local casi siempre va a
// faltar y cae al valor fijo, que alcanza para desarrollo (no hay múltiples
// visitantes reales pegándole al mismo proceso).
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf;
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "local-dev";
}

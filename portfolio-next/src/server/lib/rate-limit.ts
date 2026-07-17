import "server-only";

// Limitador en memoria, por proceso — funciona correctamente en local
// (next dev/start es un solo proceso) pero NO sirve tal cual en Cloudflare
// Workers en producción: cada isolate tiene su propia memoria, así que el
// límite real efectivo sería (límite configurado × cantidad de isolates
// activos), no el límite exacto. Documentado igual que las limitaciones de
// proxy.ts/Turbopack en arquitectura.md §8 — hay que resolverlo con KV o
// Durable Objects de Cloudflare recién en la Fase 10 (deploy), no antes,
// porque hasta esa fase todo el desarrollo es local sin tocar Workers.
const buckets = new Map<string, { count: number; resetAt: number }>();

// Evita que `buckets` crezca sin límite en un proceso de larga vida (dev
// server, `next start`) con muchas IPs distintas — se poda cada vez que el
// mapa supera este tamaño, no en cada request (barato).
const MAX_TRACKED_KEYS = 5000;

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterMs?: number } {
  const now = Date.now();

  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [k, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true };
}

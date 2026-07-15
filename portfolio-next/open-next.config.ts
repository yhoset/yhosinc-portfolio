import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Fase 0: config mínima para el primer deploy ("hola mundo"), sin ISR
// todavía. Cuando haya contenido que se beneficie de cache incremental
// (ISR) se agrega un bucket R2 + el override `r2-incremental-cache` — eso
// requiere crear el bucket en la cuenta real de Cloudflare del usuario
// primero (login de wrangler), no algo que se pueda hacer sin esa cuenta.
export default defineCloudflareConfig();

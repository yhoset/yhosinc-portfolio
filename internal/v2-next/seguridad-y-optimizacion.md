# Seguridad y optimización — Portfolio v2

> Regla del proyecto: no se cierra ninguna fase sin (a) sin bugs, (b) optimizado,
> (c) sin problemas de seguridad, (d) test E2E exitoso, y además un test de
> seguridad específico sobre lo modificado. Este documento es el checklist.

## Parte A — Seguridad

### A.1 Autenticación y autorización

- **JWT con claim `role`** (`admin` | `visitor`), firmado con `JWT_SECRET`.
- Cada guard verifica **explícitamente el rol** — un token de visitante nunca
  debe pasar por un guard de admin, aunque la firma sea válida (esto ya se
  probó con tests de rol cruzado en v1; se re-portan).
- Tokens de admin de vida corta; tokens de visitante de vida más larga con
  posibilidad de revocación.
- El panel `/admin` es `noindex, nofollow` y sin link público.

### A.2 Validación de entrada

- **Toda** Server Action y Route Handler valida su entrada con **Zod** antes de
  tocar la DB. Nada confía en el cliente.
- Límites de longitud en todos los campos de texto (nombre, email, mensaje,
  comentario) para no dejar pasar payloads arbitrarios a la DB.

### A.3 Contenido generado por usuarios (comentarios)

- **Moderación previa**: los comentarios quedan `pending` hasta aprobación del
  admin (ya implementado en v1).
- Se renderizan como **texto plano de React** (auto-escapado) — sin
  `dangerouslySetInnerHTML`, cero riesgo de XSS almacenado.

### A.4 Rate limiting y anti-abuso

- Límites por acción sensible (contacto, login, registro, comentarios).
- En Cloudflare Workers se implementa con **KV** o **Durable Objects** (no con
  `express-rate-limit`, que no aplica en este runtime). Alternativa: usar las
  reglas de rate limiting de Cloudflare a nivel de red.

### A.5 Secrets y variables de entorno

- **Nunca** en el repo. En Cloudflare se gestionan con `wrangler secret put`
  (secrets cifrados del Worker): `JWT_SECRET`, `TURSO_AUTH_TOKEN`,
  `DATABASE_URL`, `RESEND_API_KEY`, y (si se activa el módulo IA) `ANTHROPIC_API_KEY`.
- `.env.local` para dev, gitignoreado. Un `.env.example` sin valores reales.
- Verificación por fase: `git ls-files` / `grep` para confirmar que ningún
  secreto real quedó versionado.

### A.6 Cabeceras y CSP

- **Content-Security-Policy** estricta (equivalente a la de v1 vía Helmet):
  `default-src 'self'`, `object-src 'none'`, `frame-ancestors`, etc. En Next se
  configura en `next.config.ts` (headers) o middleware.
- HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`,
  `X-Frame-Options`.
- Ajustar la CSP para permitir lo que el 3D/animación necesiten (workers, blob)
  sin abrir de más.

### A.7 CSRF y Server Actions

- Las **Server Actions** de Next tienen protección de origen incorporada, pero
  se revisa que las mutaciones sensibles verifiquen sesión/rol y no dependan
  solo de "el frontend no muestra el botón".

### A.8 Dependencias

- `npm audit` sin vulnerabilidades **altas/críticas** antes de cerrar cada fase.
- No agregar dependencias sin necesidad real (cada una es superficie de ataque
  y peso). Preferir librerías mantenidas y populares.

### A.9 Plataforma (Next.js 16)

Next 16 mejora la seguridad respecto de la 15; aprovechamos y respetamos:

- **Subresource Integrity (SRI)**: Turbopack genera hashes criptográficos de los
  JS en build y el navegador verifica que no fueron modificados. Se habilita en
  la config para blindar el pipeline de assets.
- **`proxy.ts`** (reemplaza a `middleware`): deja explícita la frontera de red;
  se usa para las cabeceras de seguridad/CSP y guards de borde.
- **Mantenerse en el último patch de 16.x**: las versiones traen parches de
  advisories continuos (DoS en RSC, bypass de proxy/middleware, SSRF en upgrades
  de WebSocket, inyección en rutas dinámicas, XSS, etc.). Se revisa el changelog
  de seguridad antes de fijar la versión.
- **Server Actions**: verificación de sesión/rol en cada mutación sensible; no
  confiar en que "el frontend no muestra el botón".

## Parte B — Optimización y performance

### B.1 Estrategia general (Next / RSC)

- **React Server Components** por defecto; `"use client"` solo donde hace falta
  interactividad (3D, canvas, formularios, command palette).
- **Streaming + Suspense** para que el contenido crítico pinte rápido y lo
  pesado (3D, roadmap) cargue después.
- **Code splitting** automático por ruta; `dynamic(import, { ssr: false })` para
  el 3D y el canvas (no se renderizan en el server).

### B.2 El 3D sin penalizar la performance

- **Lazy-load** del `GameBackground` y del `HeadLogo`; nunca bloquean el LCP.
- Animar con **`useFrame`**, no con estado de React (el estado dispara
  re-renders; `useFrame` corre fuera de la reconciliación).
- `frameloop="demand"` en escenas mayormente estáticas (renderiza solo cuando
  algo cambia).
- **Instances/InstancedMesh** de drei para muchas partículas con un solo draw
  call.
- **Dispose** correcto de geometrías/materiales/texturas al desmontar.
- Respetar **`prefers-reduced-motion`**: fallback estático, sin loop de animación.
- Pausar el render cuando la pestaña no está visible / el canvas fuera de
  viewport.

### B.3 Imágenes y fuentes

- `next/image` (optimización servida por OpenNext en Cloudflare) para todo
  raster; formatos modernos (AVIF/WebP), `sizes` correctos, lazy por defecto.
- `next/font` para Bangers/Bebas/Rajdhani — sin FOUT/FOIT ni layout shift.

### B.4 Objetivos medibles (Core Web Vitals)

| Métrica | Objetivo |
|---|---|
| LCP | < 2.5 s |
| INP | < 200 ms |
| CLS | < 0.1 |
| Lighthouse (mobile) | ≥ 90 en Performance / Accessibility / Best Practices / SEO |
| JS inicial (sin 3D) | presupuesto acotado; el 3D se carga aparte y diferido |

Se mide con Lighthouse y con datos de campo (Web Vitals) antes de cerrar la fase
de pulido.

### B.5 Caché y datos

- **ISR / revalidación** para contenido que cambia poco (proyectos, roadmap).
- Turso con posibilidad de **réplicas de lectura**/embedded replicas para
  lecturas sub-ms desde el edge, si hace falta.
- Cachear respuestas de Route Handlers públicas cuando aplique.

## Parte C — Accesibilidad (a11y)

- `prefers-reduced-motion` respetado en todo efecto (3D, scroll, transiciones).
- Navegación completa por teclado; **focus visible**; command palette (⌘K) como
  ruta alternativa a todo.
- Contraste AA como mínimo (la paleta de alto contraste ayuda).
- `alt` en imágenes, `aria-label` en controles icon-only, landmarks correctos.
- El "modo juego" nunca es la única forma de acceder a la información.

## Parte D — Testing y gate de calidad

- **Vitest** para unit/integración (Server Actions, validación, auth/roles,
  utilidades).
- **Playwright** para E2E de navegador (flujos reales: contacto, login admin,
  registro/comentario de visitante, navegación, i18n).
- Tests de **rol cruzado** (visitante ≠ admin) obligatorios, como en v1.
- **Responsive real** verificado en móvil (~375px), tablet (~768px),
  laptop (~1366px) y desktop (~1920px+) antes de reportar — no alcanza con un
  solo viewport.

### Checklist de cierre por fase

- [ ] Sin bugs conocidos (verificado corriendo el código, no de memoria).
- [ ] Optimizado (Lighthouse / Web Vitals dentro de objetivo para lo tocado).
- [ ] Seguro (validación, auth/roles, secrets, CSP, rate limiting según aplique).
- [ ] Test E2E de la fase pasando.
- [ ] Test de seguridad específico de lo modificado.
- [ ] Responsive real verificado.
- [ ] `npm audit` sin altas/críticas.

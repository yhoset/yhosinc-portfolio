# Arquitectura — Portfolio v2 (Next.js)

## 1. Objetivo y alcance

Reconstruir el portfolio como una app **Next.js multi-página**, full-stack y
consolidada (frontend + backend en un solo proyecto), que:

- Se sienta como una experiencia interactiva ("modo juego") sin sacrificar
  performance ni accesibilidad.
- Muestre el trabajo, las skills (filtrables por disciplina), un **roadmap de
  aprendizaje** en canvas (junior → mid → senior; código + diseño + IA), y una
  página de **tools** útiles.
- Sea código profesional, tipado (TypeScript), testeado y bien documentado.

No es un rediseño superficial: es una migración de stack aprovechando lo más
moderno de Next (App Router, React Server Components, Server Actions).

## 2. Stack técnico

| Capa | Tecnología | Versión objetivo | Rol |
|---|---|---|---|
| Framework | **Next.js 16** (App Router) + **React 19.2** + **TypeScript 5** | Next `16.x` (último patch), React `19.2` | Base full-stack: RSC, Server Actions, streaming, **Turbopack por defecto** (builds 2-5× más rápidos), **Cache Components** (PPR), **View Transitions** nativas y capa de seguridad mejorada (SRI, `proxy.ts`). |
| Hosting | **Cloudflare Workers** vía **OpenNext** (`@opennextjs/cloudflare`) | última `1.x` | Deploy del Next completo (SSR/ISR/middleware/Image) sobre Workers. Soporta Next 16. |
| Base de datos | **Turso** (libSQL) + **Drizzle ORM** | Drizzle última estable | DB en la nube, corre nativo en Workers; Drizzle es liviano y pensado para edge. |
| Estilos | **Tailwind CSS v4** + **shadcn/ui** (Radix) | Tailwind `4.x` | Sistema de diseño rápido, tokens propios, componentes accesibles. |
| 3D | **React Three Fiber v9** + **drei** (Three.js) | R3F `9.x` (React 19.0–19.2) | Fondo "modo juego", logo 3D del header, escenas. |
| Animación UI | **Motion v12** (ex Framer Motion, `motion/react`) | `12.x` | Layout animations, micro-interacciones, el meter de Power Level. |
| Transiciones de página | **View Transitions API** (nativas, Next 16 / React 19.2) + **Motion** | — | Transiciones animadas entre rutas; Motion orquesta donde haga falta control fino. |
| Animación scroll | **GSAP ScrollTrigger** + **Lenis** | GSAP `3.x`, Lenis última | Narrativa por scroll tipo "capítulos de manga", scroll suave. |
| Roadmap canvas | **React Flow v12** (`@xyflow/react`) | `12.x` (React 19 + Tailwind 4) | Canvas navegable de nodos para el roadmap de aprendizaje. |
| Command palette | **cmdk** (vía shadcn/ui Command) | última | Navegación ⌘K estilo Vercel/Linear. |
| i18n | **next-intl** | última estable | Español + Inglés, con segmento `[locale]`. |
| Validación | **Zod** | última `3.x`/`4.x` | Esquemas de entrada en Server Actions y Route Handlers. |
| Contenido | **MDX** (`@next/mdx`) | acorde a Next 16 | Case studies de proyectos como documentos ricos. |
| IA (opcional) | **Anthropic SDK** (Claude) | última | "Preguntale a mi portafolio" (RAG) y/o "manga-fy". Módulo aparte, decisión pendiente. |
| Tooling | ESLint + Prettier/Biome, `wrangler`, `drizzle-kit` | últimas | Calidad, deploy, migraciones. |
| Testing | **Vitest** + **Playwright** | últimas | Unit/integración + E2E de navegador. |

> **Política de versiones**: al scaffoldear se instala la **última estable** de
> cada paquete y se **fija (pin)** en `package.json` (sin `^` en las críticas),
> para builds reproducibles. Next.js se mantiene en el **último patch de 16.x**
> porque las versiones traen parches de seguridad continuos (advisories de RSC,
> middleware/proxy, image optimization, etc.). Los majors verificados hoy:
> Next 16, React 19.2, R3F 9, Motion 12, React Flow 12, Tailwind 4.
>
> Detalle, por qué de cada una, licencias y alternativas descartadas: ver
> [herramientas.md](herramientas.md).

## 3. Mapa de rutas (multi-página)

Con i18n, todo cuelga de `/[locale]` (`es` | `en`):

| Ruta | Página | Notas |
|---|---|---|
| `/` | Home | Hero con logo 3D + fondo "modo juego" + resumen. |
| `/proyectos` | Grid de proyectos | Filtrable por disciplina/tag; layout animado. |
| `/proyectos/[slug]` | Case study | Contenido en MDX, con demos embebidas. Comentarios (feature flag). |
| `/skills` | Skills | **Filtrables por trabajo/disciplina** (chips). |
| `/roadmap` | Roadmap | Canvas interactivo (React Flow): junior → **mid** → senior. |
| `/tools` | Tools | Índice de mini-herramientas. |
| `/tools/[tool]` | Tool | Cada mini-app (extractor de paleta, gradientes, favicons, manga-fy…). |
| `/sobre-mi` | About | Perfil, historia, filosofía. |
| `/contacto` | Contacto | Formulario (Server Action) + links sociales con confirmación de salida. |
| `/admin` | Panel privado | Auth; mensajes, analíticas, moderación de comentarios. `noindex`. |

## 4. Estructura de carpetas (App Router)

```text
portfolio-next/
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx              # Providers: i18n, tema, 3D canvas root, command palette
│  │  │  ├─ page.tsx                # Home
│  │  │  ├─ proyectos/{page,[slug]/page}.tsx
│  │  │  ├─ skills/page.tsx
│  │  │  ├─ roadmap/page.tsx
│  │  │  ├─ tools/{page,[tool]/page}.tsx
│  │  │  ├─ sobre-mi/page.tsx
│  │  │  ├─ contacto/page.tsx
│  │  │  └─ admin/page.tsx
│  │  ├─ api/                       # Route Handlers (webhooks, cron, etc. si hace falta)
│  │  └─ globals.css                # Tailwind v4 + tokens
│  ├─ components/
│  │  ├─ three/                     # R3F: GameBackground, HeadLogo, escenas
│  │  ├─ roadmap/                   # Nodos, edges, layout del canvas
│  │  ├─ skills/                    # Grid filtrable
│  │  ├─ ui/                        # shadcn/ui + primitivos propios
│  │  └─ layout/                    # Nav, footer, command palette, cursor
│  ├─ server/
│  │  ├─ actions/                   # Server Actions: contacto, auth, comentarios, analytics
│  │  ├─ db/                        # Drizzle: schema.ts + client.ts
│  │  └─ auth/                      # JWT (roles admin | visitor), guards
│  ├─ content/projects/            # MDX de cada proyecto
│  ├─ i18n/                         # next-intl: config + messages/{es,en}.json
│  ├─ lib/                          # utils, constantes, THEME tokens
│  └─ styles/
├─ public/                          # favicon, robots.txt, sitemap, og-image, assets 3D
├─ drizzle/                         # migraciones generadas por drizzle-kit
├─ open-next.config.ts              # config del adaptador OpenNext
├─ wrangler.toml                    # config de Cloudflare Workers (bindings, vars)
├─ next.config.ts
├─ drizzle.config.ts
└─ package.json
```

## 5. Capa de datos y backend (consolidado en Next)

- **Turso** sigue siendo la base de datos (ya está en producción y funciona en
  Workers). Se accede con **Drizzle ORM** (más liviano que Prisma y con soporte
  first-class de libSQL para edge).
- La lógica que hoy vive en el backend Express se reescribe como:
  - **Server Actions** para mutaciones desde formularios (contacto, login,
    registro de visitante, comentarios, moderación).
  - **Route Handlers** (`app/api/...`) solo donde haga falta un endpoint HTTP
    real (webhooks, health check, integraciones externas).
- **Validación**: cada Server Action valida su entrada con **Zod** antes de tocar
  la DB (mismo criterio que hoy).
- **Auth**: se conserva el modelo de **JWT con claim `role`** (admin | visitor),
  con verificación explícita del rol en cada guard (crítico: un token de
  visitante nunca debe pasar por un guard de admin). Detalle en
  [seguridad-y-optimizacion.md](seguridad-y-optimizacion.md).
- **Rate limiting** en las acciones sensibles (contacto, login, registro,
  comentarios). En Workers se resuelve con el almacenamiento de Cloudflare
  (KV o Durable Objects) en vez de `express-rate-limit`.

### Modelos (heredados de v1, ya migrados en Turso)

`ContactMessage`, `AdminUser`, `AnalyticsEvent`, `VisitorUser`, `Comment`.
Se portan a **Drizzle schema** manteniendo las mismas tablas, para no perder
los datos que ya existen en producción.

## 6. Componentes clave (specs)

- **GameBackground** (`components/three/`): capa 3D fija detrás del contenido,
  partículas/geometría low-poly que reaccionan al cursor (parallax + repulsión).
  Lazy-loaded, `frameloop="demand"` donde se pueda, y desactivada bajo
  `prefers-reduced-motion`. Nunca bloquea el hilo principal ni el LCP.
- **HeadLogo** (`components/three/`): versión pequeña del personaje low-poly del
  hero actual, en el header, que **mira hacia el cursor**. Escena 3D mínima y
  aislada, con su propio canvas de bajo costo.
- **RoadmapCanvas** (`components/roadmap/`): React Flow con tres carriles
  (Código / Diseño / IA) que convergen; nodos = skills/hitos, con un marcador
  **"you are here"** en *mid*. Zoom/pan, nodos clickeables con detalle. Los datos
  del roadmap viven en un archivo tipado (`lib/roadmap.ts`), fácil de editar.
- **SkillsGrid** (`components/skills/`): chips de filtro por disciplina/trabajo;
  al filtrar, transición de layout animada (Motion `layout`).
- **CommandPalette** (`components/layout/`): ⌘K — navegar, saltar a proyectos,
  cambiar idioma/tema.
- **CustomCursor**: evolución del cursor cómic actual (flecha + estrella al
  click), con estados por zona (magnético sobre botones, estela en la zona 3D).
- **PowerLevel** (`components/layout/` + `PowerLevelProvider`): HUD persistente
  estilo medidor de poder manga/gamer. Sube a medida que el visitante explora
  secciones y recorre el roadmap; cada hito se **explica** con una línea épica al
  desbloquearlo ("⚡ Desbloqueado: 3D & WebGL · +850 PWR"). El nivel base puede
  alimentarse de **datos reales de GitHub**. Unifica el "modo juego": el fondo
  3D, el roadmap y la narrativa por scroll aportan al mismo nivel. Detalle de
  diseño en [branding-y-filosofia.md](branding-y-filosofia.md §7).
- **PageTransitions** (`components/layout/`): transiciones animadas entre rutas
  con la **View Transitions API** nativa de Next 16 / React 19.2, orquestadas con
  Motion donde haga falta control fino. Degradan con gracia bajo
  `prefers-reduced-motion` (corte simple en vez de animación).

## 7. Migración desde v1 (qué se reusa, qué se reescribe)

| De v1 | En v2 |
|---|---|
| Contenido de proyectos, textos, THEME (colores), fuentes | **Se reusa** (portado a tokens Tailwind + MDX + i18n). |
| Lógica de negocio (contacto, auth, comentarios, analytics) | **Se reescribe** como Server Actions + Drizzle (misma semántica, mismos modelos). |
| Base de datos Turso (tablas y datos actuales) | **Se conserva** (se re-mapea con Drizzle). |
| Componentes React (JSX plano, estilos inline) | **Se reescriben** como componentes tipados + Tailwind + RSC donde aplique. |
| Cursor cómic, logo low-poly, efectos manga | **Se reimplementan** mejorados (R3F para el 3D, Motion para animación). |
| Backend Express + Render | **Se retira** una vez que la v2 esté en producción. |

## 8. Deploy (Cloudflare + OpenNext)

- `@opennextjs/cloudflare` compila la app Next a un Worker (runtime Node de
  Workers), soportando SSR, ISR, middleware e Image.
- **Secrets y env vars** se gestionan con `wrangler` (secrets de Cloudflare), no
  en archivos versionados. Ver [seguridad-y-optimizacion.md](seguridad-y-optimizacion.md).
- **CI/CD**: GitHub → build + deploy a Cloudflare (GitHub Actions o el flujo
  nativo de Cloudflare). Preview deploys por rama.
- Turso se conecta desde el Worker con `@libsql/client` (URL + auth token como
  secret).

### 8.1 Limitación conocida: `proxy.ts` vs OpenNext (2026-07-15)

Next 16 corre `proxy.ts` (antes `middleware.ts`) en **runtime Node.js por
defecto** — y ya no permite forzar `runtime: "edge"` en ese archivo (tira
error si se intenta). El adaptador `@opennextjs/cloudflare` v1.20.1 todavía
**no soporta ese Node.js proxy** en Cloudflare Workers: el build falla con
`Node.js middleware is not currently supported` porque el proxy compilado
importa `async_hooks`, que Workers no expone. Confirmado como incompatibilidad
real y abierta (no resuelta aún por Cloudflare/OpenNext): ver
[cloudflare/workers-sdk#13755](https://github.com/cloudflare/workers-sdk/issues/13755).

**Workaround actual**: usar la convención legacy `middleware.ts` (export
`middleware`, no `proxy`) en vez de `proxy.ts` — sigue soportada en Next 16
(deprecada, con codemod oficial en la otra dirección) y corre en Edge
runtime, que sí es compatible con Workers/OpenNext. **Revertir a `proxy.ts`
en cuanto OpenNext libere soporte para Node.js middleware** — revisar el
issue de arriba antes de cada actualización de `@opennextjs/cloudflare`.

**Importante — esto solo aplica al build de Cloudflare, no al día a día**:
como el build/deploy real quedó como Fase 10 (ver §9), durante el desarrollo
local de las fases intermedias el proyecto usa `src/proxy.ts` (la convención
nativa de Next 16) — `next dev` corre en Node.js normal, no en Workers, así
que no pisa esta limitación y Turbopack en modo dev ni siquiera reconoce
`middleware.ts` como un export válido (da error distinto:
"Middleware is missing expected function export name"). El swap a
`middleware.ts`/Edge runtime se hace **solo** justo antes de validar el
build de OpenNext/Cloudflare (Fase 10), no antes.

### 8.2 Limitación conocida: Turbopack vs OpenNext (2026-07-15)

Next 16 usa **Turbopack por defecto** (`next build` = Turbopack). El adaptador
`@opennextjs/cloudflare` v1.20.1 (última disponible en npm a esta fecha) no
empaqueta correctamente los chunks SSR que produce Turbopack: el Worker
arranca pero cada request a una ruta con RSC devuelve 500 con
`ChunkLoadError: Failed to load chunk server/chunks/ssr/[root-of-the-server]__*.js`.
Confirmado reproduciendo el build/preview localmente y contrastado con la
guía oficial de troubleshooting de OpenNext (opennext.js.org/cloudflare/troubleshooting),
que recomienda actualizar el adaptador o usar Webpack.

**Workaround actual**: el script `build` de `package.json` corre
`next build --webpack` (fuerza Webpack solo para el build de producción/
Cloudflare). `next dev` sigue usando Turbopack para iteración local rápida —
no afecta al dev server, solo al build que consume OpenNext. **Volver a
Turbopack para el build en cuanto `@opennextjs/cloudflare` publique soporte
completo** (revisar github.com/opennextjs/opennextjs-cloudflare/issues/569
antes de cada actualización del adaptador).

**Cómo verificar que ambas limitaciones siguen resueltas tras actualizar
dependencias**: `npm run preview` (o `build` + `wrangler dev`) y comprobar
que `/`, `/es` y `/en` devuelven 200/307 (no 500) y que el HTML trae el
contenido traducido esperado — no basta con que el build termine sin error,
el Worker puede compilar y aun así fallar en runtime.

### 8.3 `process.env` NO expone `.dev.vars`/secrets — usar `getCloudflareContext()` (Fase 6, 2026-07-17)

Con `@opennextjs/cloudflare`, las variables definidas en `.dev.vars` (local)
y los secrets de Cloudflare (producción) **no llegan a `process.env`** —
Cloudflare Workers no tiene ese global nativamente; `initOpenNextCloudflareForDev()`
(en `next.config.ts`) simula bindings, no un `process.env` completo. Se
confirmó con una ruta de diagnóstico temporal en la Fase 6: `process.env.*`
volvía `undefined` para **todo**, incluidas `DATABASE_URL`/`NEXTJS_ENV`, que
"funcionaban" solo porque `server/db/client.ts` tiene un valor de fallback
hardcodeado que coincidía por casualidad con el de `.dev.vars`. El síntoma
fue sutil: el login de admin fallaba con "Falta JWT_SECRET en el entorno" y
el envío de contacto fallaba con "API key is invalid" en Resend — ambos
errores parecían apuntar a *credenciales* mal copiadas, cuando en realidad
las credenciales eran correctas y el problema era que nunca llegaban a
`process.env`.

**Forma correcta**: `getCloudflareContext({ async: true }).env.VARNAME` (ver
`src/server/lib/env.ts`, usado en `server/auth/jwt.ts` y `server/lib/mailer.ts`).
Pendiente antes de la Fase 10: migrar `server/db/client.ts` al mismo patrón
(hoy usa `process.env` con fallback porque el cliente se crea a nivel de
módulo, no dentro de un request — ver el comentario en ese archivo).

**Cómo verificar que sigue resuelto**: pegarle a cualquier Server Action que
dependa de un secret (ej. login de admin en `/admin`, o el formulario de
`/contacto`) contra `next dev` — si tira "Falta X en el entorno" o un 401 de
un proveedor externo con una key que se sabe válida, es señal de que algo
volvió a leer `process.env` directo en vez de `getEnv()`.

## 9. Fases de construcción (propuesta)

> **Todo el trabajo es local hasta la fase final.** El usuario pidió
> explícitamente (2026-07-15) construir todo en local y dejar el deploy real a
> Cloudflare como la **última** fase — no tocar `wrangler login`/deploy ni
> apuntar dominios antes de eso. El gate E2E de cada fase intermedia se corre
> localmente: `npm run dev` para lo interactivo y, cuando aplique, el build +
> `wrangler dev` del adaptador OpenNext (sin `wrangler deploy`) para validar
> que lo construido también sirve bien desde el Worker simulado.

Cada fase cierra con el gate de calidad (sin bugs, optimizado, seguro, E2E +
test de seguridad + responsive real):

0. **Setup**: scaffold Next 16 + TS + Tailwind v4 + shadcn + i18n + OpenNext +
   Drizzle apuntando a una DB de dev. ~~Deploy "hola mundo" a Cloudflare~~ →
   movido a la fase 10 (deploy real es lo último).
1. **Layout base**: nav, footer, command palette, cursor, tema, i18n EN/ES,
   logo 3D del header, **transiciones de página** (View Transitions) y el HUD de
   **Power Level** (base).
2. **Fondo 3D "modo juego"**: GameBackground con cursor, performante y con
   reduced-motion; conectado al Power Level.
3. **Home + Proyectos + case studies (MDX)**.
4. **Skills filtrables** por disciplina/trabajo.
5. **Roadmap canvas** (React Flow) con los datos reales del camino de
   aprendizaje; cada nodo aporta al **Power Level** y explica su "power up".
6. **Backend en Next**: contacto, auth, comentarios, analytics (Server Actions +
   Drizzle + Zod + rate limiting), panel `/admin`.
7. **Página de tools** (mini-apps).
8. **(Opcional) Módulo IA**: "preguntale a mi portafolio" / manga-fy.
9. **Pulido, a11y, performance, SEO**: todo verificado en local (Lighthouse
   contra `next build` + `next start`, o el Worker simulado con `wrangler dev`).
10. **Deploy y corte** (última fase, no antes): `wrangler login`, deploy real a
    Cloudflare Workers, apuntar el dominio a la v2 y retirar la v1.

> Nada de esto se instala ni se codea todavía: este documento es el plan. Antes
> de instalar dependencias se confirma con el usuario.

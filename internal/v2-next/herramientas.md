# Herramientas — Portfolio v2 (research)

Research de librerías/plugins reales para construir la v2. **Todo es
open-source** (licencias permisivas, mayormente MIT). **Nada está instalado
todavía**: antes de instalar cualquier dependencia se confirma con el usuario
(regla de trabajo del proyecto), y ninguna elección compromete el espacio en
disco más allá de dependencias de desarrollo estándar.

> **Política de versiones**: se usa la **última estable** de cada paquete al
> momento de scaffoldear y se **fija (pin)** en `package.json` para builds
> reproducibles. Next.js se mantiene en el **último patch de 16.x** (trae parches
> de seguridad continuos). Majors verificados hoy (research 2026): **Next 16**,
> **React 19.2**, **R3F 9**, **Motion 12**, **React Flow 12**, **Tailwind 4**.

## Framework y runtime

| Herramienta | Qué es / por qué | Licencia | Link |
|---|---|---|---|
| **Next.js 16** (App Router) | Framework full-stack: RSC, Server Actions, streaming, ISR, **Turbopack por defecto**, **Cache Components** (PPR), **View Transitions** nativas y seguridad mejorada (SRI, `proxy.ts`). Mantener el último patch 16.x. | MIT | https://nextjs.org/blog/next-16 |
| **React 19.2** + **TypeScript 5** | UI + tipado estático (código profesional, menos bugs); incluye View Transitions. | MIT | https://react.dev |
| **OpenNext — adaptador Cloudflare** (`@opennextjs/cloudflare`) | Compila el Next completo a un Worker de Cloudflare (SSR/ISR/middleware/Image, runtime Node de Workers). Es el camino recomendado hoy para Next full-stack en Cloudflare. | MIT | https://opennext.js.org/cloudflare · https://github.com/opennextjs/opennextjs-cloudflare |
| **Wrangler** | CLI de Cloudflare (deploy, secrets, bindings). | Apache-2.0/MIT | https://developers.cloudflare.com/workers |

## Datos

| Herramienta | Qué es / por qué | Licencia | Link |
|---|---|---|---|
| **Turso** (libSQL) | Base de datos SQLite en la nube/edge; **ya está en producción** y corre nativo en Workers. | Open-source (libSQL: MIT) | https://turso.tech |
| **Drizzle ORM** | ORM tipado, liviano y pensado para edge; soporte first-class de libSQL. Más chico que Prisma y corre en Workers. | Apache-2.0 | https://orm.drizzle.team/docs/sqlite/connect-turso |
| **`@libsql/client`** | Cliente libSQL para conectarse a Turso desde el Worker. | MIT | https://github.com/tursodatabase/libsql-client-ts |
| **Zod** | Validación de esquemas de entrada (Server Actions, Route Handlers). Ya usado en v1. | MIT | https://zod.dev |

## Estilos y UI

| Herramienta | Qué es / por qué | Licencia | Link |
|---|---|---|---|
| **Tailwind CSS v4** | Utilidades + tokens propios (`@theme`); rápido y sin CSS muerto. | MIT | https://tailwindcss.com |
| **shadcn/ui** | Componentes accesibles (sobre Radix) que se copian al repo y se estilizan; CLI integra con Next + Tailwind v4. | MIT | https://ui.shadcn.com/docs/tailwind-v4 |
| **cmdk** | Command palette (⌘K); base del componente Command de shadcn. | MIT | https://github.com/pacocoursey/cmdk |
| **lucide-react** | Íconos (ya usado en v1). | ISC | https://lucide.dev |

## 3D ("modo juego")

| Herramienta | Qué es / por qué | Licencia | Link |
|---|---|---|---|
| **Three.js** | Motor WebGL de base. | MIT | https://threejs.org |
| **React Three Fiber v9** (`@react-three/fiber`) | Renderer de React para Three.js: escenas 3D declarativas. v9 compatible con React 19.0–19.2. | MIT | https://github.com/pmndrs/react-three-fiber |
| **drei** (`@react-three/drei`) | Helpers para R3F (Instances, controles, loaders) — clave para partículas performantes. | MIT | https://github.com/pmndrs/drei |

Notas de performance (ver seguridad-y-optimizacion §B.2): animar con `useFrame`
(no estado), `frameloop="demand"`, `InstancedMesh`, `dispose`, lazy-load y
respeto por `prefers-reduced-motion`.

## Animación

| Herramienta | Qué es / por qué | Licencia | Link |
|---|---|---|---|
| **View Transitions API** | Transiciones animadas entre rutas. **Nativas** en Next 16 / React 19.2 — no es un paquete extra. | — (nativa) | https://nextjs.org/blog/next-16 |
| **Motion v12** (ex Framer Motion, `motion/react`) | Layout animations, micro-interacciones, el meter de Power Level. Independiente desde 2025, compatible con React 19. | MIT | https://motion.dev/docs/react |
| **GSAP** + **ScrollTrigger** | Narrativa por scroll (revelado tipo "capítulos de manga"). | Licencia estándar de GSAP (gratis para este uso) | https://gsap.com |
| **Lenis** | Scroll suave (~3 kB), se integra limpio con GSAP ScrollTrigger. De Darkroom Engineering. | MIT | https://github.com/darkroomengineering/lenis |

## Roadmap / canvas

| Herramienta | Qué es / por qué | Licencia | Link |
|---|---|---|---|
| **React Flow v12** (`@xyflow/react`) | UIs basadas en nodos: zoom/pan, nodos y edges custom, muy performante. v12 soporta React 19 + Tailwind 4. Ideal para el roadmap. | MIT | https://reactflow.dev · https://github.com/xyflow/xyflow |

## Internacionalización y contenido

| Herramienta | Qué es / por qué | Licencia | Link |
|---|---|---|---|
| **next-intl** | i18n para App Router (segmento `[locale]`, mensajes tipados). ES + EN. | MIT | https://next-intl.dev |
| **MDX** (`@next/mdx`) | Case studies de proyectos como documentos ricos con componentes embebidos. | MIT | https://nextjs.org/docs/app/building-your-application/configuring/mdx |

## IA (módulo opcional — decisión pendiente)

| Herramienta | Qué es / por qué | Licencia | Link |
|---|---|---|---|
| **Anthropic SDK** (Claude) | "Preguntale a mi portafolio" (RAG sobre proyectos/skills) y/o "manga-fy". Encaja con que la rama del usuario sea la IA. Requiere `ANTHROPIC_API_KEY` (con costo por uso). | MIT (SDK) | https://docs.anthropic.com |

## Tooling y testing

| Herramienta | Qué es / por qué | Licencia | Link |
|---|---|---|---|
| **ESLint** + **Prettier** (o **Biome**) | Lint + formato consistente. Biome es una alternativa todo-en-uno más rápida. | MIT | https://eslint.org · https://biomejs.dev |
| **drizzle-kit** | Genera/aplica migraciones de Drizzle. | Apache-2.0 | https://orm.drizzle.team |
| **Vitest** | Tests unit/integración (ya usado en el backend v1). | MIT | https://vitest.dev |
| **Playwright** | Tests E2E de navegador (flujos reales, multi-viewport). | Apache-2.0 | https://playwright.dev |

## Alternativas consideradas y descartadas

| En vez de | Se eligió | Motivo |
|---|---|---|
| Prisma | **Drizzle** | Más liviano y con soporte edge/libSQL first-class; Prisma es más pesado para Workers. (En v1 Prisma funcionó, pero para el runtime de Workers Drizzle encaja mejor.) |
| Vercel | **Cloudflare** | Decisión del usuario (no cambiar de hosting). OpenNext cubre las features server-side de Next en Workers. |
| Vanilla Three.js | **React Three Fiber** | Integración declarativa con React/Next, mejor DX y mantenibilidad. |
| Canvas/D3 a mano para el roadmap | **React Flow** | Zoom/pan, nodos custom y performance ya resueltos; menos código propio, más robusto. |
| CSS-in-JS (v1 usaba estilos inline) | **Tailwind v4 + shadcn** | Estándar moderno, tokens, accesibilidad y velocidad de desarrollo. |
| `express-rate-limit` | **KV / Durable Objects / reglas de Cloudflare** | El runtime de Workers no es Express; se usa el rate limiting nativo de la plataforma. |

## Estado

- **Nada instalado.** Este documento es el plan de dependencias.
- Antes de instalar se confirma con el usuario y se revisa que no haya impacto
  de espacio en disco más allá de `node_modules` de desarrollo estándar.
- Todas las licencias son permisivas (MIT/Apache-2.0/ISC); GSAP es gratis para
  este uso. Sin dependencias propietarias ni de pago obligatorio (salvo el
  módulo IA opcional, que tiene costo por uso de la API).

### Fuentes del research
- Next.js en Cloudflare / OpenNext — https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ · https://opennext.js.org/cloudflare · https://blog.cloudflare.com/deploying-nextjs-apps-to-cloudflare-workers-with-the-opennext-adapter/
- Turso + Workers + Drizzle — https://developers.cloudflare.com/workers/databases/third-party-integrations/turso/ · https://orm.drizzle.team/docs/sqlite/connect-turso
- React Three Fiber / drei — https://github.com/pmndrs/react-three-fiber · https://github.com/pmndrs/drei
- Motion / Lenis / GSAP — https://motion.dev/docs/react · https://github.com/darkroomengineering/lenis · https://gsap.com
- React Flow (xyflow) — https://reactflow.dev · https://github.com/xyflow/xyflow
- next-intl / Tailwind v4 / shadcn / cmdk — https://next-intl.dev · https://ui.shadcn.com/docs/tailwind-v4

# Planning — Backend YHOSINC

> Roadmap del backend, dividido en fases pequeñas. Cada fase solo se cierra cuando cumple el gate de [06-Reglas](../06-Reglas/README.md): sin bugs, optimizado, sin problemas de seguridad, y test end-to-end pasando. No se avanza a la siguiente fase sin eso verificado en código real.

## Estado de la documentación (Fase 0)

| Doc | Estado |
|---|---|
| [01-Arquitectura](../01-Arquitectura/README.md) | ✅ Confirmada |
| [05-Stack](../05-Stack/README.md) | ✅ Confirmado |
| [04-Security](../04-Security/README.md) | ✅ Checklist definido |
| [03-Planning](README.md) | ✅ Este doc |
| [02-Branding](../02-Branding/README.md) | ⏳ Pendiente |
| [06-Reglas](../06-Reglas/README.md) | ✅ Vigente |
| [07-Backend](../07-Backend/README.md) | ⏳ Se llena a medida que se implementa cada fase |

## Fases de implementación

### Fase 1 — Scaffold del proyecto ✅ (2026-07-13)
Setup base, sin funcionalidad de negocio todavía.
- [x] Estructura de carpetas del backend (`/backend` dentro de `B:\cloude`)
- [x] `package.json` + dependencias de [05-Stack](../05-Stack/README.md) — con un cambio: `bcrypt` se reemplazó por `bcryptjs` (ver nota abajo)
- [x] Prisma inicializado + schema (`contact_messages`, `admin_users`, `analytics_events`) — migración aplicada, `dev.db` creado
- [x] `.env.example` + carga de config (`dotenv`)
- [x] Servidor Express mínimo con `GET /api/health`
- **E2E gate**: ✅ verificado — servidor levantado en `http://localhost:3001`, `GET /api/health` respondió `200 {"status":"ok"}`.

**Desvíos del plan original (verificados, no hipotéticos):**
- `bcrypt` (nativo) requiere compilar código en la instalación, y esta máquina no tiene herramientas de compilación (mismo problema que con Python). Se reemplazó por `bcryptjs` (mismo resultado, sin compilación). Actualizado también en [05-Stack](../05-Stack/README.md).
- `npm audit` reporta 3 vulnerabilidades **moderadas** (no altas/críticas) en `@hono/node-server`, una dependencia interna de las herramientas de desarrollo de `prisma` (CLI, `devDependencies`) — **no** de `@prisma/client` (la librería que sí corre en producción, en `dependencies`). Por criterio del checklist de seguridad (solo bloquean altas/críticas), esto no bloquea la fase. Se revisa de nuevo antes del hardening final (Fase 7).

**Actualización 2026-07-13 — cambio de Nodemailer/Gmail a Resend:** al conectar el formulario real en la Fase 6, se detectó (con mensajes reales, no hipotético) que Gmail archiva los correos de contacto en "Enviados" en vez de "Recibidos" porque remitente y destinatario eran la misma cuenta (`yhosinc@gmail.com` → `yhosinc@gmail.com`). Esto afecta a cualquier visitante real del portfolio, no solo pruebas. Se cambió el envío a **Resend** (confirmado con el usuario antes de tocar código). Detalle en [01-Arquitectura §3.4](../01-Arquitectura/README.md) y [05-Stack](../05-Stack/README.md).
- [x] `RESEND_API_KEY` real configurado (2026-07-13) — mensaje de prueba enviado, Resend confirmó entrega con un ID de mensaje.
- **Test de seguridad de este cambio** (regla 4): ✅ `RESEND_API_KEY` no aparece en logs ni en respuestas de error al cliente (el manejador de errores centralizado sigue devolviendo solo "Error interno del servidor"); CORS y rate limiting no se tocaron, siguen activos.
- **Pendiente de confirmar con el usuario:** que el correo de esta última prueba haya caído en Recibidos (Inbox) y no en Enviados — avisó que iba a revisar.

### Fase 2 — Contacto ✅ (2026-07-13)
- [x] `POST /api/contact` con validación Zod — probado con datos inválidos, devuelve 400 con mensajes claros
- [x] Rate limiting — probado con 6 intentos seguidos, el 5to pasa y el 6to devuelve 429
- [x] Envío real de email vía Nodemailer/Gmail (Reply-To = email del visitante) — confirmado por el usuario, llegó a la bandeja con Reply-To correcto
- [x] Guardado en `contact_messages` — verificado directo en la base de datos
- **E2E gate**: ✅ mensaje real enviado, Gmail respondió `250 OK`, y el usuario confirmó que llegó a su bandeja con el remitente/Reply-To correctos.

**Nota:** se agregó GMAIL_APP_PASSWORD real al `.env` local (no versionado). El código ahora también loggea la respuesta de Gmail (messageId, response, accepted/rejected) para poder diagnosticar envíos sin exponer credenciales.

### Fase 3 — Autenticación admin ✅ (2026-07-13)
- [x] Script de seed (`src/seed-admin.js`) — usuario admin creado con password hasheado (bcryptjs, cost 12)
- [x] `POST /api/auth/login` con rate limiting — probado, el 4to intento fallido seguido devuelve 429
- [x] Middleware de verificación JWT (`requireAuth`) — protege `GET /api/auth/me` (ruta de prueba)
- **E2E gate**: ✅ verificado con curl —
  - sin token → 401
  - password incorrecta → 401
  - login correcto → 200 + JWT válido
  - `GET /api/auth/me` con ese JWT → 200 con el email correcto
  - 6to intento de login seguido → 429 (rate limit funcionando)
- **Test de seguridad de fase** (regla 4, aplicado retroactivo — ver [06-Reglas](../06-Reglas/README.md)): ✅
  - Token con firma alterada → rechazado (401), confirma que sí valida la firma y no solo que "hay un token"
  - Header `Authorization` mal formado (sin `Bearer`) → rechazado (401), sin crash
  - Login con email que no existe → mismo error genérico que password incorrecta (401 "Credenciales incorrectas"), no revela si el email existe
  - Intento de inyección en el campo email (`' OR 1=1--`) → rechazado en la validación (400), nunca llega a tocar la base de datos
  - Respuestas de `/login` y `/me` revisadas: nunca devuelven `passwordHash`, solo `token` o `email`

### Fase 4 — Analytics ✅ (2026-07-13)
- [x] `POST /api/analytics/event` (pageview, project_view) con rate limiting (30 / 15 min)
- [x] `GET /api/admin/analytics` (protegido) con métricas agregadas (total pageviews, total project views, desglose por proyecto)
- **E2E gate**: ✅ se dispararon 1 pageview + 3 project_view (2 de un proyecto, 1 de otro) y `GET /api/admin/analytics` devolvió exactamente esos números.
- **Test de seguridad de fase** (regla 4): ✅
  - `GET /api/admin/analytics` sin token → 401 (las métricas no son públicas)
  - Evento con `type` fuera del enum permitido → 400, rechazado en validación
  - `projectSlug` de 150 caracteres → 400, rechazado por el límite de longitud
  - Rate limit probado con 31 requests seguidos → el request #31 devolvió 429

### Fase 5 — Admin: mensajes ✅ (2026-07-13)
- [x] `GET /api/admin/messages` (protegido)
- **E2E gate**: ✅ se insertaron 2 mensajes de prueba, login admin + `GET /api/admin/messages` los devolvió exactos (nombre, email, mensaje, fecha), orden más reciente primero.
- **Test de seguridad de fase** (regla 4): ✅
  - Sin token → 401
  - Token inválido/falso → 401 (rechazado, no solo "sin token")

### Fase 5.5 — Subir proyectos como Instagram (agregado 2026-07-13)
> Diseño detallado pendiente a propósito — todavía no se define el "cómo", solo queda anotado que esta fase existe y qué debe lograr. Se retoma cuando el usuario lo pida.
- [ ] Pantalla simple donde Yhoset sube foto/video, escribe título/descripción, elige categoría, y publica.
- [ ] El proyecto publicado aparece automáticamente en el portfolio público, sin tocar código.
- **E2E gate** (a definir cuando se diseñe esta fase en detalle).

### Fase 6 — Integración frontend ✅ (2026-07-14)
- [x] React Router: página propia por proyecto (`/proyectos/:slug`, 2026-07-14) — cada proyecto tiene su propia URL, botón "VIEW PROJECT" ahora es un link real
- [x] Formulario de contacto real conectado a `POST /api/contact` (2026-07-13) — panel "compose" integrado en la sección 05 (Splash), reemplaza el botón `mailto:`
- [x] Tracking de analytics en pageview y vista de proyecto (2026-07-14) — evento `pageview` al cargar Home, evento `project_view` con el slug al entrar a una página de proyecto
- **E2E gate parcial (contacto)**: ✅ probado desde el navegador real — se llenó el formulario, se envió, la DB guardó el mensaje y Gmail confirmó `250 OK`.
- **Test de seguridad de este cambio** (regla 4): ✅ `CORS_ORIGIN` sigue restringido a `http://localhost:5500` (no wildcard); el formulario no refleja input del usuario de vuelta al DOM (sin riesgo de XSS reflejado); ninguna validación se relajó del lado del servidor, el frontend solo agrega validación de UX (`required`, `maxLength`) que no reemplaza la del backend.
- **Nota técnica:** el servidor estático de desarrollo (`server.ps1`) no mandaba `Cache-Control`, así que el navegador cacheaba `app.jsx` — se agregó `no-store` a las respuestas para que siempre sirva la versión más reciente durante desarrollo.

**Actualización 2026-07-14 — protección anti-flood (backend + frontend):** a pedido del usuario, para que nadie pueda tumbar los servidores mandando muchas peticiones seguidas:
- Backend: límite global de 300 peticiones/15min por IP en todas las rutas (antes solo los endpoints sensibles tenían límite propio), manejo de `uncaughtException`/`unhandledRejection` para que el proceso nunca se caiga por completo, y timeout de 10s en la llamada a Resend.
- Frontend (`server.ps1`, servidor local de desarrollo): límite de 60 peticiones/10s por IP.
- **Verificado con pruebas reales de flood**: 305 peticiones seguidas al backend → 300 pasan, 5 bloqueadas con `429`. 65 al frontend → 60 pasan, 5 bloqueadas. En ambos casos el servidor siguió respondiendo con normalidad después.
- **Sin pérdida de datos verificada**: se reinició el backend a propósito y se confirmó que el conteo de mensajes/usuarios en la base de datos no cambió antes/después.
- Detalle completo en [04-Security §2.2](../04-Security/README.md).

**Actualización 2026-07-14 — validación propia del formulario, sin depender del navegador:** los mensajes nativos del navegador para campos `required`/`type=email` (ej. "Please fill out this field") salen en el idioma del navegador de quien visita, no en el de la página. Se reemplazó por validación propia en JS (`noValidate` en el `<form>` + chequeo manual antes de mandar), con mensajes fijos que no dependen de la configuración del visitante.

**Actualización 2026-07-14 — formulario de contacto y mensajes públicos de la API en inglés:** el usuario aclaró que quería el formulario en inglés (consistente con el resto del portfolio, que ya está todo en inglés — "SEE THE WORK", "STACK & SKILLS", etc.). Se tradujo: el panel de compose completo (labels, placeholders, botones, mensaje de éxito) y los mensajes de error que la API devuelve en las rutas públicas (`/api/contact`, `/api/analytics/event`, límite global, error 500 genérico). Se dejaron en español los mensajes del login de admin (`/api/auth/*`) y el contenido del email de notificación que recibe Yhoset — esos no los ve el público, son solo para el dueño del sitio. Verificado en el navegador: formulario vacío → "Please enter your name.", email inválido → "Please enter a valid email.", envío exitoso → "MESSAGE SENT!" — confirmado también que el backend lo procesó (Resend aceptó el envío).

**Actualización 2026-07-14 — bug real de layout en el menú móvil (no era falta de difuminado):** el usuario reportó que al abrir el menú en mobile, el contenido del hero se veía mezclado detrás de los links del menú. La causa real: `.mobile-sheet` (el panel del menú, `position: fixed`) estaba anidado *dentro* de `<nav>`, y `<nav>` tiene `backdropFilter: blur(10px)` — esa propiedad crea un nuevo "contenedor de referencia" para los descendientes con `position: fixed` (mismo comportamiento que `transform`/`filter` según la spec de CSS). Como resultado, el menú se posicionaba y dimensionaba relativo a la caja del `<nav>` (~78px de alto) en vez de la pantalla completa — medido en el navegador: el panel medía 375×112px y quedaba pegado al costado, en vez de 375×812px cubriendo todo. **Arreglo:** se movió `.mobile-sheet` fuera de `<nav>`, como hermano en vez de hijo (usando un Fragment `<>`), para que vuelva a anclarse contra la pantalla real. Verificado con las medidas exactas antes/después (112px → 812px de alto) y visualmente: el menú ahora cubre toda la pantalla de forma sólida, sin ningún contenido de atrás visible, y cerrar/navegar sigue funcionando bien.

**Actualización 2026-07-14 — botón para cerrar el menú móvil, inalcanzable desde que se arregló el bug de arriba:** al arreglar el layout, quedó expuesto un problema real de usabilidad: el botón original (la X que reemplaza al ícono de hamburguesa) vive dentro de `<nav>` (z-index 60), pero el panel del menú (`.mobile-sheet`) tiene z-index 80 y cubre toda la pantalla — quedaba **literalmente tapado y no clickeable** una vez abierto el menú (confirmado con `elementFromPoint` en las coordenadas del botón: devolvía el `.mobile-sheet`, no el botón). La única forma de cerrar era tocar un link, que además navegaba a otra sección. Se agregó un botón de cerrar propio dentro del `.mobile-sheet`, mismo estilo y posición visual que el original, para que siempre sea alcanzable. Verificado abriendo el menú y cerrándolo con este botón sin navegar a ningún lado.

**Actualización 2026-07-14 — Fase 6 completa: React Router + analytics tracking.** Se agregó `react-router-dom` (vía esm.sh, mismo patrón que el resto de dependencias del frontend). Cada proyecto tiene un `slug` propio y su URL (`/proyectos/neon-commerce`, etc.), con página de detalle completa (thumbnail, categoría, blurb, tags, CTA de contacto) y una página 404 para slugs inválidos. El botón "VIEW PROJECT" ahora es un link real. Se agregó tracking: evento `pageview` al cargar Home, evento `project_view` (con el slug) al entrar a la página de un proyecto.

Bugs reales encontrados y arreglados durante la implementación (verificados, no hipotéticos):
- El `<script src="./app.jsx">` en `index.html` usaba una ruta **relativa** — al cargar en `/proyectos/algo`, el navegador la resolvía mal (`/proyectos/app.jsx`, un 404 disfrazado de `index.html` por el fallback de SPA), dejando la página en blanco con Babel reintentando en bucle. Se cambió a ruta absoluta (`/app.jsx`).
- La página 404 (slug inválido) no incluía `<style>{GLOBAL_CSS}</style>`, así que se veía sin ningún estilo (texto negro sobre negro). Se agregó.
- Los links "BACK TO ALL WORK" / "LET'S TALK" (que llevan de vuelta a `/#projects` y `/#contact`) ponían el hash correcto en la URL pero no hacían scroll — una navegación de React Router entre rutas nunca dispara el scroll-to-anchor nativo del navegador (eso solo pasa en una carga de página completa). Se agregó un `useEffect` que hace scroll manual al `id` del hash cuando el Home se monta.
- El servidor estático (`server.ps1`) necesitó un fallback de SPA (servir `index.html` para cualquier ruta que no sea un archivo real), para que entrar directo a una URL de proyecto o refrescar la página no diera 404.

**Test de seguridad de esta fase** (regla 4): ✅
- El `slug` de la URL solo se usa para buscar en el array `PROJECTS` propio (`.find()`) — nunca se inyecta como HTML ni se evalúa, sin riesgo de XSS vía la URL.
- Se probó **path traversal** sobre el nuevo fallback de SPA del servidor (`../../../Windows/System32/drivers/etc/hosts`, variantes con `%2f`, `%5c`, y `....//`) — ninguna funcionó: dos quedaron bloqueadas por el propio Windows (403) y las demás cayeron de forma segura al fallback (`index.html`), nunca se leyó ni sirvió un archivo fuera de la carpeta del proyecto.
- El endpoint `/api/analytics/event` que recibe los nuevos eventos automáticos (`pageview`, `project_view`) ya tenía su validación y rate limiting propios desde la Fase 4, sin cambios — se siguen aplicando igual.

**E2E gate completo de la Fase 6**: ✅ verificado en el navegador real — click en "VIEW PROJECT" navega a la página del proyecto correcto; entrar directo a la URL de un proyecto (sin pasar por Home) funciona; slug inválido muestra 404 estilizado; "BACK TO ALL WORK" y "LET'S TALK" vuelven a Home y hacen scroll a la sección correcta; los eventos `pageview` y `project_view` quedaron confirmados en la base de datos vía `GET /api/admin/analytics`.

### Fase 7 — Hardening final y deploy (en progreso)
- [x] **Migrar frontend a build real con Vite** (2026-07-14) — proyecto reestructurado: `src/App.jsx` + `src/main.jsx`, dependencias reales por npm (`react`, `react-dom`, `react-router-dom`, `lucide-react`, antes vía CDN/importmap), `vite.config.js`. Se eliminaron `app.jsx` (raíz) y `server.ps1`, ya no se usan.
  - **Resultado medido**: build de producción = 234KB JS (71KB comprimido) en un solo archivo optimizado, contra el setup anterior que mandaba el compilador Babel completo a cada visitante y traducía el JSX en vivo en su navegador.
  - **`npm audit` durante la instalación**: apareció una vulnerabilidad alta/moderada en `esbuild`/`vite` (afecta solo al *servidor de desarrollo*, no al build de producción que es lo que se despliega). Se resolvió actualizando de vite 5.4 a **vite 6.4.3** (trae esbuild parchado) sin necesidad de saltar a vite 8 (que sí sería un cambio grande). `npm audit` quedó en **0 vulnerabilidades**.
  - **E2E verificado en dev y en build de producción real** (`npm run build` + `npm run preview`): Home, navegación a proyecto, entrar directo a una URL de proyecto (SPA fallback), menú móvil, formulario de contacto (mensaje real enviado y confirmado por el backend) — todo funcionando igual en ambos modos.
- [x] Recorrer el checklist completo de [04-Security §3](../04-Security/README.md#3-checklist-previo-a-avanzar-de-fase-gate-de-reglas) (2026-07-14) — los 8 puntos verificados contra el código corriendo (no de memoria): validación Zod probada con requests reales en los 3 endpoints, rate limiting, hash+JWT, helmet+cors, `.env` fuera de git, manejo de errores, resiliencia del proceso, y test E2E completo.
- [x] `npm audit` limpio (2026-07-14) — backend: 3 moderadas conocidas/aceptadas (dev tooling de Prisma); frontend: 0 (tras subir a vite 6.4.3)
- [x] Revisión de que no queden secretos hardcodeados ni logs sensibles (2026-07-14) — grep en todo `src/` de ambos proyectos sin coincidencias de claves reales; logs del servidor revisados uno por uno, ninguno imprime contraseñas/tokens/API keys; `.env.example` sin valores reales
- [x] Resolver el punto abierto de hosting (2026-07-14) — decidido: **backend en Render o Railway** (sin tocar el código actual), Cloudflare solo para frontend + dominio. Se descartó Cloudflare D1 para no reescribir el backend ya probado.
- [x] **Deploy del frontend a Cloudflare Pages** (2026-07-14) — repo subido a GitHub (`github.com/yhoset/yhosinc-portfolio`), conectado a Cloudflare Pages. Sitio en vivo: **https://yhosinc-portfolio.pages.dev**
  - **Bug real encontrado y arreglado durante el deploy**: el campo "Build output directory" en la configuración de Cloudflare quedó vacío después de configurar el "Root directory" — Cloudflare terminó publicando los archivos **fuente** (`/src/main.jsx` sin compilar) en vez de los de `dist/`, dejando la página en blanco. Se detectó revisando el HTML servido en producción (mostraba `<script src="/src/main.jsx">` en vez del bundle compilado) y el log de build (mostraba `dist/index.html` y `dist/assets/index-*.js` generados correctamente, pero el deploy inicial subió 9 archivos fuente en vez de los 2 de `dist/`). Se corrigió completando "Build output directory: dist" a mano en Settings → Build configuration, y se re-desplegó — el redeploy subió exactamente los 2 archivos de `dist/`.
  - **Verificado en el sitio real ya público** (no en local): Home carga bien, sin errores de consola; entrar directo a `/proyectos/neon-commerce` funciona (SPA fallback de Cloudflare Pages funcionando solo, sin configuración extra).
- [ ] **Deploy del backend a Render/Railway** — pendiente. El frontend ya en vivo todavía apunta a `API_BASE_URL = "http://localhost:3001"` (verificado: un fetch de prueba desde el sitio real a esa URL falla, como es esperable) — el formulario de contacto y el analytics del sitio público **no van a funcionar para visitantes reales** hasta completar este paso y actualizar esa URL al dominio real del backend.
- **E2E gate**: checklist de seguridad 100% verificado contra el código corriendo, no de memoria; sitio accesible públicamente y probado de punta a punta ya en producción — **parcial**: frontend sí, backend todavía no.

## Fuera de alcance (por ahora)
- CMS para editar proyectos desde el admin (confirmado fuera de alcance en [01-Arquitectura](../01-Arquitectura/README.md))

## Cómo se reporta avance
En cada fase, antes de decir "lista", se verifica el checklist de esa fase contra el código real y se corre el E2E gate correspondiente — no se reporta como completa una fase sin eso (regla 1 y 3 de [06-Reglas](../06-Reglas/README.md)).

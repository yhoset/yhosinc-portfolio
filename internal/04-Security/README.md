# Security — Backend YHOSINC

> Basado en el stack confirmado en [05-Stack](../05-Stack/README.md) y el alcance de [01-Arquitectura](../01-Arquitectura/README.md). Esto es el checklist de controles a implementar — se verifica contra código real antes de marcar cualquier ítem como cumplido (ver [06-Reglas](../06-Reglas/README.md)).

## 1. Superficie de ataque relevante

Solo 3 endpoints son públicos (sin auth) — son el foco principal de riesgo:
- `POST /api/contact` — recibe input libre de cualquier visitante
- `POST /api/analytics/event` — recibe input libre de cualquier visitante
- `POST /api/auth/login` — objetivo de fuerza bruta

El resto (`GET /api/admin/*`) está detrás de JWT, riesgo secundario si el login está bien protegido.

## 2. Controles por capa

### 2.1 Input (contacto y analytics)
- Validar **todo** input con Zod: tipos, longitud máxima, formato de email — nunca confiar en lo que manda el cliente.
- Rechazar HTML/scripts en el campo `message` (no se renderiza como HTML en ningún lado, pero se sanea igual antes de guardar).
- Límite de tamaño del body (`express.json({ limit: '10kb' })`) para evitar payloads gigantes.

### 2.2 Rate limiting / anti-abuso
- `express-rate-limit` en `/api/contact` (ej. 5 intentos / 15 min por IP) — evita spam al correo.
- `express-rate-limit` en `/api/analytics/event` (más permisivo, pero con tope) — evita inflar métricas o saturar la DB.
- `express-rate-limit` en `/api/auth/login` (ej. 5 intentos / 15 min por IP) — evita fuerza bruta sobre la única cuenta admin.
- **Límite global** (agregado 2026-07-13): un `express-rate-limit` adicional aplicado a **todas** las rutas, incluida `/api/health` (300 peticiones / 15 min por IP) — cubre el caso de alguien inundando el servidor con peticiones repetidas a cualquier endpoint, no solo a los sensibles. Verificado con 305 peticiones seguidas: las primeras 300 pasan, el resto recibe `429`.
- **Resiliencia del proceso** (agregado 2026-07-13): `process.on('uncaughtException')` y `process.on('unhandledRejection')` en `server.js` — una petición rara o un error no manejado se loggea pero nunca tumba el proceso completo. Los datos viven en SQLite (archivo en disco vía Prisma), así que sobreviven a cualquier caída o reinicio sin pérdida — verificado reiniciando el servidor y confirmando que el conteo de mensajes/usuarios en la DB no cambió.
- **Timeout en llamadas externas** (agregado 2026-07-13): el envío de email vía Resend tiene un límite de 10s (`AbortController`) — si Resend no responde, la petición se corta en vez de quedar colgada acumulando conexiones abiertas.

### 2.3 Autenticación admin
- Password del admin: hasheado con `bcrypt` (cost factor ≥ 12), nunca en texto plano ni en logs.
- JWT: expiración corta (ej. 2h), firmado con `JWT_SECRET` largo y aleatorio (nunca un valor por defecto).
- No hay endpoint de registro público — el usuario admin se crea una sola vez vía script/seed, no vía API.
- El JWT se valida en cada request a `/api/admin/*` (middleware), nunca confiar en un valor de rol enviado por el cliente.

### 2.4 Inyección / base de datos
- Prisma parametriza todas las queries por diseño → sin SQL injection mientras no se use `$queryRawUnsafe` con input del usuario (no se usa en este proyecto).
- El archivo SQLite (`dev.db`) nunca se sirve como estático ni queda accesible por HTTP.

### 2.5 Transporte y headers
- `helmet` para headers de seguridad por defecto (HSTS, X-Content-Type-Options, etc.).
- `cors` restringido a `CORS_ORIGIN` (el dominio real del frontend) — nunca `*` en producción.
- HTTPS obligatorio en producción (a nivel de hosting/reverse proxy, ya que en local no aplica).

### 2.6 Secretos y configuración
- `JWT_SECRET`, `GMAIL_APP_PASSWORD`, `DATABASE_URL` solo en variables de entorno.
- `.env` en `.gitignore` desde el primer commit; solo se versiona `.env.example` sin valores reales.
- Nunca loggear el contenido de `.env`, tokens, ni contraseñas (ni siquiera hasheadas) en consola/logs.

### 2.7 Manejo de errores
- Middleware de errores centralizado: nunca devolver stack traces ni mensajes internos de Prisma/Node al cliente — solo un mensaje genérico + código HTTP correcto.
- Loggear el error completo solo del lado del servidor (consola/archivo local), nunca en la respuesta HTTP.

### 2.8 Dependencias
- Correr `npm audit` antes de cada avance de fase (ver gate en Reglas) y resolver vulnerabilidades altas/críticas antes de continuar.

### 2.9 Email
- El envío usa una API key de Resend con permiso restringido "solo envío" (no puede leer ni administrar la cuenta) — revocable independientemente si se compromete. (Cambiado 2026-07-13 desde Gmail App Password, ver [01-Arquitectura §3.4](../01-Arquitectura/README.md)).
- El email de contacto se envía con el remitente fijo del sistema (`RESEND_FROM_EMAIL`), **no** con el email que ingresa el visitante en `From` (evita spoofing) — el email del visitante va solo en el cuerpo/`Reply-To`.
- Timeout de 10s en la llamada a la API de Resend (ver 2.2) para que no queden conexiones colgadas.

## 3. Checklist previo a avanzar de fase (gate de Reglas)

Antes de dar por cerrada la fase de seguridad del backend, verificar contra el código real (no dar por hecho):
- [x] Validación Zod activa en los 3 endpoints con input externo — verificado con requests reales (`{}` vacío → 400 en los 3)
- [x] Rate limiting activo y probado en `/api/contact`, `/api/analytics/event`, `/api/auth/login`, y global en todas las rutas (2026-07-13)
- [x] Password admin hasheado con bcryptjs, JWT con expiración y secret fuerte
- [x] `helmet` + `cors` configurados
- [x] `.env` fuera del control de versiones, `.env.example` presente
- [x] Middleware de errores no filtra detalles internos
- [x] Proceso resiliente a errores no manejados (`uncaughtException`/`unhandledRejection`), datos persistidos en disco (2026-07-13)
- [x] `npm audit` sin vulnerabilidades altas/críticas (2026-07-14) — backend: 3 moderadas conocidas y aceptadas (herramientas dev de Prisma, no afectan producción); frontend: 0 vulnerabilidades tras subir a vite 6.4.3
- [x] Test end-to-end del flujo completo (contacto → email recibido, login admin → ver mensajes) pasando

_Este checklist se marca solo cuando cada punto se comprobó en el código corriendo, no de memoria (regla 1 y 2 de [06-Reglas](../06-Reglas/README.md))._

# Arquitectura — Backend YHOSINC

> Estado: **confirmada** (2026-07-13). Stack: SQLite + Nodemailer/Gmail. Sujeta a revisión si en el camino aparece una razón concreta para cambiarla (ver nota en sección 4).

## 1. Alcance confirmado (2026-07-13)

Incluido:
- **Contacto directo por email**: el visitante manda un mensaje/opinión desde el portfolio y llega al correo `yhosinc@gmail.com`.
- **Vista individual por proyecto**: cada trabajo del portfolio se puede "entrar y ver" (hoy solo existe como card en un scroll, sin ruta/página propia).
- **Autenticación admin**: solo Yhoset puede entrar a un panel privado.
- **Analytics / métricas**: registrar visitas al portfolio y vistas por proyecto.
- **Subir proyectos como Instagram** (agregado 2026-07-13): Yhoset entra a una pantalla simple, sube una foto o video, escribe título/descripción, elige categoría, y publica — sin tocar código. El proyecto aparece solo en el portfolio público.
  - **Diseño detallado pendiente a propósito** (a pedido del usuario) — acá solo queda anotado el *qué* debe hacer, no el *cómo* se construye por dentro. Cuando se retome, hay que definir cosas como: dónde se guardan las fotos/videos subidos, y cómo se conecta esa pantalla con el resto del sitio.

Ya NO aplica (reemplazado por el punto anterior):
- ~~CMS para editar proyectos desde el admin~~ — esto se descartó originalmente y ahora se vuelve a incluir: "subir proyectos como Instagram" es, en el fondo, lo mismo que un CMS simple.

## 2. Visión general

```
┌─────────────────────┐        ┌──────────────────────┐       ┌─────────────────┐
│  Visitante (browser) │──HTTP─▶│   Backend API (Node)  │──────▶│  Base de datos   │
│  React SPA           │◀───────│   Express + Prisma     │       │  (contactos,     │
│  - Home               │        │                        │       │   eventos)       │
│  - /proyectos/:slug   │        │  POST /api/contact     │       └─────────────────┘
│  - Formulario contacto│        │  POST /api/analytics   │
└─────────────────────┘        │  POST /api/auth/login  │       ┌─────────────────┐
                                 │  GET  /api/admin/*     │──────▶│  Proveedor email │
┌─────────────────────┐        │  (protegido con JWT)   │       │  (envía a        │
│  Yhoset (admin)       │──HTTP─▶│                        │       │  yhosinc@gmail)  │
│  Panel privado        │        └──────────────────────┘       └─────────────────┘
└─────────────────────┘
```

## 3. Componentes

### 3.1 Frontend
Cambios necesarios sobre lo que ya existe en [portfolio-preview](../../portfolio-preview):
- Agregar **routing real** (React Router) para que cada proyecto tenga su propia URL (`/proyectos/neon-commerce`, etc.) en vez de solo anclas `#projects`.
- Reemplazar el `mailto:` del botón de contacto por un **formulario real** (nombre, email, mensaje) que llame al backend.
- Instrumentar analytics: enviar un evento al backend en cada pageview y cada vez que se abre el detalle de un proyecto.

### 3.2 Backend API
| Servicio | Endpoint | Público/Protegido | Función |
|---|---|---|---|
| Contact | `POST /api/contact` | Público (rate-limited) | Valida input, guarda el mensaje, envía email a yhosinc@gmail.com |
| Auth | `POST /api/auth/login` | Público (rate-limited) | Valida credenciales del único usuario admin, devuelve JWT |
| Admin — mensajes | `GET /api/admin/messages` | Protegido (JWT) | Lista los mensajes de contacto recibidos |
| Admin — analytics | `GET /api/admin/analytics` | Protegido (JWT) | Métricas agregadas (visitas, vistas por proyecto) |
| Analytics | `POST /api/analytics/event` | Público (rate-limited) | Registra un evento (pageview / project_view) |

### 3.3 Base de datos
Tablas mínimas:
- `contact_messages` (id, name, email, message, created_at)
- `admin_users` (id, email, password_hash) — un único registro, sin registro público
- `analytics_events` (id, type, project_slug nullable, created_at, meta)

### 3.4 Email
El backend envía el mensaje de contacto a `yhosinc@gmail.com` en cuanto llega — no se depende de que el admin entre al panel para enterarse.

**Cambio 2026-07-13 — de Nodemailer/Gmail a Resend:** se detectó en pruebas reales que, al mandar el correo desde `yhosinc@gmail.com` hacia el mismo `yhosinc@gmail.com`, Gmail archiva el mensaje principalmente en "Enviados" en vez de "Recibidos" (reconoce que el remitente autenticado es la misma cuenta). Esto afecta a **cualquier visitante real**, no solo a las pruebas. Se resolvió activando el trigger ya anticipado en la sección 4: se cambió el envío a **Resend**, que manda desde una dirección distinta (`onboarding@resend.dev` por defecto, o un dominio propio verificado más adelante) hacia `yhosinc@gmail.com` — al no coincidir remitente y destinatario, Gmail ya no lo archiva como enviado.

### 3.5 Hosting (agregado 2026-07-13)
Usuario definió: **Cloudflare** (dash.cloudflare.com).

⚠️ **Punto pendiente de resolver antes de la Fase 7 (deploy), no bloquea el trabajo actual:**
Cloudflare Pages sirve bien para el frontend (sitio estático), pero **Cloudflare Workers** (su forma de correr el backend) no soporta archivos en disco persistentes entre visitas — y SQLite es justamente un archivo en disco. Esto choca con el stack actual. Opciones a decidir más adelante, cuando se llegue al deploy:
1. Usar **Cloudflare D1** (la base de datos propia de Cloudflare, compatible con SQLite pero no es un archivo local) en vez del SQLite actual.
2. Alojar el backend en otro lado (ej. Render/Railway, gratis para este tamaño de proyecto) y usar Cloudflare solo para el frontend + dominio.
No se decide ahora — se retoma en la Fase 7 de [03-Planning](../03-Planning/README.md).

## 4. Stack propuesto

| Capa | Elección propuesta | Por qué |
|---|---|---|
| Runtime | Node.js (LTS) | Mismo lenguaje que el frontend, no se necesita un runtime nuevo. |
| Framework | Express | El alcance (5 endpoints) no justifica algo más pesado como NestJS. |
| DB | SQLite (vía Prisma) | Cero infraestructura para empezar; Prisma permite migrar a Postgres después sin reescribir el código. |
| ORM | Prisma | Migraciones y validación de esquema sin SQL a mano. |
| Auth | JWT + bcrypt | Un solo usuario admin, no hace falta OAuth ni un sistema de roles. |
| Validación de input | Zod | Evita mensajes de contacto malformados o maliciosos. |
| Envío de email | ~~Nodemailer + Gmail App Password~~ → **Resend** (cambiado 2026-07-13) | Gmail archivaba los mensajes en "Enviados" por remitente=destinatario (ver 3.4). Resend evita ese problema al mandar desde una dirección distinta. |
| Rate limiting | express-rate-limit | Obligatorio en `/api/contact` y `/api/analytics/event` para evitar spam/abuso. |

**Confirmado (2026-07-13):** SQLite + Nodemailer/Gmail. Motivos para reconsiderarlo más adelante, a vigilar durante la implementación:
- **SQLite → Postgres**: si se necesita acceso concurrente desde múltiples instancias/servidores, o el hosting elegido no soporta almacenamiento en disco persistente (típico en algunos serverless/PaaS).
- **Nodemailer/Gmail → Resend/SendGrid**: si Gmail empieza a bloquear o limitar el envío (límites de cuenta personal, App Password revocado), o si se necesita tracking de entregabilidad (bounces, spam).

Si durante la implementación aparece alguna de estas señales, se marca aquí y se avisa antes de cambiar nada.

## 5. Seguridad (detalle completo en [04-Security](../04-Security/README.md))
- Validar y sanear todo input del formulario de contacto.
- Rate limit en los dos endpoints públicos (`/api/contact`, `/api/analytics/event`).
- Password del admin hasheado con bcrypt, nunca en texto plano.
- JWT con expiración corta.
- CORS restringido al dominio del frontend.
- Secretos (JWT secret, credenciales de email) solo en variables de entorno, nunca hardcodeados ni versionados.
- HTTPS obligatorio en producción.

## 6. Próximos pasos
1. Confirmar contigo el stack propuesto (sección 4) o ajustarlo.
2. Detallar versiones/dependencias exactas en [05-Stack](../05-Stack/README.md).
3. Definir hosting (pendiente, no bloquea el diseño).
4. Recién ahí pasar a implementación — sujeta al gate de [06-Reglas](../06-Reglas/README.md): sin bugs, optimizado, sin problemas de seguridad, y test end-to-end antes de avanzar de fase.

# Stack

> Confirmado 2026-07-13, alineado con [01-Arquitectura](../01-Arquitectura/README.md).

## Frontend
- **Vite** (migrado 2026-07-14, ver [03-Planning](../03-Planning/README.md) Fase 7) — build real, reemplaza el setup anterior de Babel-en-navegador + CDN. `vite@6.4.3` (subido desde 5.4 por una vulnerabilidad del servidor de dev en esbuild, ver nota en Planning).
- React 18 + react-dom — como dependencias npm reales, ver [portfolio-preview](../../portfolio-preview)
- react-router-dom — rutas por proyecto (`/proyectos/:slug`)
- lucide-react — íconos

## Backend
| Dependencia | Uso |
|---|---|
| `express` | Framework HTTP / routing |
| `prisma` + `@prisma/client` + `@prisma/adapter-better-sqlite3` | ORM sobre SQLite — Prisma 7 requiere un adaptador explícito de driver, no se descubrió hasta implementar |
| `zod` | Validación de input (contacto, login) |
| `jsonwebtoken` | Emisión/verificación de JWT para el admin |
| `bcryptjs` | Hash de la contraseña del admin (cambiado desde `bcrypt`: la versión nativa necesita compilar código y esta máquina no tiene herramientas de compilación instaladas — `bcryptjs` hace lo mismo en JS puro, sin ese requisito) |
| _(ninguna — se usa `fetch` nativo de Node)_ | Envío del email de contacto vía la API HTTP de Resend, sin SDK extra |
| `express-rate-limit` | Rate limiting en endpoints públicos |
| `cors` | Restringir origen al dominio del frontend |
| `dotenv` | Carga de variables de entorno |

## Base de datos
- **SQLite** (archivo local, gestionado vía Prisma) — confirmado, con criterios de migración a Postgres documentados en [01-Arquitectura §4](../01-Arquitectura/README.md).

## Email
- **Resend** (cambiado 2026-07-13, ver [01-Arquitectura §3.4](../01-Arquitectura/README.md)) — envía desde `onboarding@resend.dev` (dominio compartido de pruebas de Resend) hacia `yhosinc@gmail.com`. Se puede cambiar a un dominio propio verificado más adelante sin tocar código, solo la variable `RESEND_FROM_EMAIL`.

## Variables de entorno necesarias (backend)
```
DATABASE_URL=file:./dev.db
JWT_SECRET=
CONTACT_INBOX_EMAIL=yhosinc@gmail.com
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
CORS_ORIGIN=http://localhost:5500
PORT=3001
```
_(Nunca versionar el `.env` real — solo un `.env.example` sin valores.)_

## Hosting
**Cloudflare** (confirmado 2026-07-13, dash.cloudflare.com) — con un punto abierto sobre cómo alojar el backend, ver [01-Arquitectura §3.5](../01-Arquitectura/README.md). No bloquea el trabajo local actual, se resuelve en Fase 7.

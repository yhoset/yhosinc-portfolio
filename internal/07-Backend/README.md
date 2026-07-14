# Backend

Código real en [B:\cloude\backend](../../backend). Este doc es notas de estado, el detalle de diseño vive en [01-Arquitectura](../01-Arquitectura/README.md) y [03-Planning](../03-Planning/README.md).

## Estado actual (Fase 5 completada — 2026-07-13)
- Servidor Express corriendo en `http://localhost:3001`
- Prisma + SQLite configurados (con adaptador `@prisma/adapter-better-sqlite3`)
- **Fase 1** ✅ scaffold + `GET /api/health`
- **Fase 2** ✅ `POST /api/contact` — valida, guarda en DB, manda email real a `yhosinc@gmail.com` (confirmado recibido)
- **Fase 3** ✅ `POST /api/auth/login` + `GET /api/auth/me` (protegido) — login del admin funcionando con JWT
- **Fase 4** ✅ `POST /api/analytics/event` + `GET /api/admin/analytics` (protegido) — métricas agregadas verificadas
- **Fase 5** ✅ `GET /api/admin/messages` (protegido) — lista de mensajes de contacto verificada
- `.env` local completo: `DATABASE_URL`, `JWT_SECRET`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `CORS_ORIGIN`, `PORT`
- Usuario admin creado (`yhosinc@gmail.com`, password elegida por el usuario, guardada solo como hash bcrypt)

## Endpoints activos
| Método | Ruta | Protegido | Estado |
|---|---|---|---|
| GET | `/api/health` | No | ✅ |
| POST | `/api/contact` | No (rate-limited) | ✅ |
| POST | `/api/auth/login` | No (rate-limited) | ✅ |
| GET | `/api/auth/me` | Sí (JWT) | ✅ (ruta de prueba) |
| POST | `/api/analytics/event` | No (rate-limited) | ✅ |
| GET | `/api/admin/analytics` | Sí (JWT) | ✅ |
| GET | `/api/admin/messages` | Sí (JWT) | ✅ |

## Cómo correrlo
```
cd B:\cloude\backend
npm run dev
```
Sirve en `http://localhost:3001`.

## Siguiente fase
Fase 6 — Integración frontend (ver [03-Planning](../03-Planning/README.md)): conectar el portfolio real con este backend (rutas por proyecto, formulario de contacto real, tracking de analytics).

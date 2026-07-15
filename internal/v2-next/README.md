# YHOSINC · Portfolio v2 (Next.js) — Documentación de proyecto

Migración del portfolio de **React + Vite** a **Next.js**, multi-página, con
técnicas avanzadas: fondo 3D "modo juego", roadmap interactivo en canvas,
skills filtrables por disciplina, página de tools, y un logo 3D en el header.

> El portfolio actual (React + Vite, en Cloudflare Pages + Render + Turso)
> **sigue vivo en producción**. La v2 se construye en paralelo, en una carpeta
> nueva, y recién reemplaza a la v1 cuando esté 100% terminada y verificada.

## Documentos

| Doc | Contenido |
|---|---|
| [arquitectura.md](arquitectura.md) | Stack, estructura de carpetas, mapa de rutas, capa de datos, migración desde v1, fases de construcción. |
| [branding-y-filosofia.md](branding-y-filosofia.md) | Concepto, personalidad de marca, color, tipografía, el logo 3D, voz/tono, principios de interacción. |
| [seguridad-y-optimizacion.md](seguridad-y-optimizacion.md) | Seguridad (auth, validación, rate limiting, secrets en Cloudflare), performance (RSC, 3D, Core Web Vitals), accesibilidad, testing, gate de calidad por fase. |
| [herramientas.md](herramientas.md) | Todas las librerías/herramientas, con qué son, por qué, licencia y link. Research real, todo open-source. Nada instalado todavía. |

## Decisiones ya tomadas

- **Stack**: Full Next.js consolidado (frontend + backend en un solo proyecto), hosteado en **Cloudflare Workers** vía el adaptador **OpenNext**. Turso sigue siendo la base de datos.
- **Idiomas**: Español + Inglés (par por defecto del proyecto).
- **Estética**: se mantiene y evoluciona la identidad manga/cómic actual ("ink & code").

## Reglas de trabajo vigentes (heredadas del proyecto)

1. Verificar antes de reportar — nunca reportar sin revisar/correr/probar el código real.
2. No inventar problemas — no señalar bugs/riesgos no confirmados.
3. Gate de fase — solo se avanza cuando: sin bugs, optimizado, seguro, y con test E2E exitoso.
4. Test de seguridad por fase — además del E2E funcional, probar explícitamente que el cambio sigue siendo seguro.
5. Nada de bugs ni errores intencionales — siempre buenas prácticas.
6. Diseño con herramientas reales — investigar plugins/librerías open-source, no improvisar; preguntar antes de instalar; sin comprometer el espacio en disco.
7. Responsive real — probar en breakpoints reales (móvil, tablet, laptop, desktop) antes de reportar.

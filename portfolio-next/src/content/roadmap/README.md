# Roadmap canvas — datos

Todavía no hay hitos reales cargados (2026-07-15) — el usuario los va a
mandar de a poco, igual que con los proyectos. Este archivo documenta el
formato esperado, no es contenido de ejemplo.

## Dónde van los datos

`src/lib/roadmap.ts` → array `ROADMAP_NODES`. No hay carpeta de `.mdx` acá
(a diferencia de proyectos) porque cada hito es un dato corto (título +
descripción de 1-2 líneas), no un case study largo.

## Forma de cada nodo

```ts
{
  id: "react-fundamentals",       // único, en inglés, kebab-case
  branch: "programming",          // "programming" | "design" | "ai"
  level: "junior",                // "junior" | "mid" | "senior"
  title: "React — fundamentos",   // se muestra en el nodo (ojo: hoy no
                                   // pasa por next-intl, ver nota abajo)
  description: "Componentes, hooks, estado — la base de todo lo que vino después.",
  status: "done",                 // "done" | "current" | "upcoming"
  powerUp: 400,                   // cuánto suma al Power Level al abrirse
  dependsOn: [],                  // ids de nodos previos en la misma rama,
                                   // para dibujar la conexión entre ellos
}
```

## Reglas

- **`status: "current"`** debería usarse en el/los hito(s) donde el usuario
  está *ahora mismo* — por eso arrancó pidiendo el roadmap: "estoy en el
  punto de mid". Solo debería haber uno (o pocos) nodo "current" por rama a
  la vez.
- **`powerUp`** es narrativo (branding-y-filosofia.md §7) — un número
  razonable relacionado a la importancia del hito, no una métrica real. No
  gatea nada del contenido.
- **i18n**: `title`/`description` hoy son un solo string, no `{es, en}` —
  cuando lleguen los datos reales, si hace falta traducir, se puede migrar
  a `{ es: "...", en: "..." }` sin tocar el resto del sistema (el
  componente ya está preparado para recibir ese cambio de forma sin gran
  esfuerzo).

## Cómo se agrega un hito nuevo

1. Agregar el objeto a `ROADMAP_NODES` en `src/lib/roadmap.ts`.
2. `/roadmap` lo recoge automáticamente — no hace falta tocar nada más.

# Case studies de proyectos

Todavía no hay proyectos reales cargados (2026-07-15) — el usuario va a
mandarlos de a poco. Este archivo documenta el formato esperado para cuando
lleguen, no es contenido de ejemplo.

## Estructura

Cada proyecto es una carpeta con su slug, y un `.mdx` por idioma:

```
src/content/projects/
  <slug>/
    es.mdx
    en.mdx
```

## Frontmatter (`export const metadata`)

Cada `.mdx` exporta un objeto `metadata` al principio del archivo:

```mdx
export const metadata = {
  title: "NOMBRE DEL PROYECTO",
  category: "WEB", // WEB | DESIGN | DEV | RESEARCH
  tagline: "Una línea corta de contexto",
  blurb: "2-3 líneas para la tarjeta del grid de /proyectos.",
  tags: ["React", "Node"],
  size: "md", // lg | md | sm — controla el tamaño en el grid masonry
  link: "https://ejemplo.com", // opcional, sitio en vivo
};

# Contenido del case study

Acá va el contenido completo en Markdown/MDX — puede incluir componentes
React si hace falta.
```

## Cómo se agrega un proyecto nuevo

1. Crear `src/content/projects/<slug>/es.mdx` y `en.mdx` con el formato de
   arriba.
2. Agregar `<slug>` al array en `src/lib/projects.ts`
   (`getProjectSlugs()`) — es la lista explícita de proyectos publicados,
   a propósito no se auto-descubre desde el filesystem en producción (ver
   seguridad-y-optimizacion.md: rutas dinámicas con lista cerrada, no
   adivinadas).
3. `/proyectos` y `/proyectos/<slug>` lo recogen automáticamente.

## Sobre `_scaffold/es.mdx` — no lo borres

`_scaffold/` **no es un proyecto** — nunca aparece en `PROJECT_SLUGS`
(`src/lib/projects.ts`), así que `generateStaticParams` +
`dynamicParams = false` lo dejan inalcanzable por completo: ninguna URL
puede llegar a mostrarlo. Existe únicamente porque `import(`@/content/projects/${slug}/${locale}.mdx`)`
es un import dinámico con dos segmentos variables — con **cero** archivos
`.mdx` reales en todo `src/content/projects/`, Turbopack en modo dev no
puede construir el "context module" para ese patrón y la ruta
`/proyectos/[slug]` se rompe (error de compilación, página en blanco)
para *cualquier* slug, incluso los que ya deberían 404 limpio. Confirmado:
con este único archivo presente, el 404 vuelve a funcionar bien tanto en
`next dev` como en `next start`. En cuanto se agregue el primer proyecto
real, este archivo deja de ser necesario (pero no molesta si se queda).

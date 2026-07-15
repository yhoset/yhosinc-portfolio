# Branding y filosofía — Portfolio v2

## 1. Concepto central

**"Ink & code"** — interfaces que se leen como la splash page de un manga:
fuertes donde importa, precisas donde cuenta. El portfolio no es un CV plano;
es una **experiencia jugable** que muestra la intersección de las tres ramas de
YHOSINC: **programación + diseño + inteligencia artificial**.

La v2 lleva ese concepto más lejos con un "modo juego": fondo 3D reactivo al
cursor, navegación tipo command palette, y un roadmap del camino de aprendizaje
que el visitante puede recorrer.

## 2. Personalidad de marca

- **Confiada, no arrogante.** Muestra nivel real (mid, subiendo a senior) sin
  inflar.
- **Técnica y estética a la vez.** Cada decisión visual tiene una razón de
  ingeniería detrás (y viceversa).
- **Lúdica pero profesional.** El "modo juego" nunca estorba la lectura ni la
  performance. La diversión vive en los detalles, no en el ruido.
- **Honesta.** El roadmap muestra el progreso real, incluyendo lo que todavía se
  está aprendiendo.

## 3. Sistema de color

Se conservan los tokens de marca actuales (alto contraste, energía cómic):

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#0A0A0F` | Fondo base, contornos gruesos, "tinta". |
| `cyan` | `#00F5FF` | Acento primario, foco, energía. |
| `yellow` | `#FFE000` | Acento secundario, destacados. |
| `red` | `#FF2D55` | CTA, alertas, "POW". |
| `white` | `#FFFFFF` | Texto principal, superficies claras. |
| `panel-bg` | `#111118` | Paneles. |
| `panel-bg-alt` | `#16161F` | Paneles alternos, inputs. |

En v2 estos se declaran como **tokens de Tailwind v4** (`@theme`), disponibles
como utilidades y como variables CSS. Se define además el comportamiento en
**modo claro/oscuro** (la base es oscura; el modo claro es una variante, no un
after-thought).

## 4. Tipografía

Se mantiene el trío actual (cargado con `next/font` para performance y sin
layout shift):

- **Bangers** — títulos display, impacto tipo cómic.
- **Bebas Neue** — subtítulos, etiquetas, números.
- **Rajdhani** — cuerpo, UI, texto largo (legible y técnica).

Regla: **sentence case** salvo en logotipos/impacto deliberado; nunca abusar de
mayúsculas en texto largo.

## 5. El logo 3D del header

Una versión **pequeña** del personaje low-poly que hoy flota en el hero:

- Cabeza low-poly (los mismos planos angulares, ojos cian) en **React Three
  Fiber**, de bajo costo (pocos polígonos, sin postprocesado pesado).
- **Mira hacia el cursor** (rotación suave siguiendo el puntero), con un
  micro-idle animation cuando el cursor está quieto.
- En móvil/touch o bajo `prefers-reduced-motion`, cae a una versión estática
  (SVG o imagen) — nunca penaliza el arranque de la página.
- Doble función: identidad de marca **y** primer guiño del "modo juego".

## 6. Voz y tono (ES / EN)

- Par de idiomas por defecto: **Español + Inglés**.
- Tono directo, cálido, sin relleno corporativo. Verbos primero en botones
  ("Ver el trabajo", "See the work").
- Los errores dicen qué pasó y qué hacer, sin jerga cruda.
- Los textos viven en `i18n/messages/{es,en}.json`; nada hardcodeado.

## 7. Power Level (mecánica de marca)

El **Power Level** es la capa de gamificación que hace que **cada paso se sienta
épico** sin romper el profesionalismo: un medidor de poder estilo manga/juego que
acompaña al visitante durante toda la visita.

**Cómo funciona**
- Un HUD persistente y discreto muestra `POWER LEVEL` con un número grande
  (Bangers) que **sube** a medida que se explora el sitio y se recorre el roadmap.
- Cada hito/sección/nodo del roadmap, al alcanzarse, dispara un **"power up"**:
  una micro-explosión "POW" (cian/amarillo/rojo) y una **línea corta que explica
  ese paso** — ej.: *"⚡ Desbloqueado: React Three Fiber — de dibujar interfaces a
  esculpir mundos. +850 PWR"*.
- El nivel **base es real**: se alimenta de la actividad de GitHub, así no es un
  número inventado.

**Por qué**
- Convierte el recorrido en un "arco de entrenamiento": junior → **mid** → senior
  se siente como subir de nivel.
- Explica el valor de cada skill/hito en una frase, en lugar de listar tecnologías
  sueltas.
- Unifica todo el "modo juego" (fondo 3D, roadmap, scroll) bajo una sola métrica.

**Reglas**
- Nunca tapa el contenido ni distrae de la lectura; vive en una esquina.
- Respeta `prefers-reduced-motion`: el número sube, pero sin la explosión animada.
- Es narrativo, no un gate: **nada** del contenido depende de "subir de nivel".

## 8. Principios de interacción ("modo juego")

1. **El movimiento comunica, no decora.** Cada animación tiene un propósito
   (foco, jerarquía, feedback).
2. **El cursor es un personaje.** Flecha cómic + estrella al click; estados por
   zona (magnético en botones, estela en la zona 3D).
3. **Fluidez sobre espectáculo.** 60fps y respeto por `prefers-reduced-motion`
   antes que cualquier efecto.
4. **Sonido opcional y apagado por defecto.** Si se agrega micro-sound design,
   es opt-in con toggle visible.
5. **Todo navegable por teclado.** El "modo juego" no rompe la accesibilidad:
   command palette (⌘K), focus visible, tab order correcto.
6. **Las transiciones de página son narrativa.** Cambiar de sección se siente
   como pasar de página en un manga (View Transitions nativas de Next 16), no
   como recargar. Continuidad, no cortes secos.

## 9. Referencias / moodboard (dirección, no copia)

- Splash pages y paneles de manga (composición, contraste, líneas de velocidad).
- Portfolios "modo juego" con 3D sutil (R3F / Codrops) — energía sin saturar.
- Command palettes de producto (Vercel, Linear, Raycast) para la sensación pro.
- Roadmaps visuales / skill trees de videojuegos para el canvas de aprendizaje.

## 10. Elementos visuales heredados de v1 (obligatorios, no opcionales)

**Contexto (2026-07-15)**: el usuario marcó explícitamente que, a mitad de la
Fase 1, la v2 "no se parece en nada" al diseño original — con razón: la Fase
1 solo entrega el esqueleto de navegación (header/nav/footer), no el pulido
visual. Para que esto no se pierda de vista en fases futuras (ni en sesiones
futuras), esta sección fija en concreto qué técnicas visuales de v1 **tienen
que** portarse (evolucionadas, no calcadas 1:1) a v2. Fuente real:
`portfolio-preview/src/App.jsx` (único archivo, ~3500 líneas, estilos en un
`GLOBAL_CSS` inyectado en runtime + inline styles).

| Elemento de v1 | Técnica concreta | Dónde va en v2 |
|---|---|---|
| Bordes gruesos de tinta | `3px solid` en tarjetas/botones/paneles (`.ink-stroke`, `.panel-3d`, `.btn-manga`) | Tokens de borde en Tailwind, reutilizados en todo componente "panel" |
| Sombras "3D" de panel cómic | Offset duro `4px 4px 0 ink, 8px 8px 0 rgba(cyan,.35)`, que se acentúa en hover | Clase utilitaria reusable (`shadow-comic` o similar) para cards/botones |
| Halftone (tramado de puntos) | `radial-gradient` en grid + SVG `<pattern>` de puntos en thumbnails | Fondos de sección y thumbnails de proyecto (Fase 3) |
| Speed lines / speed burst | SVG de líneas radiales/paralelas detrás del hero y en hover de cards | Detrás del logo 3D del header y en el hero (Fase 2-3) |
| Tipografía outline gigante | `-webkit-text-stroke` 4-5px en headlines de hero/splash, `clamp()` para tamaño responsivo | Hero real de Home (Fase 3) — el placeholder actual de la Fase 1 NO es el diseño final |
| Cursor cómic personalizado | Reemplaza el cursor nativo, con squash/rebote animado al click | Tarea de Fase 1 ya en curso (ver abajo) |
| Números de capítulo | Numerales gigantes en Bangers con stroke + text-shadow offset ("01 ALPHA") | Tarjetas de proyecto (Fase 3) |
| Ticker/marquee | Texto scrolleando infinito con taglines estilo manga | Debajo del hero (Fase 3) |
| Orbes de skill | Anillo de progreso SVG animado + tooltip tipo panel cómic | Skills filtrables (Fase 4) |
| Placas de título de sección | Badge tipo panel, rotado -1.5deg, por sección | Cada sección de Home (Fase 3) |
| Grid asimétrico/masonry | CSS columns con tarjetas de tamaños variados (`lg`/`md`/`sm`), leve rotación en hover | Grid de proyectos (Fase 3) |
| Spotlight de cursor + parallax | Radial-gradient que sigue el cursor vía custom properties en rAF | Hero y fondo 3D "modo juego" (Fase 2-3) |

**Regla**: cuando se construya la Fase 2 (fondo 3D) y la Fase 3 (Home +
Proyectos), estos elementos son el punto de partida — se evolucionan con las
nuevas capacidades (R3F real en vez del SVG "3D" simulado de v1, Power Level
en vez de solo orbes de skill sueltos), pero **ninguno se abandona sin
decisión explícita del usuario**. El header/nav/footer de la Fase 1 es
intencionalmente minimalista (plumbing, no diseño final) — no es una señal de
que se perdió la dirección visual.

## 11. Qué NO hacer

- Nada de 3D o animación que tape el contenido o baje el Lighthouse por debajo
  del objetivo.
- Nada de autoplay de sonido.
- Nada de efectos que no funcionen (o degraden con gracia) en móvil y con
  `prefers-reduced-motion`.
- Nada de texto en imágenes (SEO + i18n + accesibilidad).

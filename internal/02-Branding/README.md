# Branding — YHOSINC

## 1. Quién ve esto y para qué
Portfolio público. El visitante llega sin contexto previo y tiene que entender en segundos **qué tipo de trabajo hace Yhoset** y poder ir directo a lo que le interesa. Mezcla dos mundos que normalmente no comparten portfolio:
- **Creativo**: diseño gráfico, animación, dibujo/ilustración.
- **Técnico**: proyectos de desarrollo (código, producto).

El riesgo de branding acá no es estético, es de **claridad**: si todo se ve igual, un reclutador de diseño no distingue el trabajo de animación del de desarrollo, y viceversa. La marca tiene que resolver eso antes que verse bonita.

## 2. Principio rector: intuitivo antes que espectacular
El estilo visual actual (manga/cómic — ver sección 4) ya es llamativo. La regla para todo lo que se agregue de acá en adelante:
- **Categoría visible siempre, sin tener que leer el blurb.** Cada proyecto debe poder identificarse por tipo (diseño / animación / ilustración / técnico) de un vistazo — color, ícono o etiqueta, no solo texto.
- **Máximo 2-3 clics para llegar a cualquier proyecto.** Nada de scroll infinito sin filtro cuando haya más de ~10-12 proyectos.
- **El código no compite visualmente con el arte.** Los proyectos técnicos se presentan con la misma calidad de curaduría que los creativos — no como una sección "aparte y más aburrida".
- **Contacto siempre a un clic**, sin importar en qué sección esté el visitante (ya cumplido: nav sticky + botón "HIRE ME").

## 3. Categorías de proyecto (propuesta)
El código actual (`PROJECTS`, `CATEGORY_COLORS` en `app.jsx`) usa categorías genéricas de portfolio tech (`WEB`, `DESIGN`, `DEV`, `RESEARCH`) con proyectos de ejemplo ficticios. Para reflejar el trabajo real descrito, propongo remapear a:

| Categoría | Color (ya definido en `THEME`) | Contenido |
|---|---|---|
| **DISEÑO GRÁFICO** | `yellow` (#FFE000) | Branding, identidad visual, composición |
| **ANIMACIÓN** | `red` (#FF2D55) | Motion, reels, animación 2D/frame-by-frame |
| **ILUSTRACIÓN** | `cyan` (#00F5FF) | Dibujo, arte conceptual, character design |
| **TÉCNICO** | `white` | Desarrollo, herramientas, proyectos de producto/código |

> Nota — verificado en [app.jsx](../../portfolio-preview/app.jsx): hoy los 6 proyectos cargados son placeholders (e-commerce, identidad de marca ficticia, motor edge, research fintech, tipografía cinética, canvas colaborativo). Van a necesitar reemplazarse por proyectos reales antes de publicar — lo dejo anotado acá, no es un bug, es contenido pendiente de reemplazo (Fase 6 de [03-Planning](../03-Planning/README.md)).

## 4. Identidad visual (ya implementada, documentada acá como referencia)
**Estilo**: manga/cómic — paneles con borde grueso, sombras duras ("3D" tipo cómic), halftone, speed lines, tipografía con stroke.

**Paleta** (`THEME` en `app.jsx`):
| Token | Valor | Uso |
|---|---|---|
| `ink` | `#0A0A0F` | Fondo base, contornos |
| `cyan` | `#00F5FF` | Acento primario |
| `yellow` | `#FFE000` | Acento secundario |
| `red` | `#FF2D55` | Acento de alerta/energía |
| `white` | `#FFFFFF` | Texto sobre fondo oscuro |

**Tipografía**:
| Fuente | Uso |
|---|---|
| Bangers | Títulos hero, splash, números de capítulo |
| Bebas Neue | Subtítulos, botones, nav |
| Rajdhani | Cuerpo de texto |
| Courier New (mono) | Tags, metadatos |

**Motivo narrativo**: el portfolio se presenta como "capítulos" de un cómic (CH. 01, CAPÍTULO 02...) — encaja bien con animación/ilustración, hay que revisar que no se sienta forzado en los proyectos técnicos (ej. "FORGE ENGINE" ya lo hace bien: usa la estética pero el contenido es 100% técnico).

## 5. Tono de voz
- Directo, con energía, sin jerga corporativa ("SHIPPED · TESTED · SIN VUELTA ATRÁS" en vez de "delivered with quality assurance").
- Confianza sin arrogancia — el trabajo habla, no hace falta exagerar.
- Mismo tono para proyectos creativos y técnicos — no bajar el registro al hablar de código ni subirlo artificialmente al hablar de arte.

## 6. Pendiente / a definir con el usuario
- [ ] Confirmar las 4 categorías propuestas (sección 3) o ajustarlas.
- [ ] Definir si se necesita un filtro por categoría en la UI cuando crezca la cantidad de proyectos (ver Fase 6 de [03-Planning](../03-Planning/README.md)).
- [ ] Reemplazar proyectos placeholder por trabajo real (logos, animaciones, dibujos, proyectos técnicos reales) — logística de assets (imágenes/video) todavía no discutida, hoy todo es SVG generado inline.

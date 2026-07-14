import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import {
  Code2,
  Palette,
  Cpu,
  Search,
  Film,
  Sparkles,
  Github,
  Mail,
  Linkedin,
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  Zap,
  Figma,
  Box,
  Rocket,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   THEME — YHOSINC brand tokens
   ═══════════════════════════════════════════════════════════════ */
const THEME = {
  ink: "#0A0A0F",
  cyan: "#00F5FF",
  yellow: "#FFE000",
  red: "#FF2D55",
  white: "#FFFFFF",
  panelBg: "#111118",
  panelBgAlt: "#16161F",
};

/* Backend API — Render (producción) */
const API_BASE_URL = "https://yhosinc-portfolio.onrender.com";
const CONTACT_EMAIL_DISPLAY = "yhosinc@gmail.com";

/* ═══════════════════════════════════════════════════════════════
   DATA — Projects, Skills, Nav
   ═══════════════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { key: "work", href: "#projects" },
  { key: "skills", href: "#skills" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
];

const PROJECTS = [
  {
    chapter: "01",
    code: "ALPHA",
    slug: "neon-commerce",
    title: "NEON COMMERCE",
    tagline: "Web app · E-commerce reimagined",
    category: "WEB",
    color: THEME.cyan,
    blurb:
      "A brutalist storefront engine pushing 120fps WebGL product viewers. Shipped with a custom design system and an event-driven checkout that reduced cart abandonment by 34%.",
    size: "lg",
    tags: ["React", "WebGL", "Node"],
  },
  {
    chapter: "02",
    code: "BETA",
    slug: "ronin-identity",
    title: "RONIN IDENTITY",
    tagline: "Branding · Visual system",
    category: "DESIGN",
    color: THEME.yellow,
    blurb:
      "Complete brand rebuild for a Tokyo-based cybersecurity studio. Logomark, motion principles, and a 60-page manga-coded brand bible.",
    size: "md",
    tags: ["Identity", "Type"],
  },
  {
    chapter: "03",
    code: "GAMMA",
    slug: "forge-engine",
    title: "FORGE ENGINE",
    tagline: "Dev · Real-time infrastructure",
    category: "DEV",
    color: THEME.red,
    blurb:
      "Edge compute platform handling 2M concurrent sockets. Rust core, TypeScript SDK, observable by default.",
    size: "md",
    tags: ["Rust", "Edge", "WS"],
  },
  {
    chapter: "04",
    code: "DELTA",
    slug: "cognitive-maps",
    title: "COGNITIVE MAPS",
    tagline: "Research · UX strategy",
    category: "RESEARCH",
    color: THEME.white,
    blurb:
      "12-week ethnographic study mapping decision fatigue in fintech onboarding. Findings restructured a product line for a Series C startup.",
    size: "sm",
    tags: ["Research", "Fintech"],
  },
  {
    chapter: "05",
    code: "EPSILON",
    slug: "kinetic-type",
    title: "KINETIC TYPE",
    tagline: "Motion · Animation reel",
    category: "DESIGN",
    color: THEME.yellow,
    blurb:
      "Experimental typography set animated frame-by-frame. Featured in Motionographer and used in 3 ad campaigns.",
    size: "sm",
    tags: ["Motion", "After Effects"],
  },
  {
    chapter: "06",
    code: "ZETA",
    slug: "supernova-os",
    title: "SUPERNOVA OS",
    tagline: "Hero piece · Full-stack product",
    category: "WEB",
    color: THEME.cyan,
    blurb:
      "A collaborative canvas tool built from the first pixel to the last migration. 18 months. 40k weekly active. Acquired in 2025.",
    size: "lg",
    tags: ["Product", "Canvas", "CRDT"],
  },
];

const SKILLS = [
  { name: "FRONTEND", level: 95, Icon: Code2, color: THEME.cyan },
  { name: "DESIGN SYS", level: 92, Icon: Palette, color: THEME.yellow },
  { name: "MOTION", level: 85, Icon: Film, color: THEME.red },
  { name: "3D / WEBGL", level: 78, Icon: Box, color: THEME.cyan },
  { name: "BACKEND", level: 82, Icon: Cpu, color: THEME.yellow },
  { name: "RESEARCH", level: 74, Icon: Search, color: THEME.white },
  { name: "PROTOTYPING", level: 90, Icon: Figma, color: THEME.red },
  { name: "SHIPPING", level: 99, Icon: Rocket, color: THEME.cyan },
];

const CATEGORY_COLORS = {
  WEB: THEME.cyan,
  DESIGN: THEME.yellow,
  DEV: THEME.red,
  RESEARCH: THEME.white,
};

/* ═══════════════════════════════════════════════════════════════
   I18N — diccionario EN/ES + contexto de idioma
   ═══════════════════════════════════════════════════════════════ */
const CATEGORY_LABELS = {
  en: { WEB: "WEB", DESIGN: "DESIGN", DEV: "DEV", RESEARCH: "RESEARCH" },
  es: { WEB: "WEB", DESIGN: "DISEÑO", DEV: "DEV", RESEARCH: "INVESTIGACIÓN" },
};

const PROJECT_I18N = {
  "neon-commerce": {
    en: { title: "NEON COMMERCE", tagline: "Web app · E-commerce reimagined", blurb: "A brutalist storefront engine pushing 120fps WebGL product viewers. Shipped with a custom design system and an event-driven checkout that reduced cart abandonment by 34%.", tags: ["React", "WebGL", "Node"] },
    es: { title: "COMERCIO NEÓN", tagline: "Web app · E-commerce reinventado", blurb: "Un motor de tienda brutalista que mueve visores de producto en WebGL a 120fps. Se entregó con un design system propio y un checkout basado en eventos que redujo el abandono de carrito un 34%.", tags: ["React", "WebGL", "Node"] },
  },
  "ronin-identity": {
    en: { title: "RONIN IDENTITY", tagline: "Branding · Visual system", blurb: "Complete brand rebuild for a Tokyo-based cybersecurity studio. Logomark, motion principles, and a 60-page manga-coded brand bible.", tags: ["Identity", "Type"] },
    es: { title: "IDENTIDAD RONIN", tagline: "Branding · Sistema visual", blurb: "Rediseño completo de marca para un estudio de ciberseguridad en Tokio. Isotipo, principios de motion y una guía de marca de 60 páginas con estética manga.", tags: ["Identidad", "Tipografía"] },
  },
  "forge-engine": {
    en: { title: "FORGE ENGINE", tagline: "Dev · Real-time infrastructure", blurb: "Edge compute platform handling 2M concurrent sockets. Rust core, TypeScript SDK, observable by default.", tags: ["Rust", "Edge", "WS"] },
    es: { title: "MOTOR FORJA", tagline: "Dev · Infraestructura en tiempo real", blurb: "Plataforma de edge computing que maneja 2M de sockets concurrentes. Núcleo en Rust, SDK en TypeScript, observable por defecto.", tags: ["Rust", "Edge", "WS"] },
  },
  "cognitive-maps": {
    en: { title: "COGNITIVE MAPS", tagline: "Research · UX strategy", blurb: "12-week ethnographic study mapping decision fatigue in fintech onboarding. Findings restructured a product line for a Series C startup.", tags: ["Research", "Fintech"] },
    es: { title: "MAPAS COGNITIVOS", tagline: "Investigación · Estrategia UX", blurb: "Estudio etnográfico de 12 semanas mapeando la fatiga de decisión en el onboarding de una fintech. Los hallazgos reestructuraron una línea de producto para una startup Serie C.", tags: ["Investigación", "Fintech"] },
  },
  "kinetic-type": {
    en: { title: "KINETIC TYPE", tagline: "Motion · Animation reel", blurb: "Experimental typography set animated frame-by-frame. Featured in Motionographer and used in 3 ad campaigns.", tags: ["Motion", "After Effects"] },
    es: { title: "TIPOGRAFÍA CINÉTICA", tagline: "Motion · Reel de animación", blurb: "Set tipográfico experimental animado cuadro por cuadro. Publicado en Motionographer y usado en 3 campañas publicitarias.", tags: ["Animación", "After Effects"] },
  },
  "supernova-os": {
    en: { title: "SUPERNOVA OS", tagline: "Hero piece · Full-stack product", blurb: "A collaborative canvas tool built from the first pixel to the last migration. 18 months. 40k weekly active. Acquired in 2025.", tags: ["Product", "Canvas", "CRDT"] },
    es: { title: "SO SUPERNOVA", tagline: "Pieza insignia · Producto full-stack", blurb: "Una herramienta de canvas colaborativo construida desde el primer pixel hasta la última migración. 18 meses. 40k usuarios activos semanales. Adquirida en 2025.", tags: ["Producto", "Lienzo", "CRDT"] },
  },
};

const SKILL_LABELS = {
  en: { FRONTEND: "FRONTEND", "DESIGN SYS": "DESIGN SYS", MOTION: "MOTION", "3D / WEBGL": "3D / WEBGL", BACKEND: "BACKEND", RESEARCH: "RESEARCH", PROTOTYPING: "PROTOTYPING", SHIPPING: "SHIPPING" },
  es: { FRONTEND: "FRONTEND", "DESIGN SYS": "DESIGN SYS", MOTION: "MOTION", "3D / WEBGL": "3D / WEBGL", BACKEND: "BACKEND", RESEARCH: "INVESTIGACIÓN", PROTOTYPING: "PROTOTIPADO", SHIPPING: "ENTREGAS" },
};

const TRANSLATIONS = {
  en: {
    nav: { work: "WORK", skills: "SKILLS", about: "ABOUT", contact: "CONTACT", hireMe: "HIRE ME", openMenu: "Open menu", closeMenu: "Close menu", home: "YHOSINC home" },
    hero: {
      badge: "CH. 01 — PORTFOLIO ONLINE",
      subtitlePrefix: "Frontend architect & creative director. ",
      subtitleShipping: "Shipping",
      subtitleMid: " interfaces with ",
      subtitleInk: "ink & code",
      subtitleEnd: ".",
      body: "I design systems that feel like the splash page of a manga — loud where it matters, precise where it counts. Six years turning product chaos into shipping velocity.",
      seeWork: "SEE THE WORK",
      getInTouch: "GET IN TOUCH",
      statProjects: "SHIPPED PROJECTS",
      statYears: "IN THE FIELD",
      statCoffee: "COFFEE LEVEL",
      scroll: "SCROLL",
      scrollAria: "Scroll to projects",
      codeInk: "CODE + INK",
    },
    ticker: ["BUILDING IN PUBLIC", "INK & CODE", "SHIPPING VELOCITY", "DESIGN × ENGINEERING", "YHOSINC 2026"],
    projects: {
      eyebrow: "// 02 — SELECTED WORK",
      title: "THE WORK",
      intro: "Six chapters. Six disciplines. Every panel shipped, stress-tested, and kept alive in production.",
      chapter: "CHAPTER",
      viewProject: "VIEW PROJECT",
      viewProjectAria: "View project",
      backToAllWork: "← BACK TO ALL WORK",
      letsTalk: "LET'S TALK",
      notFoundTitle: "This chapter doesn't exist.",
      backToPortfolio: "BACK TO PORTFOLIO",
    },
    skills: { eyebrow: "// 03 — POWER LEVELS", title: "STACK & SKILLS" },
    about: {
      eyebrow: "// 04 — CHARACTER PROFILE",
      title: "ABOUT THE PROTAGONIST",
      handle: "@yhosinc_studio",
      class_: "CLASS",
      classVal: "Frontend Architect",
      specialty: "SPECIALTY",
      specialtyVal: "Motion × Systems",
      level: "LEVEL",
      xp: "XP",
      xpVal: "72,450 PTS",
      base: "BASE",
      baseVal: "Remote / EU+LATAM",
      weapon: "WEAPON",
      weaponVal: "React + Ink",
      status: "STATUS",
      statusVal: "AVAILABLE",
      originStory: "// ORIGIN STORY",
      storyTitle1: "I BUILD INTERFACES",
      storyTitle2: "LIKE ",
      storyTitle2Highlight: "MANGA PANELS",
      storyTitle3: ".",
      story1: "Started shipping websites in my teens. Spent the last six years in product teams that cared equally about frame-perfect animation and Lighthouse scores. I write the CSS, draw the wireframes, and argue with backend engineers about state shape.",
      story2Prefix: "",
      story2Studio: "YHOSINC",
      story2Mid: " is a solo studio built on two beliefs: that interfaces are ",
      story2Compositions: "compositions",
      story2End: ", and that every product deserves a loud, confident first frame.",
      tag1: "DESIGN SYSTEMS",
      tag2: "MOTION-FIRST",
      tag3: "PRODUCT THINKING",
    },
    contact: {
      eyebrow: "// 05 — SPLASH PAGE",
      title1: "LET'S",
      title2: "SHIP",
      title3: "SOMETHING",
      subtitle: "Briefs, collaborations, wild ideas — the inbox is open.",
      newMessage: "NEW MESSAGE",
      close: "Close",
      to: "To:",
      yourName: "YOUR NAME",
      namePlaceholder: "What's your name",
      yourEmail: "YOUR EMAIL",
      emailPlaceholder: "you@email.com",
      message: "MESSAGE",
      messagePlaceholder: "Tell me about your idea, project, or question...",
      sending: "SENDING...",
      send: "SEND",
      messageSent: "MESSAGE SENT!",
      thanks: "Thanks for reaching out — I'll get back to you at your email.",
      closeBtn: "CLOSE",
      errName: "Please enter your name.",
      errEmail: "Please enter a valid email.",
      errMessage: "Please enter a message.",
      errGeneric: "Couldn't send the message.",
      leavingTo: "YOU'RE LEAVING TO",
      leavingBody: "This link opens an external site in a new tab.",
      cancel: "CANCEL",
      continue_: "CONTINUE",
    },
    footer: { rights: "© 2026 YHOSINC · BUILT WITH", tagline: "INK & CODE" },
  },
  es: {
    nav: { work: "TRABAJO", skills: "SKILLS", about: "SOBRE MÍ", contact: "CONTACTO", hireMe: "CONTRATAME", openMenu: "Abrir menú", closeMenu: "Cerrar menú", home: "Inicio YHOSINC" },
    hero: {
      badge: "CAP. 01 — PORTFOLIO EN LÍNEA",
      subtitlePrefix: "Arquitecto frontend y director creativo. ",
      subtitleShipping: "Entregando",
      subtitleMid: " interfaces con ",
      subtitleInk: "tinta y código",
      subtitleEnd: ".",
      body: "Diseño sistemas que se sienten como la portada de un manga: fuertes donde importa, precisos donde cuenta. Seis años convirtiendo el caos de producto en velocidad de entrega.",
      seeWork: "VER EL TRABAJO",
      getInTouch: "ESCRIBIME",
      statProjects: "PROYECTOS ENTREGADOS",
      statYears: "AÑOS EN EL RUBRO",
      statCoffee: "NIVEL DE CAFÉ",
      scroll: "SCROLL",
      scrollAria: "Ir a proyectos",
      codeInk: "TINTA + CÓDIGO",
    },
    ticker: ["CONSTRUYENDO EN PÚBLICO", "TINTA Y CÓDIGO", "VELOCIDAD DE ENTREGA", "DISEÑO × INGENIERÍA", "YHOSINC 2026"],
    projects: {
      eyebrow: "// 02 — TRABAJOS SELECCIONADOS",
      title: "EL TRABAJO",
      intro: "Seis capítulos. Seis disciplinas. Cada panel entregado, probado a fondo, y vivo en producción.",
      chapter: "CAPÍTULO",
      viewProject: "VER PROYECTO",
      viewProjectAria: "Ver proyecto",
      backToAllWork: "← VOLVER A TODO EL TRABAJO",
      letsTalk: "HABLEMOS",
      notFoundTitle: "Este capítulo no existe.",
      backToPortfolio: "VOLVER AL PORTFOLIO",
    },
    skills: { eyebrow: "// 03 — NIVELES DE PODER", title: "STACK Y HABILIDADES" },
    about: {
      eyebrow: "// 04 — PERFIL DEL PROTAGONISTA",
      title: "SOBRE EL PROTAGONISTA",
      handle: "@yhosinc_studio",
      class_: "CLASE",
      classVal: "Arquitecto Frontend",
      specialty: "ESPECIALIDAD",
      specialtyVal: "Motion × Sistemas",
      level: "NIVEL",
      xp: "XP",
      xpVal: "72.450 PTS",
      base: "BASE",
      baseVal: "Remoto / EU+LATAM",
      weapon: "ARMA",
      weaponVal: "React + Tinta",
      status: "ESTADO",
      statusVal: "DISPONIBLE",
      originStory: "// HISTORIA DE ORIGEN",
      storyTitle1: "CONSTRUYO INTERFACES",
      storyTitle2: "COMO ",
      storyTitle2Highlight: "PÁGINAS DE MANGA",
      storyTitle3: ".",
      story1: "Empecé a lanzar sitios web en la adolescencia. Pasé los últimos seis años en equipos de producto donde importaba tanto la animación cuadro perfecto como el puntaje de Lighthouse. Escribo el CSS, dibujo los wireframes, y discuto con los de backend sobre la forma del estado.",
      story2Prefix: "",
      story2Studio: "YHOSINC",
      story2Mid: " es un estudio unipersonal construido sobre dos convicciones: que las interfaces son ",
      story2Compositions: "composiciones",
      story2End: ", y que todo producto merece un primer cuadro fuerte y seguro de sí mismo.",
      tag1: "DESIGN SYSTEMS",
      tag2: "MOTION-FIRST",
      tag3: "PENSAMIENTO DE PRODUCTO",
    },
    contact: {
      eyebrow: "// 05 — PÁGINA FINAL",
      title1: "HAGAMOS",
      title2: "ENVÍOS",
      title3: "DE VERDAD",
      subtitle: "Propuestas, colaboraciones, ideas locas — la bandeja está abierta.",
      newMessage: "MENSAJE NUEVO",
      close: "Cerrar",
      to: "Para:",
      yourName: "TU NOMBRE",
      namePlaceholder: "¿Cómo te llamás?",
      yourEmail: "TU EMAIL",
      emailPlaceholder: "vos@email.com",
      message: "MENSAJE",
      messagePlaceholder: "Contame tu idea, proyecto, o pregunta...",
      sending: "ENVIANDO...",
      send: "ENVIAR",
      messageSent: "¡MENSAJE ENVIADO!",
      thanks: "Gracias por escribir — te voy a responder a tu email.",
      closeBtn: "CERRAR",
      errName: "Ingresá tu nombre.",
      errEmail: "Ingresá un email válido.",
      errMessage: "Ingresá un mensaje.",
      errGeneric: "No se pudo enviar el mensaje.",
      leavingTo: "ESTÁS SALIENDO A",
      leavingBody: "Este link abre un sitio externo en una pestaña nueva.",
      cancel: "CANCELAR",
      continue_: "CONTINUAR",
    },
    footer: { rights: "© 2026 YHOSINC · HECHO CON", tagline: "TINTA Y CÓDIGO" },
  },
};

const LanguageContext = React.createContext({ lang: "en", setLang: () => {}, t: TRANSLATIONS.en });

function useLanguage() {
  return React.useContext(LanguageContext);
}

function detectInitialLanguage() {
  try {
    const saved = window.localStorage.getItem("yhosinc_lang");
    if (saved === "en" || saved === "es") return saved;
  } catch {
    // localStorage puede fallar en modo privado — seguimos con detección normal
  }
  return navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLanguage);

  const setLang = (next) => {
    setLangState(next);
    try {
      window.localStorage.setItem("yhosinc_lang", next);
    } catch {
      // sin persistencia si localStorage no está disponible — no rompe la función
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS — fonts, variables, keyframes, base classes
   ═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
:root{
  --ink: ${THEME.ink};
  --cyan: ${THEME.cyan};
  --yellow: ${THEME.yellow};
  --red: ${THEME.red};
  --white: ${THEME.white};
  --panel-bg: ${THEME.panelBg};
  --panel-bg-alt: ${THEME.panelBgAlt};
  --stroke: 3px solid ${THEME.ink};
  --shadow-3d: 4px 4px 0px ${THEME.ink}, 8px 8px 0px rgba(0,245,255,0.35);
  --shadow-3d-yellow: 4px 4px 0px ${THEME.ink}, 8px 8px 0px rgba(255,224,0,0.35);
  --shadow-3d-red: 4px 4px 0px ${THEME.ink}, 8px 8px 0px rgba(255,45,85,0.35);
  --radius-cartoon: 12px;
  --font-display: 'Bangers', cursive;
  --font-title: 'Bebas Neue', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'Courier New', monospace;
}

*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{
  background: var(--ink);
  color: var(--white);
  font-family: var(--font-body);
  overflow-x: hidden;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}

*::selection{ background: var(--cyan); color: var(--ink); }

/* Focus styles */
button:focus-visible, a:focus-visible{
  outline: 3px solid var(--cyan);
  outline-offset: 3px;
}

/* ——— PAGE LOAD KEYFRAMES ——— */
@keyframes logoGlitch {
  0%   { text-shadow: 0 0 0 var(--cyan), 0 0 0 var(--red); transform: translate(0,0); }
  20%  { text-shadow: -4px 2px 0 var(--cyan), 4px -2px 0 var(--red); transform: translate(1px,-1px); }
  40%  { text-shadow: 4px -2px 0 var(--cyan), -4px 2px 0 var(--red); transform: translate(-1px,1px); }
  60%  { text-shadow: -2px 0 0 var(--yellow), 2px 0 0 var(--red); transform: translate(0,0); }
  100% { text-shadow: 2px 2px 0 var(--cyan), -2px -2px 0 var(--red); transform: translate(0,0); }
}

@keyframes glitchLoop {
  0%, 90%, 100% { text-shadow: 2px 2px 0 var(--cyan), -2px -2px 0 var(--red); }
  92% { text-shadow: -4px 2px 0 var(--cyan), 4px -2px 0 var(--red), 0 0 8px var(--yellow); }
  94% { text-shadow: 4px -2px 0 var(--cyan), -4px 2px 0 var(--red); }
  96% { text-shadow: 2px 2px 0 var(--cyan), -2px -2px 0 var(--red); }
}

@keyframes fallIn {
  0%   { transform: translateY(-40px); opacity:0; }
  100% { transform: translateY(0); opacity:1; }
}

@keyframes sweepIn {
  0%   { transform: translateX(-80px) skewX(-8deg); opacity:0; filter: blur(6px); }
  100% { transform: translateX(0) skewX(0); opacity:1; filter: blur(0); }
}

@keyframes popIn {
  0%   { transform: scale(0) rotate(-25deg); opacity:0; }
  60%  { transform: scale(1.1) rotate(6deg); }
  100% { transform: scale(1) rotate(0); opacity:1; }
}

@keyframes cascadeIn {
  0%   { transform: translateY(40px) rotate(-2deg); opacity:0; }
  100% { transform: translateY(0) rotate(0); opacity:1; }
}

/* ——— CONTINUOUS LOOPS ——— */
@keyframes float {
  0%,100% { transform: translateY(-10px); }
  50%     { transform: translateY(0px); }
}

@keyframes floatLg {
  0%,100% { transform: translateY(-16px) rotate(-1deg); }
  50%     { transform: translateY(8px) rotate(1deg); }
}

@keyframes pulseGlow {
  0%,100% { box-shadow: 0 0 0 0 rgba(0,245,255,0.6), 0 0 0 0 rgba(255,224,0,0.4); }
  50%     { box-shadow: 0 0 0 18px rgba(0,245,255,0), 0 0 0 32px rgba(255,224,0,0); }
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes spinReverse {
  from { transform: rotate(360deg); }
  to   { transform: rotate(0deg); }
}

@keyframes fillArc {
  from { stroke-dashoffset: 283; }
}

@keyframes bounceArrow {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(14px); }
}

@keyframes speedDash {
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -40; }
}

@keyframes explode {
  0%   { transform: scale(0.9); opacity:1; }
  100% { transform: scale(2.4); opacity:0; }
}

@keyframes tickerScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ——— PAGE LOAD CLASS CHAINS ——— */
.load-logo     { animation: logoGlitch 700ms ease-out both, glitchLoop 6s infinite 1s; }
.load-nav > *  { opacity:0; animation: fallIn 500ms ease-out 200ms forwards; }
.load-nav > *:nth-child(2){ animation-delay: 260ms; }
.load-nav > *:nth-child(3){ animation-delay: 320ms; }
.load-nav > *:nth-child(4){ animation-delay: 380ms; }
.load-nav > *:nth-child(5){ animation-delay: 440ms; }
.load-hero-text { opacity:0; animation: sweepIn 700ms cubic-bezier(.22,.9,.26,1) 400ms forwards; }
.load-hero-vis  { opacity:0; animation: popIn 800ms cubic-bezier(.34,1.56,.64,1) 600ms forwards; }
.load-card      { opacity:0; animation: cascadeIn 600ms ease-out forwards; }

/* ——— COMPONENT STYLING ——— */
.ink-stroke{
  border: var(--stroke);
  border-radius: var(--radius-cartoon);
}
.panel-3d{
  border: var(--stroke);
  background: var(--panel-bg);
  box-shadow: var(--shadow-3d);
  border-radius: var(--radius-cartoon);
  position: relative;
}
.panel-3d-yellow{ box-shadow: var(--shadow-3d-yellow); }
.panel-3d-red{ box-shadow: var(--shadow-3d-red); }

.btn-manga{
  font-family: var(--font-title);
  letter-spacing: 0.08em;
  font-size: 1.05rem;
  padding: 0.85rem 1.6rem;
  border: var(--stroke);
  border-radius: var(--radius-cartoon);
  background: var(--white);
  color: var(--ink);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, background 180ms;
  box-shadow: var(--shadow-3d);
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-manga:hover{ transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--ink), 10px 10px 0 rgba(0,245,255,0.45); }
.btn-manga:active{ transform: translate(3px,3px); box-shadow: 1px 1px 0 var(--ink), 2px 2px 0 rgba(0,245,255,0.3); }
.btn-manga.red{ background: var(--red); color: var(--white); }
.btn-manga.cyan{ background: var(--cyan); color: var(--ink); }
.btn-manga.yellow{ background: var(--yellow); color: var(--ink); }

.pill-nav{
  font-family: var(--font-title);
  letter-spacing: 0.12em;
  padding: 0.4rem 1.1rem;
  border: 2.5px solid var(--ink);
  border-radius: 999px;
  background: var(--white);
  color: var(--ink);
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 180ms;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;
}
.pill-nav:hover{
  background: var(--cyan);
  transform: translateY(-2px);
  box-shadow: 3px 3px 0 var(--ink);
}
.pill-nav .speed-hover{
  position:absolute; inset:0; opacity:0; pointer-events:none;
  transition: opacity 150ms;
}
.pill-nav:hover .speed-hover{ opacity: 1; }

/* Project cards */
.project-card{
  border: var(--stroke);
  background: var(--panel-bg);
  border-radius: 14px 4px 14px 4px;
  box-shadow: 4px 4px 0 var(--ink), 8px 8px 0 rgba(0,245,255,0.25);
  break-inside: avoid;
  margin-bottom: 1.5rem;
  overflow: hidden;
  position: relative;
  transition: transform 220ms ease, box-shadow 220ms ease;
  cursor: pointer;
}
.project-card::after{
  content:"";
  position:absolute; inset:-2px;
  background-image: linear-gradient(120deg, transparent 40%, rgba(0,245,255,0.18) 45%, transparent 52%);
  background-size: 200% 200%;
  background-position: 200% 0;
  pointer-events:none;
  transition: background-position 500ms;
  border-radius: inherit;
  mix-blend-mode: screen;
}
.project-card:hover{
  transform: translateY(-8px) rotate(-0.4deg);
  box-shadow: 8px 10px 0 var(--ink), 14px 16px 0 rgba(0,245,255,0.4);
}
.project-card:hover::after{ background-position: -50% 0; }

.project-card .speed-edge{ opacity:0; transition: opacity 220ms; }
.project-card:hover .speed-edge{ opacity:1; }

.project-thumb{
  position: relative;
  height: 180px;
  overflow: hidden;
  border-bottom: var(--stroke);
  display:flex; align-items:center; justify-content:center;
}
.project-thumb.lg{ height: 260px; }
.project-thumb.sm{ height: 140px; }
.project-thumb::before{
  content:"";
  position:absolute; inset:0;
  background: linear-gradient(135deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55));
  pointer-events: none;
}

/* Chapter number — huge manga-style  */
.chapter-num{
  font-family: var(--font-display);
  font-size: 5.2rem;
  line-height: 0.85;
  color: var(--white);
  -webkit-text-stroke: 3px var(--ink);
  text-shadow: 5px 5px 0 var(--ink);
  letter-spacing: 0.04em;
}

/* Tag pills */
.tag-pill{
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: var(--white);
  color: var(--ink);
  letter-spacing: 0.05em;
  white-space: nowrap;
}

/* Skill orbs */
.skill-orb{
  position: relative;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 260ms cubic-bezier(.34,1.56,.64,1);
}
.skill-orb:hover{ transform: scale(1.12) rotate(-2deg); }
.skill-orb:hover .skill-tip{ opacity:1; transform: translate(-50%, -8px); }
.skill-orb svg.ring{ animation: fillArc 1.4s cubic-bezier(.22,.9,.26,1) both; }

.skill-tip{
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  opacity: 0;
  pointer-events:none;
  background: var(--white);
  color: var(--ink);
  border: var(--stroke);
  border-radius: var(--radius-cartoon);
  box-shadow: 3px 3px 0 var(--ink);
  padding: 0.35rem 0.7rem;
  font-family: var(--font-title);
  letter-spacing: 0.08em;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: all 220ms;
  z-index: 5;
}

/* Hero display text with ink stroke */
.hero-title{
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 14vw, 10rem);
  line-height: 0.86;
  letter-spacing: 0.02em;
  color: var(--white);
  -webkit-text-stroke: 4px var(--ink);
  text-shadow:
    6px 6px 0 var(--ink),
    12px 12px 0 var(--cyan),
    18px 18px 0 var(--red);
}

.splash-title{
  font-family: var(--font-display);
  font-size: clamp(4rem, 16vw, 12rem);
  line-height: 0.82;
  letter-spacing: 0.02em;
  color: var(--yellow);
  -webkit-text-stroke: 5px var(--ink);
  text-shadow:
    8px 8px 0 var(--ink),
    16px 16px 0 var(--red);
}

.section-title-panel{
  display: inline-block;
  background: var(--white);
  border: var(--stroke);
  box-shadow: var(--shadow-3d);
  padding: 0.6rem 1.6rem 0.35rem;
  border-radius: var(--radius-cartoon);
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  letter-spacing: 0.03em;
  color: var(--ink);
  transform: rotate(-1.5deg);
}

/* Halftone bg */
.halftone-bg{
  background-color: var(--ink);
  background-image:
    radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1.5px),
    radial-gradient(rgba(0,245,255,0.05) 1px, transparent 1.5px);
  background-size: 18px 18px, 36px 36px;
  background-position: 0 0, 9px 9px;
}

.halftone-panel{
  background-color: var(--panel-bg);
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.5px);
  background-size: 14px 14px;
}

/* Ticker marquee */
.ticker{
  display:flex;
  gap: 2.5rem;
  animation: tickerScroll 38s linear infinite;
  width: max-content;
}
.ticker-item{
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.08em;
  color: var(--ink);
  display:flex;
  align-items:center;
  gap: 2.5rem;
}
.ticker-dot{ width: 14px; height: 14px; background: var(--red); border-radius: 50%; border: 2.5px solid var(--ink); }

/* Character profile card */
.profile-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 0.55rem 0;
  border-bottom: 2px dashed rgba(255,255,255,0.15);
}
.profile-row:last-child{ border-bottom:none; }
.profile-key{ color: rgba(255,255,255,0.6); font-weight: 600; letter-spacing: 0.1em; font-size: 0.82rem; }
.profile-val{ color: var(--white); font-weight: 700; font-family: var(--font-title); letter-spacing: 0.05em; font-size: 1.1rem; }

/* Glitch avatar glow */
.avatar-glow{
  box-shadow:
    0 0 0 3px var(--ink),
    0 0 0 8px var(--white),
    0 0 0 11px var(--ink),
    0 0 40px rgba(0,245,255,0.6);
  animation: pulseGlow 3s infinite ease-in-out;
}

/* Mobile nav sheet */
.mobile-sheet{
  position: fixed; inset: 0;
  background: var(--ink);
  z-index: 80;
  display: flex;
  flex-direction: column;
  padding: 5rem 1.5rem 2rem;
  transform: translateX(100%);
  transition: transform 350ms cubic-bezier(.22,.9,.26,1);
}
.mobile-sheet.open{ transform: translateX(0); }
.mobile-link{
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--white);
  -webkit-text-stroke: 2px var(--ink);
  text-shadow: 4px 4px 0 var(--cyan);
  letter-spacing: 0.04em;
  padding: 1rem 0;
  border-bottom: 2px dashed rgba(255,255,255,0.15);
  text-decoration: none;
  display: block;
}

/* Small helpers */
.mono{ font-family: var(--font-mono); letter-spacing: 0.04em; }
.t-display{ font-family: var(--font-display); letter-spacing: 0.03em; }
.t-title{ font-family: var(--font-title); letter-spacing: 0.08em; }

/* Cursor spotlight — position comes from --mx/--my, written directly to
   the DOM in a rAF loop (see root component) instead of via React state. */
.cursor-spotlight{
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(0,245,255,0.22), transparent 55%);
}

/* Custom comic-arrow cursor — replaces the native cursor site-wide on
   desktop. Position comes from --cx/--cy (raw viewport coords, written in
   the same rAF loop as --mx/--my), so this costs nothing extra to track. */
*, *::before, *::after{ cursor: none !important; }
.custom-cursor{
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}
/* Posición: se mueve con --cx/--cy en su propia capa GPU (will-change),
   así el navegador no tiene que repintar la flecha en el hilo principal en
   cada frame de scroll — evita el tembleque que se veía scrolleando rápido. */
.custom-cursor-pos{
  position: absolute;
  left: 0;
  top: 0;
  transform: translate3d(var(--cx, -100px), var(--cy, -100px), 0);
  will-change: transform;
}
/* Rebote: transform separado del de posición, así el "aplastón" al click
   no compite con el seguimiento del mouse. Un solo tirón elástico al
   soltar (overshoot), coherente con el resto de la estética "cómic". */
.custom-cursor-arrow{
  display: block;
  transform: scale(1) rotate(0deg);
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.custom-cursor-arrow.is-down{
  transform: scale(0.88) rotate(-4deg);
  transition: transform 0.08s cubic-bezier(0.4, 0, 0.2, 1);
}
@media (max-width: 900px), (hover: none){
  *, *::before, *::after{ cursor: auto !important; }
  .custom-cursor{ display: none; }
}

/* Media */
@media (max-width: 1024px){
  .project-grid{ column-count: 2 !important; }
  .hero-grid{ grid-template-columns: 1fr !important; }
  .about-grid{ grid-template-columns: 1fr !important; }
}
@media (max-width: 900px){
  .project-grid{ column-count: 1 !important; }
  .skills-grid{ grid-template-columns: repeat(2, 1fr) !important; }
  .chapter-num{ font-size: 3.8rem; }
  .hero-title{ -webkit-text-stroke: 3px var(--ink); text-shadow: 4px 4px 0 var(--ink), 8px 8px 0 var(--cyan); }
  .splash-title{ -webkit-text-stroke: 3px var(--ink); text-shadow: 4px 4px 0 var(--ink), 8px 8px 0 var(--red); }
  .desktop-only{ display: none !important; }
  .cursor-spotlight{ display: none; } /* no cursor on touch devices */
}
@media (min-width: 901px){
  .mobile-only{ display: none !important; }
}
/* Extra-small phones (≤ 420px): tighten grids and oversized type further */
@media (max-width: 420px){
  .skills-grid{ grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
  .chapter-num{ font-size: 2.8rem; }
  .hero-title{ font-size: clamp(2.6rem, 16vw, 5rem); }
  .splash-title{ font-size: clamp(3rem, 18vw, 6rem); }
}

/* Respect the user's motion preference: disable decorative infinite
   animations for anyone with prefers-reduced-motion enabled. This affects
   spinners, floats, pulses, the ticker and the load-in animations. */
@media (prefers-reduced-motion: reduce){
  *, *::before, *::after{
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .ticker{ animation: none !important; }
}
`;

/* Logo oficial de X (antes Twitter) — Lucide no tiene íconos de marca,
   así que va como SVG propio. Acepta `size` igual que los íconos de
   Lucide para poder usarse de la misma forma en cualquier lugar. */
const XLogo = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   REUSABLE VISUAL ATOMS (inline SVG)
   ═══════════════════════════════════════════════════════════════ */

const HalftonePatternSVG = ({ opacity = 0.12, color = "#FFFFFF" }) => (
  <svg
    aria-hidden
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
  >
    <defs>
      <pattern id="yh-halftone" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.5" fill={color} opacity={opacity} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#yh-halftone)" />
  </svg>
);

const SpeedLines = ({ direction = "right", count = 7, color = THEME.ink, strokeWidth = 3 }) => {
  const lines = [];
  for (let i = 0; i < count; i++) {
    const y = (i + 1) * (100 / (count + 1));
    const len = 20 + ((i * 37) % 30);
    const x1 = direction === "right" ? 0 : 100 - len;
    const x2 = x1 + len;
    lines.push(
      <line
        key={i}
        x1={`${x1}%`}
        y1={`${y}%`}
        x2={`${x2}%`}
        y2={`${y}%`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  }
  return (
    <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 100 100" preserveAspectRatio="none">
      {lines}
    </svg>
  );
};

const SpeedBurst = ({ color = THEME.ink, strokeWidth = 3 }) => {
  const lines = [];
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2;
    const x1 = 50 + Math.cos(angle) * 20;
    const y1 = 50 + Math.sin(angle) * 20;
    const x2 = 50 + Math.cos(angle) * (34 + (i % 3) * 6);
    const y2 = 50 + Math.sin(angle) * (34 + (i % 3) * 6);
    lines.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  }
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }} aria-hidden>
      {lines}
    </svg>
  );
};

/* Low-poly manga character silhouette — abstract but readable */
const LowPolyCharacter = () => (
  <svg viewBox="0 0 400 500" style={{ width: "100%", height: "100%", overflow: "visible" }} aria-hidden>
    <defs>
      <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={THEME.cyan} />
        <stop offset="1" stopColor="#0099AA" />
      </linearGradient>
      <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={THEME.yellow} />
        <stop offset="1" stopColor="#CC9900" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={THEME.red} />
        <stop offset="1" stopColor="#AA0033" />
      </linearGradient>
    </defs>

    {/* Ground shadow */}
    <ellipse cx="200" cy="470" rx="110" ry="14" fill={THEME.ink} opacity="0.55" />

    {/* Back hair / cape polygon */}
    <polygon points="120,130 200,80 280,130 260,260 140,260" fill={THEME.ink} stroke={THEME.ink} strokeWidth="4" strokeLinejoin="round" />
    <polygon points="200,80 280,130 260,200 200,160" fill="#1a1a24" stroke={THEME.ink} strokeWidth="3" strokeLinejoin="round" />

    {/* Head */}
    <polygon points="160,130 200,90 240,130 240,200 200,230 160,200" fill="url(#headGrad)" stroke={THEME.ink} strokeWidth="4" strokeLinejoin="round" />
    <polygon points="200,90 240,130 225,155 200,135" fill={THEME.yellow} stroke={THEME.ink} strokeWidth="3" strokeLinejoin="round" />
    {/* Hair spikes */}
    <polygon points="160,130 145,95 185,115" fill={THEME.ink} stroke={THEME.ink} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="200,90 190,60 225,92" fill={THEME.ink} stroke={THEME.ink} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="240,130 260,100 225,115" fill={THEME.ink} stroke={THEME.ink} strokeWidth="3" strokeLinejoin="round" />

    {/* Eye slits (manga sharp) */}
    <polygon points="175,165 195,160 193,175 175,172" fill={THEME.ink} />
    <polygon points="207,160 227,165 227,172 209,175" fill={THEME.ink} />
    <polygon points="182,166 189,164 188,170 182,171" fill={THEME.cyan} />
    <polygon points="214,164 221,166 221,171 215,170" fill={THEME.cyan} />

    {/* Neck */}
    <polygon points="185,230 215,230 220,260 180,260" fill="url(#headGrad)" stroke={THEME.ink} strokeWidth="4" strokeLinejoin="round" />

    {/* Torso */}
    <polygon points="140,260 260,260 290,400 110,400" fill="url(#bodyGrad)" stroke={THEME.ink} strokeWidth="4" strokeLinejoin="round" />
    <polygon points="200,260 290,400 200,400" fill="#00D8E0" stroke={THEME.ink} strokeWidth="3" strokeLinejoin="round" opacity="0.85" />

    {/* Chest accent — red triangle */}
    <polygon points="180,290 220,290 200,340" fill="url(#accentGrad)" stroke={THEME.ink} strokeWidth="3.5" strokeLinejoin="round" />

    {/* Arms */}
    <polygon points="140,260 100,290 90,370 120,380 140,340" fill="url(#bodyGrad)" stroke={THEME.ink} strokeWidth="4" strokeLinejoin="round" />
    <polygon points="260,260 300,290 310,370 280,380 260,340" fill="url(#bodyGrad)" stroke={THEME.ink} strokeWidth="4" strokeLinejoin="round" />

    {/* Fist (right) — action pose */}
    <polygon points="90,370 70,385 80,410 115,395" fill={THEME.yellow} stroke={THEME.ink} strokeWidth="4" strokeLinejoin="round" />
    <polygon points="310,370 330,385 320,410 285,395" fill={THEME.yellow} stroke={THEME.ink} strokeWidth="4" strokeLinejoin="round" />

    {/* Power aura radiating from fists */}
    <g opacity="0.8">
      <polygon points="70,385 50,370 60,360 75,375" fill={THEME.cyan} stroke={THEME.ink} strokeWidth="2.5" />
      <polygon points="330,385 350,370 340,360 325,375" fill={THEME.cyan} stroke={THEME.ink} strokeWidth="2.5" />
    </g>
  </svg>
);

/* Decorative orbiting geometry */
const OrbitingGeom = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: "10%", right: "-8%", width: "130px", height: "130px", animation: "spinSlow 22s linear infinite" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <polygon points="50,5 95,80 5,80" fill="none" stroke={THEME.yellow} strokeWidth="3" />
        <polygon points="50,20 80,70 20,70" fill="none" stroke={THEME.ink} strokeWidth="2.5" />
      </svg>
    </div>
    <div style={{ position: "absolute", bottom: "8%", left: "-6%", width: "100px", height: "100px", animation: "spinReverse 18s linear infinite" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect x="15" y="15" width="70" height="70" fill="none" stroke={THEME.red} strokeWidth="3" transform="rotate(15 50 50)" />
        <rect x="30" y="30" width="40" height="40" fill={THEME.red} stroke={THEME.ink} strokeWidth="2.5" transform="rotate(30 50 50)" />
      </svg>
    </div>
    <div style={{ position: "absolute", top: "55%", left: "8%", width: "60px", height: "60px", animation: "floatLg 4s ease-in-out infinite" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <circle cx="50" cy="50" r="38" fill={THEME.cyan} stroke={THEME.ink} strokeWidth="4" />
        <circle cx="50" cy="50" r="14" fill={THEME.ink} />
      </svg>
    </div>
  </div>
);

/* Project thumbnail — per project, an abstract manga "action shot" */
const ProjectThumb = ({ project }) => {
  const { lang } = useLanguage();
  const { code, color } = project;
  const variant = code;
  return (
    <div className={`project-thumb ${project.size}`} style={{ background: `linear-gradient(140deg, ${color}22 0%, ${THEME.panelBg} 100%)` }}>
      <HalftonePatternSVG opacity={0.22} color={color} />
      <svg viewBox="0 0 300 200" style={{ width: "80%", height: "80%", position: "relative", zIndex: 2 }} aria-hidden>
        {variant === "ALPHA" && (
          <g>
            <rect x="40" y="40" width="220" height="130" fill={THEME.white} stroke={THEME.ink} strokeWidth="4" rx="6" />
            <rect x="55" y="55" width="90" height="14" fill={THEME.cyan} stroke={THEME.ink} strokeWidth="3" />
            <rect x="55" y="80" width="190" height="6" fill={THEME.ink} />
            <rect x="55" y="94" width="140" height="6" fill={THEME.ink} />
            <rect x="55" y="108" width="170" height="6" fill={THEME.ink} />
            <rect x="55" y="140" width="60" height="22" fill={THEME.red} stroke={THEME.ink} strokeWidth="3" />
            <rect x="125" y="140" width="60" height="22" fill={THEME.yellow} stroke={THEME.ink} strokeWidth="3" />
          </g>
        )}
        {variant === "BETA" && (
          <g>
            <polygon points="150,30 240,100 200,170 100,170 60,100" fill={THEME.yellow} stroke={THEME.ink} strokeWidth="4" />
            <polygon points="150,60 205,100 180,150 120,150 95,100" fill={THEME.ink} />
            <polygon points="150,85 180,105 170,135 130,135 120,105" fill={THEME.yellow} />
            <text x="150" y="128" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="26" fill={THEME.ink}>R</text>
          </g>
        )}
        {variant === "GAMMA" && (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={30 + i * 50} y={100 - i * 12} width="34" height={60 + i * 15} fill={THEME.red} stroke={THEME.ink} strokeWidth="3" />
            ))}
            <line x1="30" y1="170" x2="260" y2="170" stroke={THEME.ink} strokeWidth="4" />
            <circle cx="260" cy="40" r="14" fill={THEME.cyan} stroke={THEME.ink} strokeWidth="3" />
          </g>
        )}
        {variant === "DELTA" && (
          <g>
            <circle cx="150" cy="100" r="70" fill={THEME.white} stroke={THEME.ink} strokeWidth="4" />
            <path d="M 150 30 L 150 170 M 80 100 L 220 100 M 100 50 L 200 150 M 200 50 L 100 150" stroke={THEME.ink} strokeWidth="3" fill="none" />
            <circle cx="150" cy="100" r="8" fill={THEME.red} stroke={THEME.ink} strokeWidth="3" />
            <circle cx="180" cy="75" r="6" fill={THEME.cyan} stroke={THEME.ink} strokeWidth="2.5" />
            <circle cx="115" cy="130" r="6" fill={THEME.yellow} stroke={THEME.ink} strokeWidth="2.5" />
          </g>
        )}
        {variant === "EPSILON" && (
          <g>
            <text x="150" y="125" textAnchor="middle" fontFamily="Bangers, cursive" fontSize="90" fill={THEME.yellow} stroke={THEME.ink} strokeWidth="4">
              GO!
            </text>
            {[...Array(8)].map((_, i) => (
              <line key={i} x1={30 + i * 35} y1="30" x2={50 + i * 35} y2="60" stroke={THEME.red} strokeWidth="3" strokeLinecap="round" />
            ))}
          </g>
        )}
        {variant === "ZETA" && (
          <g>
            <polygon points="150,20 260,80 220,180 80,180 40,80" fill={THEME.cyan} stroke={THEME.ink} strokeWidth="4" strokeLinejoin="round" />
            <polygon points="150,50 220,90 200,150 100,150 80,90" fill={THEME.white} stroke={THEME.ink} strokeWidth="3" strokeLinejoin="round" />
            <polygon points="150,80 185,100 175,135 125,135 115,100" fill={THEME.red} stroke={THEME.ink} strokeWidth="3" strokeLinejoin="round" />
            <polygon points="150,95 170,108 165,125 135,125 130,108" fill={THEME.yellow} stroke={THEME.ink} strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Category badge overlaid */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 3 }}>
        <span className="tag-pill" style={{ background: CATEGORY_COLORS[project.category], color: project.category === "RESEARCH" ? THEME.ink : THEME.ink }}>
          {CATEGORY_LABELS[lang][project.category]}
        </span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Language toggle (EN/ES)
   ═══════════════════════════════════════════════════════════════ */
function LanguageToggle({ compact }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      role="group"
      aria-label="Language"
      style={{
        display: "inline-flex",
        border: `2.5px solid ${THEME.ink}`,
        borderRadius: 999,
        overflow: "hidden",
        background: THEME.white,
      }}
    >
      {["en", "es"].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          style={{
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: compact ? "0.78rem" : "0.72rem",
            letterSpacing: "0.08em",
            padding: compact ? "0.5rem 0.7rem" : "0.35rem 0.6rem",
            background: lang === code ? THEME.ink : "transparent",
            color: lang === code ? THEME.white : THEME.ink,
          }}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Navigation Bar
   ═══════════════════════════════════════════════════════════════ */
function NavigationBar({ menuOpen, setMenuOpen }) {
  const { t } = useLanguage();
  return (
    <>
    <nav
      role="navigation"
      aria-label="Primary"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        background: "rgba(10,10,15,0.78)",
        borderBottom: `3px solid ${THEME.ink}`,
        boxShadow: `0 3px 0 ${THEME.cyan}, 0 6px 0 ${THEME.ink}`,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.9rem 1.5rem",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <a
          href="#top"
          className="load-logo"
          aria-label={t.nav.home}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.2rem",
            letterSpacing: "0.06em",
            color: THEME.white,
            textDecoration: "none",
            lineHeight: 1,
            display: "inline-block",
          }}
        >
          YHOSINC
        </a>

        {/* Desktop links */}
        <ul
          className="load-nav desktop-only"
          style={{
            display: "flex",
            listStyle: "none",
            gap: "0.6rem",
            alignItems: "center",
          }}
        >
          {NAV_LINKS.map((l) => (
            <li key={l.key}>
              <a href={l.href} className="pill-nav" aria-label={t.nav[l.key]}>
                {t.nav[l.key]}
                <span className="speed-hover">
                  <SpeedLines direction="right" count={4} color={THEME.ink} strokeWidth={1.5} />
                </span>
              </a>
            </li>
          ))}
          <li>
            <LanguageToggle />
          </li>
          <li>
            <a href="#contact" className="btn-manga red" aria-label={t.nav.hireMe}>
              {t.nav.hireMe} <ArrowRight size={18} strokeWidth={3} />
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
          style={{
            background: THEME.yellow,
            border: `3px solid ${THEME.ink}`,
            borderRadius: 10,
            padding: "0.5rem 0.7rem",
            cursor: "pointer",
            color: THEME.ink,
            boxShadow: `3px 3px 0 ${THEME.ink}`,
          }}
        >
          {menuOpen ? <X size={22} strokeWidth={3} /> : <Menu size={22} strokeWidth={3} />}
        </button>
      </div>
    </nav>

      {/* Mobile sheet — rendered as a sibling of <nav>, not nested inside it.
          <nav> has backdropFilter, which creates a new containing block for
          any position:fixed descendant (per spec, same as `filter`/`transform`)
          — that broke this sheet's sizing/positioning when it lived inside
          <nav>, since inset:0 resolved against the ~78px-tall nav box instead
          of the viewport. Sibling placement keeps position:fixed anchored to
          the real viewport.
          tabIndex is toggled with menuOpen so closed links can't steal
          keyboard focus even though they're kept mounted for the slide-out
          transition (a real bug in the original: transform alone doesn't
          remove elements from the tab order). */}
      <div className={`mobile-sheet ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        {/* Cierra el panel — el toggle de arriba queda tapado por este mismo
            sheet (z-index 80 > 60 del nav) una vez abierto, así que sin este
            botón no había forma de cerrar sin navegar a otra sección. */}
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label={t.nav.closeMenu}
          tabIndex={menuOpen ? 0 : -1}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: THEME.yellow,
            border: `3px solid ${THEME.ink}`,
            borderRadius: 10,
            padding: "0.5rem 0.7rem",
            cursor: "pointer",
            color: THEME.ink,
            boxShadow: `3px 3px 0 ${THEME.ink}`,
          }}
        >
          <X size={22} strokeWidth={3} />
        </button>
        <div style={{ marginTop: "1rem" }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="mobile-link"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              {t.nav[l.key]}
            </a>
          ))}
          <div style={{ marginTop: "1.5rem" }}>
            <LanguageToggle compact />
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <a href="#contact" className="btn-manga red" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>
              {t.nav.hireMe} <ArrowRight size={18} strokeWidth={3} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Hero
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const { t } = useLanguage();
  return (
    <section
      id="top"
      className="halftone-bg"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        paddingTop: "2rem",
      }}
    >
      {/* Radial spotlight following cursor — driven by CSS vars updated
          directly on the DOM (see root component), never via React state,
          so mouse movement never triggers a re-render of this subtree. */}
      <div aria-hidden className="cursor-spotlight" />

      <OrbitingGeom />

      <div
        className="hero-grid"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "4rem 1.5rem 2rem",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "2rem",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Left: text */}
        <div className="load-hero-text">
          <div
            className="mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.4rem 0.9rem",
              border: `2.5px solid ${THEME.white}`,
              borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              color: THEME.cyan,
              fontSize: "0.78rem",
              marginBottom: "1.5rem",
              fontWeight: 700,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.red, boxShadow: `0 0 8px ${THEME.red}`, animation: "pulseGlow 2s infinite" }} />
            {t.hero.badge}
          </div>

          <h1 className="hero-title">YHOSINC</h1>

          <p
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(1.2rem, 2.6vw, 2rem)",
              letterSpacing: "0.06em",
              color: THEME.white,
              marginTop: "1.2rem",
              maxWidth: "34ch",
              lineHeight: 1.2,
            }}
          >
            {t.hero.subtitlePrefix}<span style={{ color: THEME.cyan }}>{t.hero.subtitleShipping}</span>{t.hero.subtitleMid}<span style={{ color: THEME.yellow }}>{t.hero.subtitleInk}</span>{t.hero.subtitleEnd}
          </p>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.75)",
              marginTop: "1rem",
              maxWidth: "48ch",
            }}
          >
            {t.hero.body}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginTop: "2rem" }}>
            <a href="#projects" className="btn-manga cyan">
              {t.hero.seeWork} <ArrowDown size={18} strokeWidth={3} />
            </a>
            <a href="#contact" className="btn-manga">
              {t.hero.getInTouch} <Mail size={18} strokeWidth={3} />
            </a>
          </div>

          <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            <div>
              <div className="t-display" style={{ fontSize: "2.6rem", color: THEME.cyan, lineHeight: 1 }}>
                47+
              </div>
              <div className="mono" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", marginTop: 4 }}>
                {t.hero.statProjects}
              </div>
            </div>
            <div>
              <div className="t-display" style={{ fontSize: "2.6rem", color: THEME.yellow, lineHeight: 1 }}>
                6YR
              </div>
              <div className="mono" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", marginTop: 4 }}>
                {t.hero.statYears}
              </div>
            </div>
            <div>
              <div className="t-display" style={{ fontSize: "2.6rem", color: THEME.red, lineHeight: 1 }}>
                ∞
              </div>
              <div className="mono" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", marginTop: 4 }}>
                {t.hero.statCoffee}
              </div>
            </div>
          </div>
        </div>

        {/* Right: character */}
        <div className="load-hero-vis" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              width: "min(100%, 480px)",
              aspectRatio: "4/5",
              animation: "floatLg 4.5s ease-in-out infinite",
            }}
          >
            {/* Speed burst behind character */}
            <div style={{ position: "absolute", inset: "-10%", animation: "spinSlow 40s linear infinite", opacity: 0.5 }}>
              <SpeedBurst color={THEME.cyan} strokeWidth={2.5} />
            </div>
            <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
              <LowPolyCharacter />
            </div>
            {/* Action tag */}
            <div
              style={{
                position: "absolute",
                top: "8%",
                right: "-2%",
                transform: "rotate(8deg)",
                background: THEME.yellow,
                border: `3px solid ${THEME.ink}`,
                padding: "0.4rem 0.8rem",
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                color: THEME.ink,
                boxShadow: `4px 4px 0 ${THEME.ink}`,
                zIndex: 3,
                letterSpacing: "0.04em",
              }}
            >
              POW!
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "5%",
                left: "-3%",
                transform: "rotate(-6deg)",
                background: THEME.red,
                color: THEME.white,
                border: `3px solid ${THEME.ink}`,
                padding: "0.4rem 0.8rem",
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                boxShadow: `4px 4px 0 ${THEME.ink}`,
                zIndex: 3,
                letterSpacing: "0.04em",
              }}
            >
              {t.hero.codeInk}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#projects"
        aria-label={t.hero.scrollAria}
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          color: THEME.white,
          zIndex: 3,
        }}
      >
        <span className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)" }}>
          {t.hero.scroll}
        </span>
        <div
          style={{
            width: 36,
            height: 36,
            border: `3px solid ${THEME.cyan}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "bounceArrow 1.8s ease-in-out infinite",
            background: "rgba(0,245,255,0.1)",
          }}
        >
          <ArrowDown size={18} strokeWidth={3} color={THEME.cyan} />
        </div>
      </a>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Project Detail Page (/proyectos/:slug)
   ═══════════════════════════════════════════════════════════════ */
function ProjectDetailPage() {
  const { slug } = useParams();
  const { lang, t } = useLanguage();
  const project = PROJECTS.find((p) => p.slug === slug);
  const projectText = project ? PROJECT_I18N[project.slug][lang] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    fetch(`${API_BASE_URL}/api/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "project_view", projectSlug: project.slug }),
    }).catch(() => {});
  }, [project]);

  if (!project) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <section className="halftone-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
          <h1 className="splash-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>404</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "1rem", fontSize: "1.1rem" }}>{t.projects.notFoundTitle}</p>
          <Link to="/" className="btn-manga cyan" style={{ marginTop: "2rem" }}>
            {t.projects.backToPortfolio}
          </Link>
        </section>
      </>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: THEME.ink }}>
      <style>{GLOBAL_CSS}</style>
      <nav
        role="navigation"
        aria-label="Primary"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          background: "rgba(10,10,15,0.78)",
          borderBottom: `3px solid ${THEME.ink}`,
          boxShadow: `0 3px 0 ${THEME.cyan}, 0 6px 0 ${THEME.ink}`,
          padding: "0.9rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.2rem",
              letterSpacing: "0.06em",
              color: THEME.white,
              textDecoration: "none",
            }}
          >
            YHOSINC
          </Link>
          <LanguageToggle />
        </div>
      </nav>

      <section className="halftone-bg" style={{ padding: "4rem 1.5rem 6rem", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Link
            to="/#projects"
            className="mono"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: THEME.cyan, textDecoration: "none", fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "2rem" }}
          >
            {t.projects.backToAllWork}
          </Link>

          <div className="panel-3d" style={{ overflow: "hidden" }}>
            <header
              style={{
                background: project.color,
                borderBottom: `3px solid ${THEME.ink}`,
                padding: "1.2rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "1rem",
              }}
            >
              <div>
                <div className="mono" style={{ fontSize: "0.8rem", color: THEME.ink, letterSpacing: "0.15em", fontWeight: 700 }}>
                  {t.projects.chapter} {project.chapter}
                </div>
                <h1 className="t-title" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: THEME.ink, lineHeight: 1.05, marginTop: 4 }}>
                  {projectText.title}
                </h1>
              </div>
              <div className="chapter-num" style={{ flexShrink: 0, color: THEME.ink, WebkitTextStroke: `2px ${THEME.ink}`, textShadow: `3px 3px 0 ${THEME.white}` }}>
                {project.chapter}
              </div>
            </header>

            <ProjectThumb project={{ ...project, size: "lg" }} />

            <div style={{ padding: "2rem 1.5rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center", marginBottom: "1.2rem" }}>
                <span className="tag-pill" style={{ background: project.color, color: THEME.ink }}>
                  {CATEGORY_LABELS[lang][project.category]}
                </span>
                <span className="mono" style={{ color: project.color, fontSize: "0.9rem", fontWeight: 700 }}>
                  {projectText.tagline}
                </span>
              </div>

              <p style={{ fontSize: "1.15rem", lineHeight: 1.65, color: "rgba(255,255,255,0.85)", marginBottom: "1.5rem" }}>
                {projectText.blurb}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
                {projectText.tags.map((tag) => (
                  <span key={tag} className="tag-pill" style={{ background: "rgba(255,255,255,0.05)", color: THEME.white, borderColor: "rgba(255,255,255,0.3)" }}>
                    {tag}
                  </span>
                ))}
              </div>

              <Link to="/#contact" className="btn-manga red">
                {t.projects.letsTalk} <ArrowRight size={18} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Ticker Marquee
   ═══════════════════════════════════════════════════════════════ */
function Ticker() {
  const { t } = useLanguage();
  const repeated = [...t.ticker, ...t.ticker, ...t.ticker, ...t.ticker];
  return (
    <div
      style={{
        background: THEME.cyan,
        borderTop: `3px solid ${THEME.ink}`,
        borderBottom: `3px solid ${THEME.ink}`,
        overflow: "hidden",
        padding: "0.9rem 0",
        transform: "rotate(-1.5deg)",
        margin: "4rem -2% 2rem",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="ticker">
        {repeated.map((w, i) => (
          <span key={i} className="ticker-item">
            {w}
            <span className="ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Projects (manga panel masonry)
   ═══════════════════════════════════════════════════════════════ */
function ProjectCard({ project, index, hoveredCard, setHoveredCard }) {
  const { lang, t } = useLanguage();
  const projectText = PROJECT_I18N[project.slug][lang];
  const delay = `${index * 90}ms`;
  const isHovered = hoveredCard === project.code;
  return (
    <article
      className="project-card load-card"
      style={{ animationDelay: delay }}
      onMouseEnter={() => setHoveredCard(project.code)}
      onMouseLeave={() => setHoveredCard(null)}
      aria-labelledby={`title-${project.code}`}
    >
      {/* Speed line edges on hover */}
      <div className="speed-edge" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, pointerEvents: "none", zIndex: 4 }}>
        <SpeedLines direction="right" count={5} color={project.color} strokeWidth={2.5} />
      </div>

      {/* Header band */}
      <header
        style={{
          background: project.color,
          borderBottom: `3px solid ${THEME.ink}`,
          padding: "0.6rem 1rem 0.4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "0.8rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: "0.7rem", color: THEME.ink, letterSpacing: "0.15em", fontWeight: 700 }}>
            {t.projects.chapter} {project.chapter}
          </div>
          <h3
            id={`title-${project.code}`}
            className="t-title"
            style={{
              fontSize: "1.5rem",
              color: THEME.ink,
              lineHeight: 1.05,
              letterSpacing: "0.04em",
              marginTop: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {projectText.title}
          </h3>
        </div>
        <div className="chapter-num" style={{ flexShrink: 0, color: THEME.ink, WebkitTextStroke: `2px ${THEME.ink}`, textShadow: `3px 3px 0 ${THEME.white}` }}>
          {project.chapter}
        </div>
      </header>

      {/* Thumbnail */}
      <ProjectThumb project={project} />

      {/* Body */}
      <div style={{ padding: "1rem 1.1rem 1.2rem" }}>
        <div className="mono" style={{ fontSize: "0.75rem", color: project.color, letterSpacing: "0.12em", marginBottom: "0.6rem", fontWeight: 700 }}>
          {projectText.tagline}
        </div>
        <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5, marginBottom: "0.9rem" }}>
          {projectText.blurb}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
          {projectText.tags.map((tag) => (
            <span key={tag} className="tag-pill" style={{ background: "rgba(255,255,255,0.05)", color: THEME.white, borderColor: "rgba(255,255,255,0.3)" }}>
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/proyectos/${project.slug}`}
          className="btn-manga"
          style={{
            width: "100%",
            justifyContent: "space-between",
            background: isHovered ? project.color : THEME.white,
            transition: "background 200ms",
          }}
          aria-label={`${t.projects.viewProjectAria} ${projectText.title}`}
        >
          {t.projects.viewProject} <ArrowRight size={18} strokeWidth={3} />
        </Link>
      </div>
    </article>
  );
}

function ProjectsSection({ hoveredCard, setHoveredCard }) {
  const { t } = useLanguage();
  return (
    <section
      id="projects"
      style={{
        position: "relative",
        padding: "6rem 1.5rem 4rem",
        background: THEME.ink,
      }}
    >
      <HalftonePatternSVG opacity={0.06} color={THEME.cyan} />

      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <header style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div className="mono" style={{ color: THEME.cyan, fontSize: "0.82rem", letterSpacing: "0.2em", fontWeight: 700 }}>
            {t.projects.eyebrow}
          </div>
          <h2 className="section-title-panel">{t.projects.title}</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "60ch", fontSize: "1.05rem", marginTop: "0.5rem" }}>
            {t.projects.intro}
          </p>
        </header>

        <div
          className="project-grid"
          style={{
            columnCount: 3,
            columnGap: "1.5rem",
          }}
        >
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.code} project={p} index={i} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Skills
   ═══════════════════════════════════════════════════════════════ */
function SkillOrb({ skill, index }) {
  const { lang } = useLanguage();
  const { name, level, Icon, color } = skill;
  const label = SKILL_LABELS[lang][name];
  const circumference = 283; // 2πr for r=45
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="skill-orb" style={{ animationDelay: `${index * 80}ms` }} tabIndex={0} role="button" aria-label={`${label} ${level} percent`}>
      <div className="skill-tip">
        {label} · LV.{level}
      </div>
      <div style={{ position: "relative", width: "100%", maxWidth: 140, aspectRatio: "1/1" }}>
        <svg className="ring" viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r="45" fill={THEME.panelBg} stroke={THEME.ink} strokeWidth="5" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${color}aa)` }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "0.15rem",
          }}
        >
          <Icon size={26} strokeWidth={2.5} color={color} />
          <div className="t-display" style={{ fontSize: "1.2rem", color: THEME.white, lineHeight: 1 }}>
            {level}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div className="t-title" style={{ fontSize: "0.9rem", color: THEME.white, letterSpacing: "0.1em" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function SkillsSection() {
  const { t } = useLanguage();
  return (
    <section
      id="skills"
      style={{
        position: "relative",
        padding: "6rem 1.5rem 4rem",
        background: `linear-gradient(180deg, ${THEME.ink} 0%, ${THEME.panelBgAlt} 100%)`,
        overflow: "hidden",
      }}
    >
      <HalftonePatternSVG opacity={0.07} color={THEME.yellow} />
      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="mono" style={{ color: THEME.yellow, fontSize: "0.82rem", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "0.8rem" }}>
            {t.skills.eyebrow}
          </div>
          <h2 className="section-title-panel" style={{ background: THEME.yellow, boxShadow: "var(--shadow-3d-yellow)" }}>
            {t.skills.title}
          </h2>
        </header>

        <div
          className="skills-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {SKILLS.map((s, i) => (
            <SkillOrb key={s.name} skill={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: About
   ═══════════════════════════════════════════════════════════════ */
function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="about" style={{ position: "relative", padding: "6rem 1.5rem 4rem", background: THEME.ink }}>
      <HalftonePatternSVG opacity={0.05} color={THEME.red} />
      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <header style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div className="mono" style={{ color: THEME.red, fontSize: "0.82rem", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "0.8rem" }}>
            {t.about.eyebrow}
          </div>
          <h2 className="section-title-panel" style={{ background: THEME.red, color: THEME.white, boxShadow: "var(--shadow-3d-red)" }}>
            {t.about.title}
          </h2>
        </header>

        <div
          className="about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* Character profile card */}
          <div className="panel-3d" style={{ padding: "2rem" }}>
            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1.5rem" }}>
              <div
                className="avatar-glow"
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${THEME.cyan}, ${THEME.yellow})`,
                  border: `3px solid ${THEME.ink}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <svg viewBox="0 0 100 100" style={{ width: "85%", height: "85%" }}>
                  <polygon points="50,18 72,38 72,62 50,72 28,62 28,38" fill={THEME.yellow} stroke={THEME.ink} strokeWidth="3.5" strokeLinejoin="round" />
                  <polygon points="50,18 60,12 70,22 72,38" fill={THEME.ink} />
                  <polygon points="50,18 40,12 30,22 28,38" fill={THEME.ink} />
                  <polygon points="40,42 46,40 45,48 39,46" fill={THEME.ink} />
                  <polygon points="54,40 60,42 61,46 55,48" fill={THEME.ink} />
                  <path d="M 42 58 Q 50 62 58 58" stroke={THEME.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="t-display" style={{ fontSize: "2.2rem", color: THEME.white, lineHeight: 1 }}>
                  YHOSINC
                </div>
                <div className="mono" style={{ fontSize: "0.8rem", color: THEME.cyan, letterSpacing: "0.12em", marginTop: 4 }}>
                  {t.about.handle}
                </div>
              </div>
            </div>

            <div>
              <div className="profile-row">
                <span className="profile-key">{t.about.class_}</span>
                <span className="profile-val" style={{ color: THEME.cyan }}>{t.about.classVal}</span>
              </div>
              <div className="profile-row">
                <span className="profile-key">{t.about.specialty}</span>
                <span className="profile-val">{t.about.specialtyVal}</span>
              </div>
              <div className="profile-row">
                <span className="profile-key">{t.about.level}</span>
                <span className="profile-val" style={{ color: THEME.yellow }}>87 / 100</span>
              </div>
              <div className="profile-row">
                <span className="profile-key">{t.about.xp}</span>
                <span className="profile-val">{t.about.xpVal}</span>
              </div>
              <div className="profile-row">
                <span className="profile-key">{t.about.base}</span>
                <span className="profile-val">{t.about.baseVal}</span>
              </div>
              <div className="profile-row">
                <span className="profile-key">{t.about.weapon}</span>
                <span className="profile-val" style={{ color: THEME.red }}>{t.about.weaponVal}</span>
              </div>
              <div className="profile-row">
                <span className="profile-key">{t.about.status}</span>
                <span className="profile-val" style={{ color: THEME.cyan, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: THEME.cyan, boxShadow: `0 0 10px ${THEME.cyan}` }} />
                  {t.about.statusVal}
                </span>
              </div>
            </div>
          </div>

          {/* Brand story panel */}
          <div style={{ position: "relative", paddingLeft: "2rem" }}>
            {/* Speed lines decoration on the left */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "1.5rem" }}>
              <svg viewBox="0 0 10 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                {[10, 25, 38, 55, 72, 88].map((y, i) => (
                  <line key={i} x1="0" y1={y} x2="10" y2={y} stroke={THEME.cyan} strokeWidth="2.5" strokeLinecap="round" />
                ))}
              </svg>
            </div>

            <div className="mono" style={{ color: THEME.yellow, fontSize: "0.8rem", letterSpacing: "0.15em", marginBottom: "1rem", fontWeight: 700 }}>
              {t.about.originStory}
            </div>
            <h3 className="t-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: THEME.white, lineHeight: 1, marginBottom: "1rem", letterSpacing: "0.03em" }}>
              {t.about.storyTitle1}<br />
              {t.about.storyTitle2}<span style={{ color: THEME.cyan }}>{t.about.storyTitle2Highlight}</span>{t.about.storyTitle3}
            </h3>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.6, marginBottom: "1rem" }}>
              {t.about.story1}
            </p>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              <strong style={{ color: THEME.yellow }}>{t.about.story2Studio}</strong>{t.about.story2Mid}<em style={{ color: THEME.cyan }}>{t.about.story2Compositions}</em>{t.about.story2End}
            </p>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <div className="mono" style={{ padding: "0.4rem 0.9rem", background: "rgba(0,245,255,0.1)", border: `2px solid ${THEME.cyan}`, borderRadius: 999, color: THEME.cyan, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                {t.about.tag1}
              </div>
              <div className="mono" style={{ padding: "0.4rem 0.9rem", background: "rgba(255,224,0,0.1)", border: `2px solid ${THEME.yellow}`, borderRadius: 999, color: THEME.yellow, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                {t.about.tag2}
              </div>
              <div className="mono" style={{ padding: "0.4rem 0.9rem", background: "rgba(255,45,85,0.1)", border: `2px solid ${THEME.red}`, borderRadius: 999, color: THEME.red, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                {t.about.tag3}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Contact / CTA Final
   ═══════════════════════════════════════════════════════════════ */
function ContactSection() {
  const { t } = useLanguage();
  const [composeOpen, setComposeOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitState, setSubmitState] = useState({ status: "idle", error: "" });
  const [pendingExternalLink, setPendingExternalLink] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación propia — así el mensaje no depende del idioma configurado
    // en el navegador de quien visita (los mensajes nativos del navegador
    // para "required"/"type=email" salen en el idioma del navegador, no en
    // el de la página).
    if (!form.name.trim()) {
      setSubmitState({ status: "error", error: t.contact.errName });
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setSubmitState({ status: "error", error: t.contact.errEmail });
      return;
    }
    if (!form.message.trim()) {
      setSubmitState({ status: "error", error: t.contact.errMessage });
      return;
    }

    setSubmitState({ status: "submitting", error: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || t.contact.errGeneric);
      }
      setSubmitState({ status: "success", error: "" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setSubmitState({ status: "error", error: err.message || t.contact.errGeneric });
    }
  };

  return (
    <section
      id="contact"
      style={{
        position: "relative",
        padding: "8rem 1.5rem 6rem",
        background: THEME.ink,
        borderTop: `4px solid ${THEME.ink}`,
        overflow: "hidden",
      }}
    >
      <HalftonePatternSVG opacity={0.1} color={THEME.yellow} />

      {/* Background speed lines radiating */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}>
        <SpeedBurst color={THEME.yellow} strokeWidth={2} />
      </div>

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div className="mono" style={{ color: THEME.cyan, fontSize: "0.82rem", letterSpacing: "0.2em", fontWeight: 700, marginBottom: "1.2rem" }}>
          {t.contact.eyebrow}
        </div>
        <h2 className="splash-title">
          {t.contact.title1}<br />
          {t.contact.title2}<br />
          {t.contact.title3}
        </h2>

        <p className="t-title" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", color: THEME.white, letterSpacing: "0.08em", marginTop: "2rem", maxWidth: "48ch", marginInline: "auto" }}>
          {t.contact.subtitle}
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem", position: "relative" }}>
          {!composeOpen && (
            <>
              {/* Explosion rings */}
              <div aria-hidden style={{ position: "absolute", inset: "-20px", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ position: "absolute", width: "120%", maxWidth: 360, aspectRatio: "1/1", border: `3px solid ${THEME.red}`, borderRadius: "50%", animation: "explode 2.2s ease-out infinite" }} />
                <div style={{ position: "absolute", width: "120%", maxWidth: 360, aspectRatio: "1/1", border: `3px solid ${THEME.yellow}`, borderRadius: "50%", animation: "explode 2.2s ease-out infinite 0.7s" }} />
              </div>
              <button
                type="button"
                onClick={() => {
                  setComposeOpen(true);
                  setSubmitState({ status: "idle", error: "" });
                }}
                className="btn-manga red"
                style={{
                  fontSize: "1.3rem",
                  padding: "1.2rem 2.2rem",
                  animation: "pulseGlow 2.4s infinite",
                }}
              >
                <Mail size={22} strokeWidth={3} /> {CONTACT_EMAIL_DISPLAY.toUpperCase()}
              </button>
            </>
          )}

          {composeOpen && (
            <div
              className="panel-3d panel-3d-red"
              style={{
                width: "100%",
                maxWidth: 480,
                textAlign: "left",
                overflow: "hidden",
              }}
            >
              {/* Barra tipo "compose" de un cliente de correo */}
              <div
                style={{
                  background: THEME.red,
                  borderBottom: `3px solid ${THEME.ink}`,
                  padding: "0.7rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span className="t-title" style={{ color: THEME.white, letterSpacing: "0.06em", fontSize: "1rem" }}>
                  {t.contact.newMessage}
                </span>
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  aria-label={t.contact.close}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: THEME.white, display: "flex" }}
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <div style={{ padding: "1.2rem" }}>
                {submitState.status === "success" ? (
                  <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
                    <p className="t-title" style={{ color: THEME.cyan, fontSize: "1.2rem", letterSpacing: "0.05em" }}>
                      {t.contact.messageSent}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.6rem", fontSize: "0.95rem" }}>
                      {t.contact.thanks}
                    </p>
                    <button type="button" className="btn-manga" style={{ marginTop: "1.2rem" }} onClick={() => setComposeOpen(false)}>
                      {t.contact.closeBtn}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div
                      className="mono"
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.6)",
                        borderBottom: "2px dashed rgba(255,255,255,0.15)",
                        paddingBottom: "0.6rem",
                        marginBottom: "0.9rem",
                      }}
                    >
                      {t.contact.to} <span style={{ color: THEME.white }}>{CONTACT_EMAIL_DISPLAY}</span>
                    </div>

                    <label className="mono" style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                      {t.contact.yourName}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder={t.contact.namePlaceholder}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        marginBottom: "0.9rem",
                        borderRadius: 10,
                        border: `2px solid ${THEME.ink}`,
                        background: THEME.panelBgAlt,
                        color: THEME.white,
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                      }}
                    />

                    <label className="mono" style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                      {t.contact.yourEmail}
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={200}
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder={t.contact.emailPlaceholder}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        marginBottom: "0.9rem",
                        borderRadius: 10,
                        border: `2px solid ${THEME.ink}`,
                        background: THEME.panelBgAlt,
                        color: THEME.white,
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                      }}
                    />

                    <label className="mono" style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                      {t.contact.message}
                    </label>
                    <textarea
                      required
                      maxLength={2000}
                      rows={5}
                      value={form.message}
                      onChange={handleChange("message")}
                      placeholder={t.contact.messagePlaceholder}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        marginBottom: "0.9rem",
                        borderRadius: 10,
                        border: `2px solid ${THEME.ink}`,
                        background: THEME.panelBgAlt,
                        color: THEME.white,
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        resize: "vertical",
                      }}
                    />

                    {submitState.status === "error" && (
                      <p style={{ color: THEME.red, fontSize: "0.85rem", marginBottom: "0.9rem" }}>{submitState.error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitState.status === "submitting"}
                      className="btn-manga red"
                      style={{ width: "100%", justifyContent: "center", opacity: submitState.status === "submitting" ? 0.7 : 1 }}
                    >
                      {submitState.status === "submitting" ? t.contact.sending : t.contact.send} <ArrowRight size={18} strokeWidth={3} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Social pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem", marginTop: "3rem", flexWrap: "wrap" }}>
          {[
            { Icon: Github, label: "GITHUB", href: "https://github.com/yhoset", confirmLeave: true },
            { Icon: XLogo, label: "TWITTER", href: "https://x.com/yhole9", confirmLeave: true },
            { Icon: Linkedin, label: "LINKEDIN", href: "https://www.linkedin.com/in/yhoset-gonzalez-b69a8519b/", confirmLeave: true },
            { Icon: Sparkles, label: "DRIBBBLE", href: "https://dribbble.com/yhoset-gonzalez", confirmLeave: true },
          ].map(({ Icon, label, href, confirmLeave }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="pill-nav"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: THEME.white }}
              onClick={
                confirmLeave
                  ? (e) => {
                      e.preventDefault();
                      setPendingExternalLink({ href, label });
                    }
                  : undefined
              }
            >
              <Icon size={16} strokeWidth={3} />
              {label}
            </a>
          ))}
        </div>

        {/* Aviso antes de salir a un link externo — pedido por el usuario:
            en vez de navegar directo, confirma primero con un popup del
            mismo estilo del sitio. */}
        {pendingExternalLink && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${t.contact.leavingTo} ${pendingExternalLink.label}`}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              background: "rgba(10,10,15,0.75)",
            }}
            onClick={() => setPendingExternalLink(null)}
          >
            <div
              className="panel-3d panel-3d-yellow"
              style={{ maxWidth: 380, width: "100%", padding: "1.6rem", textAlign: "center" }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="t-title" style={{ fontSize: "1.1rem", color: THEME.white, letterSpacing: "0.04em" }}>
                {t.contact.leavingTo} {pendingExternalLink.label}
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.7rem", fontSize: "0.95rem" }}>
                {t.contact.leavingBody}
              </p>
              <div style={{ display: "flex", gap: "0.7rem", justifyContent: "center", marginTop: "1.4rem", flexWrap: "wrap" }}>
                <button type="button" className="btn-manga" onClick={() => setPendingExternalLink(null)}>
                  {t.contact.cancel}
                </button>
                <a
                  href={pendingExternalLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-manga yellow"
                  onClick={() => setPendingExternalLink(null)}
                >
                  {t.contact.continue_} <ArrowRight size={16} strokeWidth={3} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Footer
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  const { t } = useLanguage();
  return (
    <footer
      className="halftone-panel"
      style={{
        borderTop: `3px solid ${THEME.ink}`,
        padding: "2rem 1.5rem",
        background: THEME.panelBgAlt,
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="t-display" style={{ fontSize: "1.5rem", color: THEME.white, letterSpacing: "0.06em" }}>
          YHOSINC
        </div>
        <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.key} href={l.href} className="mono" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.12em", fontWeight: 700 }}>
              {t.nav[l.key]}
            </a>
          ))}
        </div>
        <div className="mono" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", letterSpacing: "0.1em" }}>
          {t.footer.rights} <Zap size={12} style={{ display: "inline", verticalAlign: "middle", color: THEME.cyan }} /> {t.footer.tagline}
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function YhosincPortfolio() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const parallaxRef = useRef(null);
  const progressBarRef = useRef(null);
  const rafMouseRef = useRef(null);
  const rafScrollRef = useRef(null);

  /* scroll to the #anchor on mount — needed when arriving here via a
     React Router navigation from another route (e.g. the project detail
     page's "back to work" link). A client-side route change never
     triggers the browser's own scroll-to-anchor behavior, that only
     happens on a real full-page load. */
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) el.scrollIntoView();
    }
  }, []);

  /* pageview — one event per load of the home page. */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview" }),
    }).catch(() => {});
  }, []);

  /* mousemove — writes CSS custom properties directly on the document,
     throttled via rAF. No React state involved, so the cursor spotlight
     never causes a re-render of the component tree (perf fix). */
  useEffect(() => {
    const root = document.documentElement;
    const onMove = (e) => {
      if (rafMouseRef.current) return;
      rafMouseRef.current = requestAnimationFrame(() => {
        // .cursor-spotlight vive dentro de la sección Hero (position: absolute),
        // así que la posición del glow tiene que ser relativa a esa sección, no
        // a la ventana — si no, se "despega" del cursor apenas hay scroll.
        const hero = document.getElementById("top");
        if (hero) {
          const rect = hero.getBoundingClientRect();
          root.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          root.style.setProperty("--my", `${e.clientY - rect.top}px`);
        }
        rafMouseRef.current = null;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafMouseRef.current) cancelAnimationFrame(rafMouseRef.current);
    };
  }, []);

  /* scroll listener — also throttled via rAF, and applied straight to the
     DOM node's transform instead of React state, avoiding a re-render of
     the whole page on every scroll tick. */
  useEffect(() => {
    const onScroll = () => {
      if (rafScrollRef.current) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        const parallaxY = window.scrollY * 0.25;
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translateY(${-parallaxY * 0.15}px)`;
        }
        if (progressBarRef.current) {
          const scrollable = document.documentElement.scrollHeight - window.innerHeight;
          const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
          progressBarRef.current.style.width = `${Math.min(100, Math.max(0, pct))}%`;
        }
        rafScrollRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
    };
  }, []);

  /* active section observer */
  useEffect(() => {
    const ids = ["top", "projects", "skills", "about", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: THEME.ink }}>
      <style>{GLOBAL_CSS}</style>

      {/* Parallax halftone overlay — subtle */}
      <div
        ref={parallaxRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.35,
          zIndex: 1,
        }}
      >
        <HalftonePatternSVG opacity={0.04} color={THEME.white} />
      </div>

      {/* Barra de progreso de lectura — solo mobile, refleja cuánto se
          scrolleó de la página. El indicador de puntos cumple ese rol en
          desktop (.desktop-only); acá el equivalente para .mobile-only. */}
      <div
        className="mobile-only"
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "rgba(255,255,255,0.08)",
          borderBottom: `2px solid ${THEME.ink}`,
          zIndex: 90,
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "0%",
            background: THEME.cyan,
            boxShadow: `0 0 6px ${THEME.cyan}`,
          }}
        />
      </div>

      <NavigationBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main style={{ position: "relative", zIndex: 2 }}>
        <HeroSection />
        <Ticker />
        <ProjectsSection hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
        <SkillsSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Floating section indicator (desktop only) */}
      <div
        className="desktop-only"
        style={{
          position: "fixed",
          right: "1.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          zIndex: 40,
        }}
        aria-hidden
      >
        {["top", "projects", "skills", "about", "contact"].map((id) => (
          <div
            key={id}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: activeSection === id ? THEME.cyan : "transparent",
              border: `2.5px solid ${activeSection === id ? THEME.cyan : "rgba(255,255,255,0.4)"}`,
              boxShadow: activeSection === id ? `0 0 10px ${THEME.cyan}` : "none",
              transition: "all 220ms",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Custom cursor (site-wide, todas las rutas)
   Vive fuera de <Routes> para no desmontarse en cada navegación —
   antes estaba dentro de YhosincPortfolio y por eso desaparecía al
   entrar a /proyectos/:slug (esa ruta no renderiza ese componente).
   ═══════════════════════════════════════════════════════════════ */
function CustomCursor() {
  const cursorArrowRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const onMove = (e) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        root.style.setProperty("--cx", `${e.clientX}px`);
        root.style.setProperty("--cy", `${e.clientY}px`);
        rafRef.current = null;
      });
    };
    const onDown = () => cursorArrowRef.current?.classList.add("is-down");
    const onUp = () => cursorArrowRef.current?.classList.remove("is-down");
    const onClick = (e) => {
      const burst = document.createElement("div");
      burst.setAttribute("aria-hidden", "true");
      burst.style.cssText = `position:fixed;left:${e.clientX - 9}px;top:${e.clientY - 9}px;width:18px;height:18px;z-index:9999;pointer-events:none;transform:scale(0.5);opacity:0.75;transition:transform 0.28s cubic-bezier(0.22,1,0.36,1),opacity 0.28s ease-in;will-change:transform,opacity;`;
      burst.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="${THEME.red}" stroke="${THEME.ink}" stroke-width="1.2" stroke-linejoin="round" d="M19.064 10.109l1.179-2.387c.074-.149.068-.327-.015-.471-.083-.145-.234-.238-.401-.249l-2.656-.172-.172-2.656c-.011-.167-.104-.317-.249-.401-.145-.084-.322-.09-.472-.015l-2.385 1.18-1.477-2.215c-.186-.278-.646-.278-.832 0l-1.477 2.215-2.385-1.18c-.151-.075-.327-.069-.472.015-.145.083-.238.234-.249.401l-.171 2.656-2.657.171c-.167.011-.318.104-.401.249-.084.145-.089.322-.015.472l1.179 2.386-2.214 1.477c-.139.093-.223.249-.223.416s.083.323.223.416l2.215 1.477-1.18 2.386c-.074.15-.068.327.015.472.083.144.234.238.401.248l2.656.171.171 2.657c.011.167.104.317.249.401.144.083.32.088.472.015l2.386-1.179 1.477 2.214c.093.139.249.223.416.223s.323-.083.416-.223l1.477-2.214 2.386 1.179c.15.073.327.068.472-.015s.238-.234.249-.401l.171-2.656 2.656-.172c.167-.011.317-.104.401-.249.083-.145.089-.322.015-.472l-1.179-2.385 2.214-1.478c.139-.093.223-.249.223-.416s-.083-.323-.223-.416l-2.214-1.475z"/></svg>`;
      document.body.appendChild(burst);
      requestAnimationFrame(() => {
        burst.style.transform = "scale(1.3) rotate(8deg)";
        burst.style.opacity = "0";
      });
      setTimeout(() => burst.remove(), 300);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("click", onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div aria-hidden className="custom-cursor">
      <div className="custom-cursor-pos">
        <svg ref={cursorArrowRef} className="custom-cursor-arrow" width="34" height="34" viewBox="0 0 34 34">
          <polygon points="4,2 30,16 17,19 12,31 4,2" fill={THEME.white} stroke={THEME.ink} strokeWidth="3" strokeLinejoin="round" />
          <polygon points="4,2 30,16 17,19 12,31 4,2" fill="none" stroke={THEME.cyan} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: Admin (login + panel privado)
   Ruta sin link público — solo accesible entrando directo a /admin.
   No pasa por el sistema de i18n del sitio público: es una
   herramienta interna, siempre en español.
   ═══════════════════════════════════════════════════════════════ */
function AdminPage() {
  const [token, setToken] = useState(() => {
    try {
      return window.localStorage.getItem("yhosinc_admin_token") || "";
    } catch {
      return "";
    }
  });
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [dataError, setDataError] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  // No indexar esta ruta — es un panel privado, no debería aparecer
  // en buscadores aunque no esté linkeada desde ningún lado del sitio.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // Al montar, si hay un token guardado, confirmar que sigue siendo
  // válido contra el backend antes de mostrar el panel.
  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    fetch(`${API_BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error();
        setAuthed(true);
      })
      .catch(() => {
        setToken("");
        try {
          window.localStorage.removeItem("yhosinc_admin_token");
        } catch {
          // sin acceso a localStorage — igual seguimos, solo no persiste
        }
      })
      .finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoadingData(true);
    setDataError("");
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_BASE_URL}/api/admin/messages`, { headers }).then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch(`${API_BASE_URL}/api/admin/analytics`, { headers }).then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([msgs, an]) => {
        setMessages(msgs);
        setAnalytics(an);
      })
      .catch(() => setDataError("No se pudo cargar la información. Probá recargar la página."))
      .finally(() => setLoadingData(false));
  }, [authed, token]);

  const handleLoginChange = (field) => (e) => {
    setLoginForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    let res;
    try {
      res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
    } catch {
      // fetch rechaza por red/CORS antes de llegar a tener una respuesta —
      // "Failed to fetch" del navegador no es un mensaje para mostrarle al usuario.
      setLoginError("No se pudo conectar con el servidor. Probá de nuevo en unos segundos.");
      setLoggingIn(false);
      return;
    }
    try {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo iniciar sesión.");
      setToken(data.token);
      try {
        window.localStorage.setItem("yhosinc_admin_token", data.token);
      } catch {
        // sin persistencia si localStorage falla — la sesión sigue viva en memoria
      }
      setAuthed(true);
    } catch (err) {
      setLoginError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    setAuthed(false);
    setMessages([]);
    setAnalytics(null);
    try {
      window.localStorage.removeItem("yhosinc_admin_token");
    } catch {
      // nada que limpiar si localStorage no está disponible
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return iso;
    }
  };

  const pageStyle = { position: "relative", minHeight: "100vh", background: THEME.ink };

  if (checking) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{GLOBAL_CSS}</style>
        <p className="mono" style={{ color: "rgba(255,255,255,0.6)" }}>Cargando…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <style>{GLOBAL_CSS}</style>
        <div className="panel-3d" style={{ maxWidth: 380, width: "100%", padding: "2rem" }}>
          <h1 className="t-title" style={{ fontSize: "1.5rem", color: THEME.white, marginBottom: "1.5rem" }}>
            ACCESO ADMIN
          </h1>
          <form onSubmit={handleLogin} noValidate>
            <label className="mono" style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
              EMAIL
            </label>
            <input
              type="email"
              required
              value={loginForm.email}
              onChange={handleLoginChange("email")}
              style={{ width: "100%", padding: "0.7rem 0.9rem", marginBottom: "0.9rem", borderRadius: 10, border: `2px solid ${THEME.ink}`, background: THEME.panelBgAlt, color: THEME.white, fontFamily: "var(--font-body)", fontSize: "1rem" }}
            />
            <label className="mono" style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              required
              value={loginForm.password}
              onChange={handleLoginChange("password")}
              style={{ width: "100%", padding: "0.7rem 0.9rem", marginBottom: "0.9rem", borderRadius: 10, border: `2px solid ${THEME.ink}`, background: THEME.panelBgAlt, color: THEME.white, fontFamily: "var(--font-body)", fontSize: "1rem" }}
            />
            {loginError && <p style={{ color: THEME.red, fontSize: "0.85rem", marginBottom: "0.9rem" }}>{loginError}</p>}
            <button type="submit" disabled={loggingIn} className="btn-manga red" style={{ width: "100%", justifyContent: "center", opacity: loggingIn ? 0.7 : 1 }}>
              {loggingIn ? "ENTRANDO..." : "ENTRAR"} <ArrowRight size={18} strokeWidth={3} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <h1 className="t-display" style={{ fontSize: "2rem", color: THEME.white }}>PANEL ADMIN</h1>
          <button type="button" onClick={handleLogout} className="btn-manga">
            CERRAR SESIÓN
          </button>
        </div>

        {dataError && (
          <p style={{ color: THEME.red, marginBottom: "1.5rem" }}>{dataError}</p>
        )}

        {loadingData && !analytics && (
          <p className="mono" style={{ color: "rgba(255,255,255,0.6)" }}>Cargando datos…</p>
        )}

        {analytics && (
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 className="mono" style={{ color: THEME.cyan, fontSize: "0.85rem", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "1rem" }}>
              // ANALÍTICAS
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.2rem" }}>
              <div className="panel-3d" style={{ padding: "1.2rem" }}>
                <div className="t-display" style={{ fontSize: "2rem", color: THEME.cyan }}>{analytics.totalPageviews}</div>
                <div className="mono" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em" }}>PAGEVIEWS</div>
              </div>
              <div className="panel-3d" style={{ padding: "1.2rem" }}>
                <div className="t-display" style={{ fontSize: "2rem", color: THEME.yellow }}>{analytics.totalProjectViews}</div>
                <div className="mono" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em" }}>VISTAS DE PROYECTOS</div>
              </div>
            </div>
            {analytics.byProject.length > 0 && (
              <div className="panel-3d" style={{ padding: "1.2rem" }}>
                {analytics.byProject.map((p) => (
                  <div key={p.projectSlug} className="profile-row">
                    <span className="profile-key">{p.projectSlug}</span>
                    <span className="profile-val">{p.views}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <h2 className="mono" style={{ color: THEME.yellow, fontSize: "0.85rem", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "1rem" }}>
            // MENSAJES ({messages.length})
          </h2>
          {messages.length === 0 && !loadingData ? (
            <p style={{ color: "rgba(255,255,255,0.6)" }}>Todavía no hay mensajes.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {messages.map((m) => (
                <div key={m.id} className="panel-3d" style={{ padding: "1.2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.6rem" }}>
                    <span className="t-title" style={{ color: THEME.white, fontSize: "1rem" }}>{m.name}</span>
                    <span className="mono" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>{formatDate(m.createdAt)}</span>
                  </div>
                  <a href={`mailto:${m.email}`} className="mono" style={{ color: THEME.cyan, fontSize: "0.85rem", textDecoration: "none" }}>{m.email}</a>
                  <p style={{ color: "rgba(255,255,255,0.85)", marginTop: "0.6rem", lineHeight: 1.5 }}>{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<YhosincPortfolio />} />
          <Route path="/proyectos/:slug" element={<ProjectDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

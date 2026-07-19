export type SkillCategory = "programming" | "design" | "ai";

export type Skill = {
  id: string;
  level: number;
  category: SkillCategory;
  color: string;
  // Tags de ProjectMetadata (src/lib/projects.ts) que cuentan como evidencia
  // de este skill — clic en el orb de Skills lleva a /proyectos?skill=<id>,
  // que filtra por estos tags. Array vacío ("shipping": no es una tecnología
  // puntual, es velocidad de entrega en general) = sin filtro, muestra todos
  // los proyectos. Ajustar esta lista cuando se carguen proyectos reales con
  // otro vocabulario de tags.
  relatedTags: string[];
};

// Portado de v1 (portfolio-preview/src/App.jsx SKILLS) — mismos niveles ya
// publicados, ahora con categoría explícita para el filtro por disciplina
// que pidió el usuario. La rama "ai" queda con un solo skill (RESEARCH es
// lo único de v1 que se le acerca) — el usuario puede sumar skills de IA
// reales más adelante, no se inventan acá.
export const SKILLS: Skill[] = [
  { id: "frontend", level: 95, category: "programming", color: "#00f5ff", relatedTags: ["React", "Next.js", "TypeScript", "Vue"] },
  { id: "designSystems", level: 92, category: "design", color: "#ffe000", relatedTags: ["Design System", "Figma", "Identity"] },
  { id: "motion", level: 85, category: "design", color: "#ff2d55", relatedTags: ["Motion", "GSAP", "Animation"] },
  { id: "webgl", level: 78, category: "programming", color: "#00f5ff", relatedTags: ["Three.js", "WebGL", "R3F"] },
  { id: "backend", level: 82, category: "programming", color: "#ffe000", relatedTags: ["Node", "Postgres", "API"] },
  { id: "research", level: 74, category: "ai", color: "#ffffff", relatedTags: ["ML", "Research", "Data"] },
  { id: "prototyping", level: 90, category: "design", color: "#ff2d55", relatedTags: ["Figma", "Prototyping"] },
  { id: "shipping", level: 99, category: "programming", color: "#00f5ff", relatedTags: [] },
];

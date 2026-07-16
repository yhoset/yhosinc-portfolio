export type SkillCategory = "programming" | "design" | "ai";

export type Skill = {
  id: string;
  level: number;
  category: SkillCategory;
  color: string;
};

// Portado de v1 (portfolio-preview/src/App.jsx SKILLS) — mismos niveles ya
// publicados, ahora con categoría explícita para el filtro por disciplina
// que pidió el usuario. La rama "ai" queda con un solo skill (RESEARCH es
// lo único de v1 que se le acerca) — el usuario puede sumar skills de IA
// reales más adelante, no se inventan acá.
export const SKILLS: Skill[] = [
  { id: "frontend", level: 95, category: "programming", color: "#00f5ff" },
  { id: "designSystems", level: 92, category: "design", color: "#ffe000" },
  { id: "motion", level: 85, category: "design", color: "#ff2d55" },
  { id: "webgl", level: 78, category: "programming", color: "#00f5ff" },
  { id: "backend", level: 82, category: "programming", color: "#ffe000" },
  { id: "research", level: 74, category: "ai", color: "#ffffff" },
  { id: "prototyping", level: 90, category: "design", color: "#ff2d55" },
  { id: "shipping", level: 99, category: "programming", color: "#00f5ff" },
];

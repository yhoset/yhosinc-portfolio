export type RoadmapBranch = "programming" | "design" | "ai";
export type RoadmapLevel = "junior" | "mid" | "senior";
export type RoadmapStatus = "done" | "current" | "upcoming";

export type RoadmapNodeData = {
  id: string;
  branch: RoadmapBranch;
  level: RoadmapLevel;
  title: string;
  description: string;
  status: RoadmapStatus;
  /** Cuánto suma al Power Level al abrirse por primera vez en la sesión. */
  powerUp: number;
  /** IDs de nodos previos en la misma rama — dibuja la conexión entre ellos. */
  dependsOn?: string[];
};

// Todavía sin hitos reales (2026-07-15) — el usuario los va a mandar de a
// poco, igual que con los proyectos. Ver src/content/roadmap/README.md
// para el formato. No se inventan milestones/tecnologías acá.
export const ROADMAP_NODES: RoadmapNodeData[] = [];

export const BRANCH_COLOR: Record<RoadmapBranch, string> = {
  programming: "#00f5ff",
  design: "#ffe000",
  ai: "#ff2d55",
};

export const LEVEL_ORDER: RoadmapLevel[] = ["junior", "mid", "senior"];
export const BRANCH_ORDER: RoadmapBranch[] = ["programming", "design", "ai"];

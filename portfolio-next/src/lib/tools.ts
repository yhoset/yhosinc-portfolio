export type ToolId = "paleta" | "gradientes";

export type ToolMeta = {
  id: ToolId;
  color: string;
};

// Lista cerrada — la ruta /tools/[tool] solo renderiza estos slugs
// (generateStaticParams + dynamicParams=false), igual que /proyectos/[slug]
// con PROJECT_SLUGS. Nada de resolución dinámica de rutas por nombre libre.
export const TOOLS: ToolMeta[] = [
  { id: "paleta", color: "#00f5ff" },
  { id: "gradientes", color: "#ffe000" },
];

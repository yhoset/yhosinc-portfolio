export type ToolId =
  | "paleta"
  | "gradientes"
  | "escala-tipografica"
  | "sombra-comic"
  | "editor-de-easing"
  | "mangafy";

export type ToolMeta = {
  id: ToolId;
  color: string;
};

// Lista cerrada — la ruta /tools/[tool] solo renderiza estos slugs
// (generateStaticParams + dynamicParams=false). Nada de resolución dinámica
// de rutas por nombre libre.
export const TOOLS: ToolMeta[] = [
  { id: "paleta", color: "#00f5ff" },
  { id: "gradientes", color: "#ffe000" },
  { id: "escala-tipografica", color: "#ff2d55" },
  { id: "sombra-comic", color: "#00f5ff" },
  { id: "editor-de-easing", color: "#ffe000" },
  { id: "mangafy", color: "#ff2d55" },
];

"use client";

import dynamic from "next/dynamic";

// @xyflow/react es una librería pesada — se carga solo en esta página, no
// en el bundle inicial del sitio. Ver seguridad-y-optimizacion.md.
export const RoadmapCanvasLazy = dynamic(
  () => import("@/components/roadmap/roadmap-canvas").then((m) => m.RoadmapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-white/40">
        …
      </div>
    ),
  }
);

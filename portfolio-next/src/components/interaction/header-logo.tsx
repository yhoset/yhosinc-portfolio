"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/use-media-query";

// La escena R3F se carga solo si hace falta (lazy) — evita que three.js
// pese en el bundle inicial cuando el visitante cae en el fallback estático
// (touch o prefers-reduced-motion). Ver seguridad-y-optimizacion.md (reglas
// de performance 3D) y branding-y-filosofia.md §5.
const HeaderLogoScene = dynamic(
  () => import("@/components/interaction/header-logo-scene").then((m) => m.HeaderLogoScene),
  { ssr: false }
);

function StaticHeaderLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <polygon
        points="17,2 30,10 27,25 17,32 7,25 4,10"
        fill="#16161f"
        stroke="#00f5ff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="15" r="2" fill="#00f5ff" />
      <circle cx="12" cy="15" r="2" fill="#00f5ff" />
    </svg>
  );
}

export function HeaderLogo() {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const use3d = canHover && !reducedMotion;

  if (!use3d) {
    return <StaticHeaderLogo />;
  }

  return (
    <div className="size-[34px]" aria-hidden="true">
      <HeaderLogoScene />
    </div>
  );
}

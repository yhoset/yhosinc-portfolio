"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/use-media-query";

// Lazy: three.js/R3F no debe pesar en el bundle inicial para quien nunca
// llega a ver el fondo (reduced-motion). Ver seguridad-y-optimizacion.md.
const GameBackgroundScene = dynamic(
  () => import("@/components/interaction/game-background-scene").then((m) => m.GameBackgroundScene),
  { ssr: false }
);

function useDocumentVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return visible;
}

/**
 * Fondo 3D "modo juego" — persistente, detrás de todo el contenido,
 * reacciona al cursor con parallax. Ver branding-y-filosofia.md §1, §8, §10.
 *
 * Reglas de branding-y-filosofia.md §10 ("qué no hacer") aplicadas:
 * - Nunca tapa contenido: z-index negativo, pointer-events: none.
 * - Se apaga por completo (sin fallback estático) bajo prefers-reduced-motion
 *   o en touch — no hay nada que "degradar", simplemente no corre.
 * - Se pausa cuando la pestaña no está visible (ahorro de batería/CPU).
 */
export function GameBackground() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const documentVisible = useDocumentVisible();

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ visibility: documentVisible ? "visible" : "hidden" }}
    >
      {documentVisible && <GameBackgroundScene />}
    </div>
  );
}

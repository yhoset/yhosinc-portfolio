"use client";

import { motion } from "motion/react";

// Glyph decorativo para estados vacíos (el "?" de Proyectos/Roadmap) — antes
// era texto muerto: la pieza más grande de esas pantallas, sin vida alguna.
//
// will-change promueve el glyph a su propia capa de composición ANTES de
// animar. .chapter-num tiene -webkit-text-stroke + text-shadow (trazo
// grueso + sombra) — sin este hint, algunos navegadores repintan ese trazo
// en cada frame en vez de solo desplazar una capa ya compuesta, y el
// movimiento se siente "a tirones" en vez de fluido. El wobble sutil en
// rotate (combinado con el float en Y) sigue el mismo patrón que ya usa
// anim-float-lg en globals.css — un balanceo orgánico, no un rebote rígido.
export function FloatingGlyph({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.span
      className={className}
      style={{ ...style, willChange: "transform", display: "inline-block" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -10, 0], rotate: [0, -2, 0] }}
      transition={{
        opacity: { duration: 0.5 },
        y: { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
        rotate: { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
      }}
    >
      {children}
    </motion.span>
  );
}

"use client";

import { motion } from "motion/react";

// Glyph decorativo para estados vacíos (el "?" de Proyectos/Roadmap) — antes
// era texto muerto: la pieza más grande de esas pantallas, sin vida alguna.
export function FloatingGlyph({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.5 },
        y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
      }}
    >
      {children}
    </motion.span>
  );
}

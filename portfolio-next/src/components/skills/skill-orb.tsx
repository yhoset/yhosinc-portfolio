"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { Skill } from "@/lib/skills";

const CIRCUMFERENCE = 283; // 2πr para r=45, igual que v1
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function SkillOrb({
  skill,
  label,
  Icon,
  index,
}: {
  skill: Skill;
  label: string;
  Icon: LucideIcon;
  index: number;
}) {
  const offset = CIRCUMFERENCE - (skill.level / 100) * CIRCUMFERENCE;
  const delay = index * 0.08;

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileFocus={{ y: -4 }}
      transition={{ duration: 0.4, delay, ease: EASE_OUT }}
      tabIndex={0}
      role="group"
      aria-label={`${label} ${skill.level}%`}
    >
      <div className="relative w-full max-w-[140px] aspect-square">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="45" fill="#111118" stroke="#0a0a0f" strokeWidth="5" />
          {/* El anillo se llena desde 0 hasta el nivel real — antes aparecía
              ya completo, sin transmitir ningún progreso. */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={skill.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, delay: delay + 0.15, ease: EASE_OUT }}
            style={{ filter: `drop-shadow(0 0 6px ${skill.color}aa)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <Icon size={26} strokeWidth={2.5} color={skill.color} />
          <div className="font-display text-xl leading-none text-white">{skill.level}</div>
        </div>
      </div>
      <div className="font-label text-center text-sm tracking-wider text-white">{label}</div>
    </motion.div>
  );
}

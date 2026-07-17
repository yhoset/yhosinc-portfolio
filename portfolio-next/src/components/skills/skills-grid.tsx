"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Code2,
  Palette,
  Film,
  Box,
  Cpu,
  Search,
  PenTool,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { SKILLS, type SkillCategory } from "@/lib/skills";
import { SkillOrb } from "@/components/skills/skill-orb";

const ICONS: Record<string, LucideIcon> = {
  frontend: Code2,
  designSystems: Palette,
  motion: Film,
  webgl: Box,
  backend: Cpu,
  research: Search,
  prototyping: PenTool,
  shipping: Rocket,
};

const FILTERS: Array<{ key: "all" | SkillCategory }> = [
  { key: "all" },
  { key: "programming" },
  { key: "design" },
  { key: "ai" },
];

export function SkillsGrid() {
  const t = useTranslations("Skills");
  const [active, setActive] = useState<"all" | SkillCategory>("all");

  const visible = SKILLS.filter((s) => active === "all" || s.category === active);

  return (
    <div>
      <div
        role="group"
        aria-label={t("filterLabel")}
        className="mb-10 flex flex-wrap justify-center gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            aria-pressed={active === f.key}
            className={
              active === f.key
                ? "font-label rounded-full border-2 border-cyan bg-cyan px-4 py-1.5 text-sm tracking-wider text-ink transition-colors duration-150"
                : "font-label rounded-full border-2 border-white/30 px-4 py-1.5 text-sm tracking-wider text-white/70 transition-colors duration-150 hover:border-cyan hover:text-cyan"
            }
          >
            {t(`filters.${f.key}`)}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((skill, i) => (
          <SkillOrb
            key={skill.id}
            skill={skill}
            label={t(`names.${skill.id}`)}
            Icon={ICONS[skill.id]}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

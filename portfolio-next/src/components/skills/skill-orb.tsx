import type { LucideIcon } from "lucide-react";
import type { Skill } from "@/lib/skills";

const CIRCUMFERENCE = 283; // 2πr para r=45, igual que v1

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

  return (
    <div
      className="flex flex-col items-center gap-2 opacity-0"
      style={{
        animation: `anim-pop-in 500ms ease-out ${index * 80}ms forwards`,
      }}
      tabIndex={0}
      role="group"
      aria-label={`${label} ${skill.level}%`}
    >
      <div className="relative w-full max-w-[140px] aspect-square">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="45" fill="#111118" stroke="#0a0a0f" strokeWidth="5" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={skill.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${skill.color}aa)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <Icon size={26} strokeWidth={2.5} color={skill.color} />
          <div className="font-display text-xl leading-none text-white">{skill.level}</div>
        </div>
      </div>
      <div className="font-label text-center text-sm tracking-wider text-white">{label}</div>
    </div>
  );
}

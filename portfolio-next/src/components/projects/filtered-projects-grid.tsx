"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { SKILLS } from "@/lib/skills";
import type { ProjectMetadata } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/project-card";

// Llega acá desde un click en un orb de /skills (?skill=<id>) — filtra por
// los relatedTags de ese skill. Un skill sin relatedTags (ej. "shipping",
// que no es una tecnología puntual) no filtra nada, muestra todo. Un
// ?skill= inválido o ausente tampoco filtra — nunca rompe la grilla.
export function FilteredProjectsGrid({
  projects,
}: {
  projects: Array<ProjectMetadata & { slug: string }>;
}) {
  const t = useTranslations("Projects");
  const tSkills = useTranslations("Skills");
  const searchParams = useSearchParams();
  const skillId = searchParams.get("skill");
  const skill = SKILLS.find((s) => s.id === skillId);

  const visible =
    skill && skill.relatedTags.length > 0
      ? projects.filter((p) => p.tags.some((tag) => skill.relatedTags.includes(tag)))
      : projects;

  return (
    <>
      {skill && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span
            className="font-label rounded-full border-2 px-3 py-1 text-xs tracking-wider"
            style={{ borderColor: skill.color, color: skill.color }}
          >
            {t("filteredBy", { skill: tSkills(`names.${skill.id}`) })}
          </span>
          <Link
            href="/proyectos"
            className="font-label inline-flex items-center gap-1 text-xs tracking-wide text-white/50 transition-colors hover:text-white/80"
          >
            <X size={12} /> {t("clearFilter")}
          </Link>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-16 text-center text-white/60">{t("emptyFilteredBody")}</p>
      ) : (
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {visible.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              chapter={String(i + 1).padStart(2, "0")}
            />
          ))}
        </div>
      )}
    </>
  );
}

import { Link } from "@/i18n/navigation";
import type { ProjectMetadata } from "@/lib/projects";

const CATEGORY_COLOR: Record<ProjectMetadata["category"], string> = {
  WEB: "#00f5ff",
  DESIGN: "#ffe000",
  DEV: "#ff2d55",
  RESEARCH: "#ffffff",
};

const SIZE_CLASS: Record<ProjectMetadata["size"], string> = {
  lg: "aspect-[4/3]",
  md: "aspect-[4/3.4]",
  sm: "aspect-square",
};

export function ProjectCard({
  project,
  chapter,
}: {
  project: ProjectMetadata & { slug: string };
  chapter: string;
}) {
  const color = CATEGORY_COLOR[project.category];

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className="group mb-6 block break-inside-avoid"
    >
      <div className={`panel-3d halftone-panel relative overflow-hidden p-5 transition-transform duration-150 group-hover:-translate-y-1 group-hover:-translate-x-1 ${SIZE_CLASS[project.size]}`}>
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="chapter-num text-3xl sm:text-4xl" style={{ color }}>
              {chapter}
            </span>
            <span
              className="font-mono rounded-full border-2 px-2 py-0.5 text-[10px] tracking-widest"
              style={{ borderColor: color, color }}
            >
              {project.category}
            </span>
          </div>

          <div>
            <h3 className="font-display text-2xl text-white sm:text-3xl">{project.title}</h3>
            <p className="font-label mt-1 text-sm tracking-wide text-white/60">
              {project.tagline}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-white/70">{project.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

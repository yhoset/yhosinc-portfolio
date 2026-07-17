import { Link } from "@/i18n/navigation";
import type { ToolId } from "@/lib/tools";

export function ToolCard({
  id,
  color,
  title,
  description,
}: {
  id: ToolId;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={`/tools/${id}`} className="group block">
      <div
        className="panel-3d flex h-full flex-col gap-2 p-5 transition-transform duration-150 group-hover:-translate-y-1 group-hover:-translate-x-1"
        style={{ boxShadow: `4px 4px 0px var(--color-ink), 8px 8px 0px ${color}59` }}
      >
        <h3 className="font-display text-xl text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/70">{description}</p>
      </div>
    </Link>
  );
}

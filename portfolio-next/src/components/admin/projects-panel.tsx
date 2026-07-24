"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectForEdit,
} from "@/server/actions/projects";
import { ProjectForm, type ProjectFormValues } from "@/components/admin/project-form";

type ProjectRow = {
  id: number;
  slug: string;
  category: string;
  size: string;
  tags: string[];
  link: string | null;
  es: { title: string } | null;
  en: { title: string } | null;
};

type Mode = { kind: "list" } | { kind: "create" } | { kind: "edit"; values: ProjectFormValues };

export function ProjectsPanel({ initialProjects }: { initialProjects: ProjectRow[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [loadingEditId, setLoadingEditId] = useState<number | null>(null);
  const [deletingId, startDeleteTransition] = useTransition();

  const refresh = () => {
    // Server Action ya escribió en la DB — recargamos la lista completa
    // (más simple y correcto que reconciliar el estado local a mano,
    // y esta lista nunca es tan grande como para que importe el costo).
    window.location.reload();
  };

  const startEdit = async (id: number) => {
    setLoadingEditId(id);
    const project = await getProjectForEdit(id);
    setLoadingEditId(null);
    if (!project) return;
    setMode({
      kind: "edit",
      values: {
        slug: project.slug,
        category: project.category,
        size: project.size,
        tags: project.tags,
        link: project.link,
        es: project.es ? { ...project.es } : null,
        en: project.en ? { ...project.en } : null,
      },
    });
  };

  const remove = (id: number) => {
    if (!window.confirm("¿Borrar este proyecto? No se puede deshacer.")) return;
    startDeleteTransition(async () => {
      await deleteProject(id);
      setProjects((ps) => ps.filter((p) => p.id !== id));
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-sm font-bold tracking-[0.15em] text-cyan">
          {"// PROYECTOS"} ({projects.length})
        </h2>
        {mode.kind === "list" && (
          <button
            type="button"
            onClick={() => setMode({ kind: "create" })}
            className="btn-manga cyan px-3.5 py-1.5 text-sm"
          >
            <Plus size={16} strokeWidth={3} /> NUEVO
          </button>
        )}
      </div>

      {mode.kind === "create" && (
        <ProjectForm action={createProject} onSuccess={refresh} onCancel={() => setMode({ kind: "list" })} />
      )}

      {mode.kind === "edit" && (
        <EditForm
          key={mode.values.slug}
          values={mode.values}
          onSuccess={refresh}
          onCancel={() => setMode({ kind: "list" })}
          projectId={projects.find((p) => p.slug === mode.values.slug)?.id ?? -1}
        />
      )}

      {mode.kind === "list" &&
        (projects.length === 0 ? (
          <p className="text-white/60">Todavía no hay proyectos cargados.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <div key={p.id} className="panel-3d flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label text-white">{p.es?.title ?? p.en?.title ?? p.slug}</span>
                    <span className="font-mono text-xs text-white/50">/{p.slug}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <span className="tag-pill">{p.category}</span>
                    {p.tags.map((t) => (
                      <span key={t} className="tag-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(p.id)}
                    disabled={loadingEditId === p.id}
                    className="btn-manga px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Pencil size={14} /> {loadingEditId === p.id ? "..." : "EDITAR"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    disabled={deletingId}
                    className="btn-manga red px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={14} /> BORRAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

// Componente aparte porque necesita el `id` del proyecto para atar
// (bind) updateProject antes de pasarlo a useActionState — hacer el bind
// dentro del render del padre en cada mode.kind==="edit" recrearía la
// función atada en cada render y perdería el estado interno del form.
function EditForm({
  projectId,
  values,
  onSuccess,
  onCancel,
}: {
  projectId: number;
  values: ProjectFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const boundAction = updateProject.bind(null, projectId);
  return <ProjectForm action={boundAction} initialValues={values} onSuccess={onSuccess} onCancel={onCancel} />;
}

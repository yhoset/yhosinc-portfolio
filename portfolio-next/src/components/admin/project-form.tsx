"use client";

import { useActionState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import type { ProjectFormState } from "@/server/actions/projects";

const initialState: ProjectFormState = { ok: false };

const CATEGORIES = ["WEB", "DESIGN", "DEV", "RESEARCH"] as const;
const SIZES = ["lg", "md", "sm"] as const;

export type ProjectFormValues = {
  slug: string;
  category: string;
  size: string;
  tags: string[];
  link: string | null;
  es: { title: string; tagline: string; blurb: string; content: string } | null;
  en: { title: string; tagline: string; blurb: string; content: string } | null;
};

// Un solo componente para crear y editar — `action` ya viene atada (bind)
// al id correspondiente para updateProject, o sin atar para createProject;
// useActionState no distingue entre las dos formas, solo necesita que la
// firma final sea (prevState, formData) => Promise<ProjectFormState>.
export function ProjectForm({
  action,
  initialValues,
  onSuccess,
  onCancel,
}: {
  action: (prevState: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  initialValues?: ProjectFormValues;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.ok) onSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onSuccess no debe re-disparar el efecto en cada render del padre
  }, [state.ok]);

  const fieldError = (key: string) => state.fieldErrors?.[key];

  return (
    <form action={formAction} className="panel-3d flex flex-col gap-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="SLUG" error={fieldError("slug")}>
          <input
            name="slug"
            defaultValue={initialValues?.slug}
            required
            placeholder="mi-proyecto"
            className="field-manga font-mono"
          />
        </Field>
        <Field label="LINK (opcional)" error={fieldError("link")}>
          <input
            name="link"
            type="text"
            defaultValue={initialValues?.link ?? ""}
            placeholder="https://..."
            className="field-manga"
          />
        </Field>
        <Field label="CATEGORÍA" error={fieldError("category")}>
          <select name="category" defaultValue={initialValues?.category ?? "WEB"} className="field-manga">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="TAMAÑO EN LA GRILLA" error={fieldError("size")}>
          <select name="size" defaultValue={initialValues?.size ?? "md"} className="field-manga">
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="TAGS (separados por coma)" error={fieldError("tags")}>
        <input
          name="tags"
          defaultValue={initialValues?.tags.join(", ")}
          placeholder="React, Next.js, TypeScript"
          className="field-manga"
        />
      </Field>

      <LocaleFields locale="es" label="ESPAÑOL" values={initialValues?.es} fieldError={fieldError} />
      <LocaleFields locale="en" label="ENGLISH" values={initialValues?.en} fieldError={fieldError} />

      {state.error && (
        <p role="alert" className="text-sm text-red">
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-manga cyan justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "GUARDANDO..." : "GUARDAR"} <ArrowRight size={16} strokeWidth={3} />
        </button>
        <button type="button" onClick={onCancel} className="btn-manga justify-center">
          CANCELAR
        </button>
      </div>
    </form>
  );
}

function LocaleFields({
  locale,
  label,
  values,
  fieldError,
}: {
  locale: "es" | "en";
  label: string;
  values?: { title: string; tagline: string; blurb: string; content: string } | null;
  fieldError: (key: string) => string | undefined;
}) {
  return (
    <fieldset className="rounded-[var(--radius-cartoon)] border-2 border-white/10 p-3">
      <legend className="font-mono px-1 text-xs tracking-widest text-white/60">{label}</legend>
      <div className="flex flex-col gap-3">
        <Field label="Título" error={fieldError(`${locale}.title`)}>
          <input name={`title_${locale}`} defaultValue={values?.title} required className="field-manga" />
        </Field>
        <Field label="Tagline" error={fieldError(`${locale}.tagline`)}>
          <input name={`tagline_${locale}`} defaultValue={values?.tagline} required className="field-manga" />
        </Field>
        <Field label="Descripción corta (grilla)" error={fieldError(`${locale}.blurb`)}>
          <textarea
            name={`blurb_${locale}`}
            defaultValue={values?.blurb}
            required
            rows={2}
            className="field-manga resize-y"
          />
        </Field>
        <Field label="Contenido (Markdown)" error={fieldError(`${locale}.content`)}>
          <textarea
            name={`content_${locale}`}
            defaultValue={values?.content}
            required
            rows={8}
            className="field-manga resize-y font-mono text-sm"
          />
        </Field>
      </div>
    </fieldset>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-mono mb-1 block text-xs tracking-widest text-white/60">{label}</label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red">
          {error}
        </p>
      )}
    </div>
  );
}

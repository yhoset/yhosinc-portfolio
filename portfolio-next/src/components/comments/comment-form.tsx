"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Send } from "lucide-react";
import { createComment, type CommentState } from "@/server/actions/comments";

const initialState: CommentState = { ok: false };

export function CommentForm({ projectSlug }: { projectSlug: string }) {
  const t = useTranslations("Comments");
  const [state, formAction, isPending] = useActionState(createComment, initialState);

  if (state.ok) {
    return (
      <div className="panel-3d flex flex-col items-center gap-2 p-6 text-center">
        <CheckCircle2 size={32} strokeWidth={2.5} className="text-cyan" />
        <h3 className="font-display text-xl text-white">{t("successTitle")}</h3>
        <p className="text-white/70">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3" noValidate>
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <textarea
        name="content"
        required
        maxLength={1000}
        rows={4}
        placeholder={t("placeholder")}
        className="field-manga resize-y"
      />
      {state.errorCode && (
        <p role="alert" className="text-sm text-red">
          {t(`errors.${state.errorCode}`)}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="btn-manga cyan self-start disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? t("submitting") : t("submit")} <Send size={16} strokeWidth={3} />
      </button>
    </form>
  );
}

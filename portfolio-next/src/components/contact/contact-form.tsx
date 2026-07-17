"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Send } from "lucide-react";
import { submitContactMessage, type ContactFormState } from "@/server/actions/contact";

const initialState: ContactFormState = { ok: false };
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function ContactForm() {
  const t = useTranslations("Contact");
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="font-mono mb-3 text-center text-sm font-bold tracking-[0.2em] text-cyan">
        {t("eyebrow")}
      </p>
      <h1 className="section-title-panel mx-auto mb-4 block w-fit" style={{ background: "#ffffff" }}>
        {t("title")}
      </h1>
      <p className="mb-8 text-center text-white/70">{t("body")}</p>

      <AnimatePresence mode="wait">
        {state.ok ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="panel-3d flex flex-col items-center gap-3 p-8 text-center"
          >
            <CheckCircle2 size={40} strokeWidth={2.5} className="text-cyan" />
            <h2 className="font-display text-2xl text-white">{t("successTitle")}</h2>
            <p className="text-white/70">{t("successBody")}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={formAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
            noValidate
          >
            <div>
              <label htmlFor="name" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
                {t("nameLabel")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                aria-invalid={!!state.fieldErrors?.name}
                className="field-manga"
              />
              {state.fieldErrors?.name && (
                <p className="mt-1 text-xs text-red">{t(`errors.${state.fieldErrors.name}`)}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
                {t("emailLabel")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                aria-invalid={!!state.fieldErrors?.email}
                className="field-manga"
              />
              {state.fieldErrors?.email && (
                <p className="mt-1 text-xs text-red">{t(`errors.${state.fieldErrors.email}`)}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
                {t("messageLabel")}
              </label>
              <textarea
                id="message"
                name="message"
                required
                maxLength={2000}
                rows={5}
                aria-invalid={!!state.fieldErrors?.message}
                className="field-manga resize-none"
              />
              {state.fieldErrors?.message && (
                <p className="mt-1 text-xs text-red">{t(`errors.${state.fieldErrors.message}`)}</p>
              )}
            </div>

            {state.errorCode && !state.fieldErrors && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red"
                role="alert"
              >
                {t(`errors.${state.errorCode}`)}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="btn-manga cyan mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? t("submitting") : t("submit")} <Send size={18} strokeWidth={3} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

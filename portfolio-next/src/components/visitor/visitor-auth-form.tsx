"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { registerVisitor, loginVisitor, type VisitorAuthState } from "@/server/actions/visitor";

const initialState: VisitorAuthState = { ok: false };

export function VisitorAuthForm() {
  const t = useTranslations("VisitorAuth");
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");

  const [loginState, loginAction, loginPending] = useActionState(loginVisitor, initialState);
  const [registerState, registerAction, registerPending] = useActionState(registerVisitor, initialState);

  // loginVisitor/registerVisitor setean la cookie de sesión del lado
  // server — refrescamos para que account/page.tsx (server component)
  // vuelva a leerla y muestre el estado logueado.
  useEffect(() => {
    if (loginState.ok || registerState.ok) router.refresh();
  }, [loginState.ok, registerState.ok, router]);

  const fieldError = (state: VisitorAuthState, field: "name" | "email" | "password") => {
    const code = state.fieldErrors?.[field];
    return code ? t(`errors.${code}`) : undefined;
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <p className="mb-6 text-center text-white/70">{t("why")}</p>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`btn-manga flex-1 justify-center ${tab === "login" ? "cyan" : ""}`}
        >
          {t("loginTab")}
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`btn-manga flex-1 justify-center ${tab === "register" ? "cyan" : ""}`}
        >
          {t("registerTab")}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "login" ? (
          <motion.form
            key="login"
            action={loginAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="panel-3d flex flex-col gap-4 p-6"
            noValidate
          >
            <Field label={t("emailLabel")}>
              <input name="email" type="email" required autoComplete="email" className="field-manga" />
            </Field>
            <Field label={t("passwordLabel")}>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="field-manga"
              />
            </Field>
            {loginState.errorCode && (
              <p role="alert" className="text-sm text-red">
                {t(`errors.${loginState.errorCode}`)}
              </p>
            )}
            <button
              type="submit"
              disabled={loginPending}
              className="btn-manga cyan justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginPending ? t("loginSubmitting") : t("loginSubmit")} <ArrowRight size={16} strokeWidth={3} />
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="register"
            action={registerAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="panel-3d flex flex-col gap-4 p-6"
            noValidate
          >
            <Field label={t("nameLabel")} error={fieldError(registerState, "name")}>
              <input name="name" type="text" required maxLength={100} autoComplete="name" className="field-manga" />
            </Field>
            <Field label={t("emailLabel")} error={fieldError(registerState, "email")}>
              <input
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                className="field-manga"
              />
            </Field>
            <Field label={t("passwordLabel")} error={fieldError(registerState, "password")}>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={200}
                autoComplete="new-password"
                className="field-manga"
              />
            </Field>
            {registerState.errorCode && !registerState.fieldErrors && (
              <p role="alert" className="text-sm text-red">
                {t(`errors.${registerState.errorCode}`)}
              </p>
            )}
            <button
              type="submit"
              disabled={registerPending}
              className="btn-manga cyan justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registerPending ? t("registerSubmitting") : t("registerSubmit")}{" "}
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-label mb-1.5 block text-xs tracking-widest text-white/60">{label}</label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red">
          {error}
        </p>
      )}
    </div>
  );
}

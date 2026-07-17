"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { loginAdmin, type AdminLoginState } from "@/server/actions/auth";

const initialState: AdminLoginState = { ok: false };

export function AdminLoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  // loginAdmin setea la cookie de sesión del lado server — refrescamos para
  // que admin/page.tsx (server component) vuelva a leerla y renderice el
  // dashboard en vez del form.
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-6">
      <div className="panel-3d w-full max-w-sm p-8">
        <h1 className="font-display mb-6 text-2xl text-white">ACCESO ADMIN</h1>
        <form action={formAction} className="flex flex-col gap-3" noValidate>
          <div>
            <label htmlFor="email" className="font-mono mb-1 block text-xs tracking-widest text-white/60">
              EMAIL
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className="field-manga" />
          </div>
          <div>
            <label htmlFor="password" className="font-mono mb-1 block text-xs tracking-widest text-white/60">
              CONTRASEÑA
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field-manga"
            />
          </div>
          {state.error && (
            <p role="alert" className="text-sm text-red">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="btn-manga red mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "ENTRANDO..." : "ENTRAR"} <ArrowRight size={18} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
}

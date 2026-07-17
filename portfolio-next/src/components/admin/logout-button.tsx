"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logoutAdmin } from "@/server/actions/auth";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn-manga disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await logoutAdmin();
          router.refresh();
        })
      }
    >
      CERRAR SESIÓN
    </button>
  );
}

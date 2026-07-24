"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { logoutVisitor } from "@/server/actions/visitor";

export function LogoutVisitorButton() {
  const t = useTranslations("VisitorAuth");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn-manga disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await logoutVisitor();
          router.refresh();
        })
      }
    >
      {t("logout")}
    </button>
  );
}

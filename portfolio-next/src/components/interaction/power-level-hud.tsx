"use client";

import { useTranslations } from "next-intl";
import { usePowerLevel } from "@/components/interaction/power-level-context";

export function PowerLevelHUD() {
  const { level, events } = usePowerLevel();
  const t = useTranslations("PowerLevel");

  return (
    <div className="pointer-events-none fixed right-3 bottom-3 z-40 flex flex-col items-end gap-2 sm:right-4 sm:bottom-4">
      {events.map((evt) => (
        <div
          key={evt.id}
          role="status"
          className="power-up-toast pointer-events-auto max-w-64 rounded-sm border border-cyan/40 bg-panel-bg px-3 py-2 text-right text-xs text-white/90 shadow-lg"
        >
          <p>{evt.message}</p>
          <p className="font-label tracking-widest text-yellow">+{evt.amount} PWR</p>
        </div>
      ))}

      <div
        aria-label={t("label")}
        className="pointer-events-auto rounded-sm border border-cyan/30 bg-panel-bg/90 px-3 py-1.5 text-right backdrop-blur-sm"
      >
        <p className="font-label text-[10px] tracking-[0.2em] text-white/50">
          {t("label")}
        </p>
        <p className="font-display text-xl leading-none text-cyan">
          {level.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

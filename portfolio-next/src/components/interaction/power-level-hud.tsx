"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import NumberFlow from "@number-flow/react";
import { usePowerLevel } from "@/components/interaction/power-level-context";

export function PowerLevelHUD() {
  const { level, events } = usePowerLevel();
  const t = useTranslations("PowerLevel");

  return (
    <div className="pointer-events-none fixed right-3 bottom-3 z-40 flex flex-col items-end gap-2 sm:right-4 sm:bottom-4">
      <AnimatePresence>
        {events.map((evt) => (
          <motion.div
            key={evt.id}
            role="status"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="pointer-events-auto max-w-64 rounded-sm border border-cyan/40 bg-panel-bg px-3 py-2 text-right text-xs text-white/90 shadow-lg"
          >
            <p>{evt.message}</p>
            <p className="font-label tracking-widest text-yellow">+{evt.amount} PWR</p>
          </motion.div>
        ))}
      </AnimatePresence>

      <div
        aria-label={t("label")}
        className="pointer-events-auto rounded-sm border border-cyan/30 bg-panel-bg/90 px-3 py-1.5 text-right backdrop-blur-sm"
      >
        <p className="font-label text-[10px] tracking-[0.2em] text-white/50">
          {t("label")}
        </p>
        <NumberFlow
          value={level}
          className="font-display text-xl leading-none text-cyan"
          transformTiming={{ duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          spinTiming={{ duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </div>
    </div>
  );
}

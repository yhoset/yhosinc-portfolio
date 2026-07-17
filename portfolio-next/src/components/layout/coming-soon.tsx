"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export function ComingSoon({
  messageKey,
}: {
  messageKey: "tools" | "about";
}) {
  const t = useTranslations("ComingSoon");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-32 text-center"
    >
      <h1 className="font-display text-4xl text-cyan sm:text-5xl">
        {t(`${messageKey}.title`)}
      </h1>
      <p className="text-white/60">{t(`${messageKey}.body`)}</p>
    </motion.div>
  );
}

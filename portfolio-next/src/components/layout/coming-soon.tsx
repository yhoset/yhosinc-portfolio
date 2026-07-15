import { useTranslations } from "next-intl";

export function ComingSoon({
  messageKey,
}: {
  messageKey: "projects" | "skills" | "roadmap" | "tools" | "about" | "contact";
}) {
  const t = useTranslations("ComingSoon");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-32 text-center">
      <h1 className="font-display text-4xl text-cyan sm:text-5xl">
        {t(`${messageKey}.title`)}
      </h1>
      <p className="text-white/60">{t(`${messageKey}.body`)}</p>
    </div>
  );
}

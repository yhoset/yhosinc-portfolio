import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border/60 bg-ink"
      style={{ viewTransitionName: "site-footer" } as React.CSSProperties}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-white/50 sm:px-6">
        <p className="font-label tracking-wider text-cyan/80">
          {t("tagline")}
        </p>
        <p>
          © {year} YHOSINC. {t("rights")}
        </p>
      </div>
    </footer>
  );
}

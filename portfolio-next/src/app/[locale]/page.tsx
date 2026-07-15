import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ArrowDown, Mail } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { OrbitingGeom } from "@/components/decor/orbiting-geom";
import { SpeedBurst } from "@/components/decor/speed-burst";
import { HeaderLogo } from "@/components/interaction/header-logo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Home />;
}

function Stat({
  value,
  colorClass,
  label,
}: {
  value: string;
  colorClass: string;
  label: string;
}) {
  return (
    <div>
      <div className={`font-display text-4xl leading-none ${colorClass}`}>{value}</div>
      <div className="font-mono mt-1 text-xs tracking-[0.12em] text-white/60">{label}</div>
    </div>
  );
}

function Home() {
  const t = useTranslations("HomePage");

  return (
    <section className="halftone-bg relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div aria-hidden="true" className="cursor-spotlight" />
      <OrbitingGeom />

      <div className="relative z-[2] mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        {/* Texto */}
        <div className="load-hero-text">
          <div className="font-mono mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/60 bg-white/5 px-4 py-1.5 text-xs font-bold text-cyan">
            <span className="anim-pulse-glow inline-block h-2 w-2 rounded-full bg-red" />
            {t("badge")}
          </div>

          <h1 className="hero-title">YHOSINC</h1>

          <p className="font-label mt-5 max-w-[34ch] text-xl leading-tight tracking-wide text-white sm:text-2xl">
            {t("subtitlePrefix")}
            <span className="text-cyan">{t("subtitleShipping")}</span>
            {t("subtitleMid")}
            <span className="text-yellow">{t("subtitleInk")}</span>
            {t("subtitleEnd")}
          </p>

          <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-white/75">
            {t("body")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/proyectos" className="btn-manga cyan">
              {t("seeWork")} <ArrowDown size={18} strokeWidth={3} />
            </Link>
            <Link href="/contacto" className="btn-manga">
              {t("getInTouch")} <Mail size={18} strokeWidth={3} />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-8">
            <Stat value="47+" colorClass="text-cyan" label={t("statProjects")} />
            <Stat value="6YR" colorClass="text-yellow" label={t("statYears")} />
            <Stat value="∞" colorClass="text-red" label={t("statCoffee")} />
          </div>
        </div>

        {/* Personaje 3D */}
        <div className="load-hero-vis relative flex items-center justify-center">
          <div className="anim-float-lg relative aspect-[4/5] w-full max-w-[420px]">
            <div className="anim-spin-slow absolute -inset-[10%] opacity-50">
              <SpeedBurst color="#00f5ff" strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 z-[2] flex items-center justify-center">
              <HeaderLogo size={260} />
            </div>
            <div
              className="font-display absolute top-[8%] -right-[2%] z-[3] rotate-[8deg] border-[3px] border-ink bg-yellow px-3 py-1.5 text-2xl tracking-wide text-ink"
              style={{ boxShadow: "4px 4px 0 var(--color-ink)" }}
            >
              POW!
            </div>
            <div
              className="font-display absolute bottom-[5%] -left-[3%] z-[3] rotate-[-6deg] border-[3px] border-ink bg-red px-3 py-1.5 text-xl tracking-wide text-white"
              style={{ boxShadow: "4px 4px 0 var(--color-ink)" }}
            >
              {t("codeInk")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

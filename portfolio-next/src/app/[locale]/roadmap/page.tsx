import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { RoadmapCanvasLazy } from "@/components/roadmap/roadmap-canvas-lazy";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RoadmapCanvasLazy />;
}

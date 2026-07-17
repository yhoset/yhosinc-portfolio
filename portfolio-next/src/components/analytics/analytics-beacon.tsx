"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { trackEvent } from "@/server/actions/analytics";

// Un pageview por navegación real (cambio de pathname) — montado una sola
// vez en el layout raíz, no en cada página, para no depender de que cada
// página nueva se acuerde de trackear su propia visita.
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("pageview");
  }, [pathname]);

  return null;
}

import { useSyncExternalStore } from "react";

// SSR-safe: snapshot en servidor es siempre `false` (el fallback estático es
// la opción segura por defecto), se corrige apenas hidrata en el cliente.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

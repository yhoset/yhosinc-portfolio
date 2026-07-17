"use client";

import { useCallback, useState } from "react";

// Compartido entre los tools que copian algo al portapapeles (paleta de
// colores, CSS de gradiente) — centraliza el manejo de error: sin el
// .catch(), un writeText() rechazado (permisos, contexto no seguro, browser
// sin soporte) fallaba en silencio: el usuario hacía clic y no pasaba nada
// visible, sin ningún indicio de qué salió mal.
export function useCopyToClipboard(resetAfterMs = 1500) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(
        () => {
          setError(false);
          setCopiedValue(text);
          setTimeout(() => setCopiedValue((c) => (c === text ? null : c)), resetAfterMs);
        },
        (err) => {
          console.error("No se pudo copiar al portapapeles:", err);
          setError(true);
        }
      );
    },
    [resetAfterMs]
  );

  return { copiedValue, copy, error };
}

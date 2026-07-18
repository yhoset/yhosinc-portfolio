import { ImageResponse } from "next/og";

// Imagen OG única para todo el sitio (no por locale): "Ink & code" es la
// única frase de marca que aparece tal cual en ambos idiomas (ver
// Footer.tagline en messages/es.json y en.json), así que sirve de subtítulo
// sin tener que elegir un idioma para una imagen que no sabe en qué locale
// se va a compartir.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div
            style={{
              width: 110,
              height: 110,
              background: "#16161f",
              border: "4px solid #00f5ff",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-6deg)",
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ width: 16, height: 16, borderRadius: 999, background: "#00f5ff" }} />
              <div style={{ width: 16, height: 16, borderRadius: 999, background: "#00f5ff" }} />
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 104, color: "#00f5ff", letterSpacing: 2 }}>
            YHOSINC
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#ffffff", opacity: 0.75, marginTop: 28 }}>
          Ink & code
        </div>
      </div>
    ),
    { ...size }
  );
}

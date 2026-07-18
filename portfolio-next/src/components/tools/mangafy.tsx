"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Upload, Download, Wand2 } from "lucide-react";

// Downscale antes de procesar — Sobel + halftone son O(ancho×alto), y una
// foto de cámara moderna (4000×3000) tardaría segundos y trabaría el hilo
// principal. 720px de lado más largo alcanza para un resultado nítido y
// mantiene el procesamiento por debajo de ~150ms en la mayoría de equipos.
const MAX_DIMENSION = 720;
const DOT_CELL = 6; // tamaño de celda del tramado halftone, en px

function toGrayscale(data: Uint8ClampedArray): Float32Array {
  const gray = new Float32Array(data.length / 4);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    // Luminancia perceptual (Rec. 601) — no un promedio simple de RGB.
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return gray;
}

function sobelEdges(gray: Float32Array, width: number, height: number, threshold: number): Uint8Array {
  const edges = new Uint8Array(width * height);
  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sx = 0;
      let sy = 0;
      let k = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const val = gray[(y + dy) * width + (x + dx)];
          sx += gx[k] * val;
          sy += gy[k] * val;
          k++;
        }
      }
      const magnitude = Math.sqrt(sx * sx + sy * sy);
      edges[y * width + x] = magnitude > threshold ? 1 : 0;
    }
  }
  return edges;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function renderMangafy(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  width: number,
  height: number,
  options: { dotIntensity: number; edgeThreshold: number; inkColor: string }
) {
  const gray = toGrayscale(imageData.data);
  const edges = sobelEdges(gray, width, height, options.edgeThreshold);
  const [ir, ig, ib] = hexToRgb(options.inkColor);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Tramado halftone: en cada celda, el radio del punto es proporcional a
  // qué tan oscura es esa zona de la imagen — la misma técnica de impresión
  // que ya usan .halftone-bg/.halftone-panel en el sitio, acá aplicada de
  // verdad sobre los píxeles de la foto en vez de ser un patrón fijo.
  ctx.fillStyle = options.inkColor;
  for (let y = 0; y < height; y += DOT_CELL) {
    for (let x = 0; x < width; x += DOT_CELL) {
      let sum = 0;
      let count = 0;
      for (let dy = 0; dy < DOT_CELL && y + dy < height; dy++) {
        for (let dx = 0; dx < DOT_CELL && x + dx < width; dx++) {
          sum += gray[(y + dy) * width + (x + dx)];
          count++;
        }
      }
      const avgLuminance = sum / count;
      const darkness = 1 - avgLuminance / 255;
      const radius = (DOT_CELL / 2) * Math.sqrt(darkness) * options.dotIntensity;
      if (radius > 0.35) {
        ctx.beginPath();
        ctx.arc(x + DOT_CELL / 2, y + DOT_CELL / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Contornos de tinta encima del tramado.
  const outFrame = ctx.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (edges[y * width + x]) {
        const idx = (y * width + x) * 4;
        outFrame.data[idx] = ir;
        outFrame.data[idx + 1] = ig;
        outFrame.data[idx + 2] = ib;
        outFrame.data[idx + 3] = 255;
      }
    }
  }
  ctx.putImageData(outFrame, 0, 0);
}

export function Mangafy() {
  const t = useTranslations("Tools.mangafyTool");
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasImage, setHasImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);
  const [dotIntensity, setDotIntensity] = useState(1.1);
  const [edgeSensitivity, setEdgeSensitivity] = useState(60);
  const [inkColor, setInkColor] = useState("#0a0a0f");

  const process = useCallback(() => {
    const source = sourceCanvasRef.current;
    const output = outputCanvasRef.current;
    if (!source || !output) return;

    const ctx = output.getContext("2d");
    const srcCtx = source.getContext("2d", { willReadFrequently: true });
    if (!ctx || !srcCtx) return;

    const imageData = srcCtx.getImageData(0, 0, source.width, source.height);
    renderMangafy(ctx, imageData, source.width, source.height, {
      dotIntensity,
      edgeThreshold: edgeSensitivity,
      inkColor,
    });
  }, [dotIntensity, edgeSensitivity, inkColor]);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(true);
      return;
    }
    setError(false);

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const source = sourceCanvasRef.current;
      const output = outputCanvasRef.current;
      if (!source || !output) return;

      const scale = Math.min(MAX_DIMENSION / img.width, MAX_DIMENSION / img.height, 1);
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      source.width = width;
      source.height = height;
      output.width = width;
      output.height = height;

      const srcCtx = source.getContext("2d");
      srcCtx?.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      // Recién acá se marca que hay imagen — el useEffect de abajo hace el
      // primer procesamiento (y cualquier reprocesamiento posterior al
      // mover un slider) siempre con los valores más recientes de
      // dotIntensity/edgeSensitivity/inkColor, sin closures viejos.
      setHasImage(true);
    };
    img.onerror = () => setError(true);
    img.src = url;
  }, []);

  // Reacciona a cualquier cambio de parámetro (o a la primera imagen) y
  // reprocesa. Todo el trabajo va adentro de un requestAnimationFrame para
  // no llamar setState de forma síncrona en el cuerpo del efecto (regla
  // react-hooks/set-state-in-effect) y para que React pinte el spinner
  // antes de que arranque el cómputo síncrono de Sobel + halftone.
  useEffect(() => {
    if (!hasImage) return;
    const id = requestAnimationFrame(() => {
      setIsProcessing(true);
      requestAnimationFrame(() => {
        process();
        setIsProcessing(false);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [hasImage, process]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const download = () => {
    const output = outputCanvasRef.current;
    if (!output) return;
    output.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mangafy.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <canvas ref={sourceCanvasRef} className="hidden" aria-hidden="true" />

      <motion.button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex w-full flex-col items-center gap-3 rounded-[var(--radius-cartoon)] border-2 border-dashed px-6 py-10 text-center transition-colors"
        style={{
          borderColor: isDragging ? "var(--color-cyan)" : "rgba(255,255,255,0.25)",
          background: isDragging ? "rgba(0,245,255,0.06)" : "var(--color-panel-bg-alt)",
        }}
      >
        <Upload size={28} strokeWidth={2} className="text-white/50" />
        <p className="font-label text-sm tracking-wide text-white/70">{t("dropzone")}</p>
      </motion.button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />

      {error && (
        <p className="mt-3 text-sm text-red" role="alert">
          {t("error")}
        </p>
      )}

      {/* Montado siempre (oculto vía clase hasta tener imagen), nunca
          condicionado con `&&` — si el <canvas> se desmontara/remontara al
          togglear hasImage, cada vez que este ref cambia de nodo se
          perdería el contenido ya dibujado, y en el primer upload
          outputCanvasRef.current sería null justo cuando <img onload>
          intenta escribir en él (hasImage recién se pone true después de
          procesar), cortando el procesamiento en silencio. */}
      <div
        className={`relative mt-6 mb-5 flex justify-center overflow-hidden rounded-[var(--radius-cartoon)] border-2 border-ink bg-white ${hasImage ? "" : "hidden"}`}
      >
        <canvas ref={outputCanvasRef} className="h-auto max-w-full" />
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/60">
            <Wand2 size={28} className="animate-pulse text-cyan" />
          </div>
        )}
      </div>

      {hasImage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="dot-intensity" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
                {t("dotIntensity")}
              </label>
              <input
                id="dot-intensity"
                type="range"
                min={0.5}
                max={1.8}
                step={0.05}
                value={dotIntensity}
                onChange={(e) => setDotIntensity(Number(e.target.value))}
                className="w-full accent-cyan"
              />
            </div>
            <div>
              <label htmlFor="edge-sensitivity" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
                {t("edgeSensitivity")}
              </label>
              <input
                id="edge-sensitivity"
                type="range"
                min={20}
                max={140}
                value={edgeSensitivity}
                onChange={(e) => setEdgeSensitivity(Number(e.target.value))}
                className="w-full accent-cyan"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={inkColor}
                onChange={(e) => setInkColor(e.target.value)}
                aria-label={t("inkColor")}
                className="h-9 w-12 shrink-0 cursor-pointer rounded-[6px] border-2 border-ink bg-transparent p-0.5"
              />
              <span className="font-label text-xs tracking-widest text-white/60">{t("inkColor")}</span>
            </div>
          </div>

          <button type="button" onClick={download} className="btn-manga cyan w-full justify-center">
            {t("download")} <Download size={18} strokeWidth={3} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

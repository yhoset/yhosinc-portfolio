"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Upload, Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";

type Swatch = { hex: string; count: number };

// Downscale antes de muestrear — un canvas de 128x128 alcanza sobra para
// una paleta representativa y evita iterar millones de píxeles en fotos
// grandes. QUANT_LEVELS agrupa colores parecidos en el mismo balde (sin
// esto, ruido de compresión JPEG generaría cientos de colores casi
// idénticos en vez de unos pocos dominantes).
const SAMPLE_SIZE = 128;
const QUANT_LEVELS = 24;
const MAX_SWATCHES = 6;

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function extractPalette(imageData: ImageData): Swatch[] {
  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 128) continue; // ignora píxeles mayormente transparentes
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${Math.round(r / QUANT_LEVELS)},${Math.round(g / QUANT_LEVELS)},${Math.round(b / QUANT_LEVELS)}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.count += 1;
    } else {
      buckets.set(key, { r, g, b, count: 1 });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_SWATCHES)
    .map((bucket) => ({
      hex: rgbToHex(
        Math.round(bucket.r / bucket.count),
        Math.round(bucket.g / bucket.count),
        Math.round(bucket.b / bucket.count)
      ),
      count: bucket.count,
    }));
}

export function PaletteExtractor() {
  const t = useTranslations("Tools.paletteTool");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(false);
  const { copiedValue: copiedHex, copy: copyHex } = useCopyToClipboard();

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(true);
      return;
    }
    setError(false);

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const scale = Math.min(SAMPLE_SIZE / img.width, SAMPLE_SIZE / img.height, 1);
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setSwatches(extractPalette(imageData));
      setImageUrl(url);
    };
    img.onerror = () => setError(true);
    img.src = url;
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

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
        className="flex w-full flex-col items-center gap-3 rounded-[var(--radius-cartoon)] border-2 border-dashed px-6 py-12 text-center transition-colors"
        style={{
          borderColor: isDragging ? "var(--color-cyan)" : "rgba(255,255,255,0.25)",
          background: isDragging ? "rgba(0,245,255,0.06)" : "var(--color-panel-bg-alt)",
        }}
      >
        <Upload size={32} strokeWidth={2} className="text-white/50" />
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

      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 grid gap-6 sm:grid-cols-[160px_1fr]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- imagen subida por el usuario en memoria (blob: URL), no un asset del proyecto */}
          <img
            src={imageUrl}
            alt={t("previewAlt")}
            className="h-40 w-full rounded-[var(--radius-cartoon)] border-2 border-ink object-cover sm:w-40"
          />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-2">
            {swatches.map((s) => (
              <motion.button
                key={s.hex}
                type="button"
                onClick={() => copyHex(s.hex)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="group flex flex-col items-start overflow-hidden rounded-[var(--radius-cartoon)] border-2 border-ink"
              >
                <div className="h-14 w-full" style={{ background: s.hex }} />
                <div className="flex w-full items-center justify-between bg-panel-bg-alt px-2.5 py-1.5">
                  <span className="font-mono text-xs text-white/80">{s.hex}</span>
                  <span className="relative inline-block h-[13px] w-[13px]">
                    <AnimatePresence initial={false}>
                      {copiedHex === s.hex ? (
                        <motion.span
                          key="check"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute inset-0"
                        >
                          <Check size={13} className="text-cyan" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute inset-0"
                        >
                          <Copy size={13} className="text-white/40 group-hover:text-white/70" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

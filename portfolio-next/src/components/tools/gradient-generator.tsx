"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Check, Copy, Plus, X } from "lucide-react";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";

type Stop = { id: number; color: string };
type GradientType = "linear" | "radial";

const MAX_STOPS = 4;
const MIN_STOPS = 2;

export function GradientGenerator() {
  const t = useTranslations("Tools.gradientTool");
  const nextId = useRef(2);
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { id: 0, color: "#00f5ff" },
    { id: 1, color: "#ff2d55" },
  ]);
  const { copiedValue, copy: copyCss } = useCopyToClipboard();

  const stopList = stops.map((s) => s.color).join(", ");
  const css = type === "linear" ? `linear-gradient(${angle}deg, ${stopList})` : `radial-gradient(circle, ${stopList})`;
  const declaration = `background: ${css};`;
  const copied = copiedValue === declaration;

  const addStop = () => {
    if (stops.length >= MAX_STOPS) return;
    setStops((s) => [...s, { id: nextId.current++, color: "#ffe000" }]);
  };
  const removeStop = (id: number) => {
    if (stops.length <= MIN_STOPS) return;
    setStops((s) => s.filter((stop) => stop.id !== id));
  };
  const updateStop = (id: number, color: string) => {
    setStops((s) => s.map((stop) => (stop.id === id ? { ...stop, color } : stop)));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        layout
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 h-48 w-full rounded-[var(--radius-cartoon)] border-2 border-ink"
        style={{ background: css }}
      />

      <div className="mb-5 flex gap-2">
        {(["linear", "radial"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setType(opt)}
            className={
              type === opt
                ? "font-label rounded-full border-2 border-cyan bg-cyan px-4 py-1.5 text-sm tracking-wider text-ink transition-colors duration-150"
                : "font-label rounded-full border-2 border-white/30 px-4 py-1.5 text-sm tracking-wider text-white/70 transition-colors duration-150 hover:border-cyan hover:text-cyan"
            }
          >
            {t(opt)}
          </button>
        ))}
      </div>

      {type === "linear" && (
        <div className="mb-5">
          <label htmlFor="angle" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
            {t("angle")}: {angle}°
          </label>
          <input
            id="angle"
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full accent-cyan"
          />
        </div>
      )}

      <div className="mb-5 flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {stops.map((stop) => (
            <motion.div
              key={stop.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(stop.id, e.target.value)}
                aria-label={t("colorStop")}
                className="h-9 w-12 shrink-0 cursor-pointer rounded-[6px] border-2 border-ink bg-transparent p-0.5"
              />
              <span className="font-mono text-sm text-white/70">{stop.color}</span>
              {stops.length > MIN_STOPS && (
                <button
                  type="button"
                  onClick={() => removeStop(stop.id)}
                  aria-label={t("removeStop")}
                  className="ml-auto text-white/40 transition-colors hover:text-red"
                >
                  <X size={16} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {stops.length < MAX_STOPS && (
          <button
            type="button"
            onClick={addStop}
            className="btn-manga self-start px-3 py-1.5 text-sm"
          >
            <Plus size={16} strokeWidth={3} /> {t("addStop")}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-[var(--radius-cartoon)] border-2 border-ink bg-panel-bg-alt px-3 py-2.5">
        <code className="flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap text-white/80">
          {declaration}
        </code>
        <button type="button" onClick={() => copyCss(declaration)} className="btn-manga cyan shrink-0 px-3 py-1.5 text-sm">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

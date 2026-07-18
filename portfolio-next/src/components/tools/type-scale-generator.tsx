"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";

const RATIOS = [
  { label: "Minor Second — 1.067", value: 1.067 },
  { label: "Major Second — 1.125", value: 1.125 },
  { label: "Minor Third — 1.2", value: 1.2 },
  { label: "Major Third — 1.25", value: 1.25 },
  { label: "Perfect Fourth — 1.333", value: 1.333 },
  { label: "Golden Ratio — 1.618", value: 1.618 },
];

const STEPS_DOWN = 2;
const STEPS_UP = 5;
const MAX_PREVIEW_PX = 46; // evita que un paso grande rompa el layout del preview

export function TypeScaleGenerator() {
  const t = useTranslations("Tools.typeScaleTool");
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const { copiedValue, copy } = useCopyToClipboard();

  const steps = useMemo(() => {
    const list = [];
    for (let i = STEPS_UP; i >= -STEPS_DOWN; i--) {
      const px = base * Math.pow(ratio, i);
      list.push({ step: i, px, rem: px / 16 });
    }
    return list;
  }, [base, ratio]);

  const fullCss = useMemo(() => {
    const lines = steps
      .slice()
      .reverse()
      .map((s) => `  --step-${s.step >= 0 ? s.step : `n${Math.abs(s.step)}`}: ${s.rem.toFixed(3)}rem;`);
    return `:root {\n${lines.join("\n")}\n}`;
  }, [steps]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="base-size" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
            {t("baseSize")}: {base}px
          </label>
          <input
            id="base-size"
            type="range"
            min={12}
            max={24}
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="w-full accent-cyan"
          />
        </div>
        <div>
          <label htmlFor="ratio" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
            {t("ratio")}
          </label>
          <select
            id="ratio"
            value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))}
            className="field-manga"
          >
            {RATIOS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        {steps.map((s) => (
          <motion.button
            key={s.step}
            type="button"
            onClick={() => copy(`${s.rem.toFixed(3)}rem`)}
            whileHover={{ x: 4 }}
            className="group flex items-baseline justify-between gap-3 overflow-hidden rounded-[var(--radius-cartoon)] border-2 border-ink bg-panel-bg-alt px-3 py-2 text-left"
          >
            <span
              className="truncate text-white"
              style={{ fontSize: `${Math.min(s.px, MAX_PREVIEW_PX)}px`, lineHeight: 1.1 }}
            >
              Aa
            </span>
            <span className="font-mono shrink-0 text-xs text-white/50 group-hover:text-cyan">
              {s.px.toFixed(1)}px / {s.rem.toFixed(3)}rem
            </span>
          </motion.button>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-[var(--radius-cartoon)] border-2 border-ink bg-panel-bg-alt px-3 py-2.5">
        <pre className="flex-1 overflow-x-auto font-mono text-xs whitespace-pre text-white/80">{fullCss}</pre>
        <button type="button" onClick={() => copy(fullCss)} className="btn-manga cyan shrink-0 px-3 py-1.5 text-sm">
          {copiedValue === fullCss ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

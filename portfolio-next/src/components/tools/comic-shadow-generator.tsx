"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";

export function ComicShadowGenerator() {
  const t = useTranslations("Tools.comicShadowTool");
  const tCommon = useTranslations("Tools");
  const [offset, setOffset] = useState(6);
  const [borderWidth, setBorderWidth] = useState(3);
  const [borderColor, setBorderColor] = useState("#0a0a0f");
  const [shadowColor, setShadowColor] = useState("#00f5ff");
  const [panelColor, setPanelColor] = useState("#111118");
  const { copiedValue, copy } = useCopyToClipboard();

  const boxShadow = `${offset}px ${offset}px 0px ${borderColor}, ${offset * 2}px ${offset * 2}px 0px ${shadowColor}59`;
  const border = `${borderWidth}px solid ${borderColor}`;

  const css = useMemo(
    () => `border: ${border};\nbackground: ${panelColor};\nbox-shadow: ${boxShadow};`,
    [border, panelColor, boxShadow]
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10 flex items-center justify-center py-10">
        <div
          className="flex h-32 w-48 items-center justify-center rounded-[var(--radius-cartoon)]"
          style={{ border, background: panelColor, boxShadow }}
        >
          <span className="font-display text-2xl text-white">POW!</span>
        </div>
      </div>

      <div className="mb-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="offset" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
            {t("offset")}: {offset}px
          </label>
          <input
            id="offset"
            type="range"
            min={2}
            max={14}
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="w-full accent-cyan"
          />
        </div>
        <div>
          <label htmlFor="border-width" className="font-label mb-1.5 block text-xs tracking-widest text-white/60">
            {t("borderWidth")}: {borderWidth}px
          </label>
          <input
            id="border-width"
            type="range"
            min={1}
            max={6}
            value={borderWidth}
            onChange={(e) => setBorderWidth(Number(e.target.value))}
            className="w-full accent-cyan"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            aria-label={t("borderColor")}
            className="h-9 w-12 shrink-0 cursor-pointer rounded-[6px] border-2 border-ink bg-transparent p-0.5"
          />
          <span className="font-label text-xs tracking-widest text-white/60">{t("borderColor")}</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={shadowColor}
            onChange={(e) => setShadowColor(e.target.value)}
            aria-label={t("shadowColor")}
            className="h-9 w-12 shrink-0 cursor-pointer rounded-[6px] border-2 border-ink bg-transparent p-0.5"
          />
          <span className="font-label text-xs tracking-widest text-white/60">{t("shadowColor")}</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={panelColor}
            onChange={(e) => setPanelColor(e.target.value)}
            aria-label={t("panelColor")}
            className="h-9 w-12 shrink-0 cursor-pointer rounded-[6px] border-2 border-ink bg-transparent p-0.5"
          />
          <span className="font-label text-xs tracking-widest text-white/60">{t("panelColor")}</span>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-[var(--radius-cartoon)] border-2 border-ink bg-panel-bg-alt px-3 py-2.5">
        <pre className="flex-1 overflow-x-auto font-mono text-xs whitespace-pre text-white/80">{css}</pre>
        <button
          type="button"
          onClick={() => copy(css)}
          aria-label={tCommon("copyValue")}
          className="btn-manga cyan shrink-0 px-3 py-1.5 text-sm"
        >
          {copiedValue === css ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

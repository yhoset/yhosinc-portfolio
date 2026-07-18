"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, RotateCcw } from "lucide-react";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";

type Point = { x: number; y: number };
type Handle = "p1" | "p2";

// La misma curva que usa el sitio (transiciones de página, hero, etc.) —
// ver anim-sweep-in / anim-pop-in en globals.css.
const PRESETS: { label: string; p1: Point; p2: Point }[] = [
  { label: "ease", p1: { x: 0.25, y: 0.1 }, p2: { x: 0.25, y: 1 } },
  { label: "ease-in", p1: { x: 0.42, y: 0 }, p2: { x: 1, y: 1 } },
  { label: "ease-out", p1: { x: 0, y: 0 }, p2: { x: 0.58, y: 1 } },
  { label: "ease-in-out", p1: { x: 0.42, y: 0 }, p2: { x: 0.58, y: 1 } },
  { label: "yhosinc", p1: { x: 0.22, y: 1 }, p2: { x: 0.36, y: 1 } },
];

const SIZE = 260;
const PAD = 28;
const DOMAIN = SIZE - PAD * 2;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function toSvg(p: Point) {
  return { x: PAD + p.x * DOMAIN, y: SIZE - PAD - p.y * DOMAIN };
}

function fromSvg(sx: number, sy: number): Point {
  return {
    x: clamp((sx - PAD) / DOMAIN, 0, 1),
    y: clamp((SIZE - PAD - sy) / DOMAIN, -0.5, 1.5),
  };
}

export function EasingEditor() {
  const t = useTranslations("Tools.easingTool");
  const tCommon = useTranslations("Tools");
  const svgRef = useRef<SVGSVGElement>(null);
  const [p1, setPoint1] = useState<Point>({ x: 0.22, y: 1 });
  const [p2, setPoint2] = useState<Point>({ x: 0.36, y: 1 });
  const [dragging, setDragging] = useState<Handle | null>(null);
  const [ballAtEnd, setBallAtEnd] = useState(false);
  const { copiedValue, copy } = useCopyToClipboard();

  const bezierString = `cubic-bezier(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)})`;

  const replay = useCallback(() => {
    setBallAtEnd(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setBallAtEnd(true)));
  }, []);

  useEffect(() => {
    // Encolado en un frame en vez de llamado directo: un setState síncrono
    // dentro del cuerpo del efecto dispara renders en cascada (regla
    // react-hooks/set-state-in-effect) — con requestAnimationFrame el
    // cambio de estado ocurre en un frame posterior, no en el mismo commit.
    // Solo al montar — mover los puntos no debe disparar un replay por cada
    // evento de arrastre (mouse move dispara muchas veces por segundo); el
    // replay real ocurre al soltar el punto o tocar un preset.
    const id = requestAnimationFrame(() => replay());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * SIZE;
      const sy = ((e.clientY - rect.top) / rect.height) * SIZE;
      const point = fromSvg(sx, sy);
      if (dragging === "p1") setPoint1(point);
      else setPoint2(point);
    },
    [dragging]
  );

  useEffect(() => {
    if (!dragging) return;
    const onUp = () => {
      setDragging(null);
      replay();
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, onPointerMove, replay]);

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setPoint1(preset.p1);
    setPoint2(preset.p2);
    replay();
  };

  const svgP1 = toSvg(p1);
  const svgP2 = toSvg(p2);
  const svgStart = toSvg({ x: 0, y: 0 });
  const svgEnd = toSvg({ x: 1, y: 1 });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset)}
            className="font-label rounded-full border-2 border-white/30 px-3 py-1 text-xs tracking-wider text-white/70 transition-colors duration-150 hover:border-cyan hover:text-cyan"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-[260px_1fr]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="touch-none rounded-[var(--radius-cartoon)] border-2 border-ink bg-panel-bg-alt select-none"
        >
          <rect x={PAD} y={PAD} width={DOMAIN} height={DOMAIN} fill="none" stroke="rgba(255,255,255,0.15)" />
          <path
            d={`M ${svgStart.x} ${svgStart.y} C ${svgP1.x} ${svgP1.y}, ${svgP2.x} ${svgP2.y}, ${svgEnd.x} ${svgEnd.y}`}
            stroke="#00f5ff"
            strokeWidth={2.5}
            fill="none"
          />
          <line x1={svgStart.x} y1={svgStart.y} x2={svgP1.x} y2={svgP1.y} stroke="rgba(255,224,0,0.5)" strokeWidth={1.5} />
          <line x1={svgEnd.x} y1={svgEnd.y} x2={svgP2.x} y2={svgP2.y} stroke="rgba(255,45,85,0.5)" strokeWidth={1.5} />
          <circle
            cx={svgP1.x}
            cy={svgP1.y}
            r={8}
            fill="#ffe000"
            stroke="#0a0a0f"
            strokeWidth={2}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={() => setDragging("p1")}
          />
          <circle
            cx={svgP2.x}
            cy={svgP2.y}
            r={8}
            fill="#ff2d55"
            stroke="#0a0a0f"
            strokeWidth={2}
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={() => setDragging("p2")}
          />
        </svg>

        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="relative mb-3 h-10 rounded-full border-2 border-ink bg-panel-bg-alt">
              <div
                className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-ink bg-cyan"
                style={{
                  left: ballAtEnd ? "calc(100% - 28px)" : "4px",
                  transitionProperty: "left",
                  transitionDuration: "1.1s",
                  transitionTimingFunction: bezierString,
                }}
              />
            </div>
            <button type="button" onClick={replay} className="btn-manga px-3 py-1.5 text-sm">
              <RotateCcw size={16} /> {t("replay")}
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-[var(--radius-cartoon)] border-2 border-ink bg-panel-bg-alt px-3 py-2.5">
            <code className="flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap text-white/80">
              {bezierString}
            </code>
            <button
              type="button"
              onClick={() => copy(bezierString)}
              aria-label={tCommon("copyValue")}
              className="btn-manga cyan shrink-0 px-3 py-1.5 text-sm"
            >
              {copiedValue === bezierString ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

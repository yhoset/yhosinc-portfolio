"use client";

import { useEffect, useRef } from "react";

// Colores de marca (ver globals.css @theme) — inline porque este SVG se
// inserta vía DOM directo (no JSX) para el burst de click, igual que en v1.
const INK = "#0a0a0f";
const RED = "#ff2d55";
const CYAN = "#00f5ff";
const WHITE = "#ffffff";

export function CustomCursor() {
  const arrowRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reducedMotion) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        root.style.setProperty("--cx", `${e.clientX}px`);
        root.style.setProperty("--cy", `${e.clientY}px`);
        rafRef.current = null;
      });
    };
    const onDown = () => arrowRef.current?.classList.add("is-down");
    const onUp = () => arrowRef.current?.classList.remove("is-down");
    const onClick = (e: MouseEvent) => {
      const burst = document.createElement("div");
      burst.setAttribute("aria-hidden", "true");
      burst.style.cssText = `position:fixed;left:${e.clientX - 9}px;top:${e.clientY - 9}px;width:18px;height:18px;z-index:9999;pointer-events:none;transform:scale(0.5);opacity:0.75;transition:transform 0.28s cubic-bezier(0.22,1,0.36,1),opacity 0.28s ease-in;will-change:transform,opacity;`;
      burst.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="${RED}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round" d="M19.064 10.109l1.179-2.387c.074-.149.068-.327-.015-.471-.083-.145-.234-.238-.401-.249l-2.656-.172-.172-2.656c-.011-.167-.104-.317-.249-.401-.145-.084-.322-.09-.472-.015l-2.385 1.18-1.477-2.215c-.186-.278-.646-.278-.832 0l-1.477 2.215-2.385-1.18c-.151-.075-.327-.069-.472.015-.145.083-.238.234-.249.401l-.171 2.656-2.657.171c-.167.011-.318.104-.401.249-.084.145-.089.322-.015.472l1.179 2.386-2.214 1.477c-.139.093-.223.249-.223.416s.083.323.223.416l2.215 1.477-1.18 2.386c-.074.15-.068.327.015.472.083.144.234.238.401.248l2.656.171.171 2.657c.011.167.104.317.249.401.144.083.32.088.472.015l2.386-1.179 1.477 2.214c.093.139.249.223.416.223s.323-.083.416-.223l1.477-2.214 2.386 1.179c.15.073.327.068.472-.015s.238-.234.249-.401l.171-2.656 2.656-.172c.167-.011.317-.104.401-.249.083-.145.089-.322.015-.472l-1.179-2.385 2.214-1.478c.139-.093.223-.249.223-.416s-.083-.323-.223-.416l-2.214-1.475z"/></svg>`;
      document.body.appendChild(burst);
      requestAnimationFrame(() => {
        burst.style.transform = "scale(1.3) rotate(8deg)";
        burst.style.opacity = "0";
      });
      setTimeout(() => burst.remove(), 300);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("click", onClick);
    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("click", onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div aria-hidden className="custom-cursor">
      <div className="custom-cursor-pos">
        <svg ref={arrowRef} className="custom-cursor-arrow" width="34" height="34" viewBox="0 0 34 34">
          <polygon points="4,2 30,16 17,19 12,31 4,2" fill={WHITE} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <polygon points="4,2 30,16 17,19 12,31 4,2" fill="none" stroke={CYAN} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

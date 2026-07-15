// Ráfaga de "líneas de velocidad" cómic — portada de v1 (App.jsx SpeedBurst).
// Puramente decorativo (aria-hidden), sin JS: server-renderable.
export function SpeedBurst({
  color,
  strokeWidth = 3,
}: {
  color: string;
  strokeWidth?: number;
}) {
  const lines = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const x1 = 50 + Math.cos(angle) * 20;
    const y1 = 50 + Math.sin(angle) * 20;
    const x2 = 50 + Math.cos(angle) * (34 + (i % 3) * 6);
    const y2 = 50 + Math.sin(angle) * (34 + (i % 3) * 6);
    return { x1, y1, x2, y2, key: i };
  });

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {lines.map(({ key, ...line }) => (
        <line key={key} {...line} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      ))}
    </svg>
  );
}

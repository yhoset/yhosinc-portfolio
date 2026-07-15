// Formas geométricas flotantes de fondo — portadas de v1 (App.jsx
// OrbitingGeom). Decorativas, server-renderable, animadas por CSS puro.
export function OrbitingGeom() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="anim-spin-slow absolute top-[10%] -right-[8%] h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <polygon points="50,5 95,80 5,80" fill="none" stroke="#ffe000" strokeWidth={3} />
          <polygon points="50,20 80,70 20,70" fill="none" stroke="#0a0a0f" strokeWidth={2.5} />
        </svg>
      </div>
      <div className="anim-spin-reverse absolute bottom-[8%] -left-[6%] h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <rect x="15" y="15" width="70" height="70" fill="none" stroke="#ff2d55" strokeWidth={3} transform="rotate(15 50 50)" />
          <rect x="30" y="30" width="40" height="40" fill="#ff2d55" stroke="#0a0a0f" strokeWidth={2.5} transform="rotate(30 50 50)" />
        </svg>
      </div>
      <div className="anim-float-lg absolute top-[55%] left-[8%] h-14 w-14">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="38" fill="#00f5ff" stroke="#0a0a0f" strokeWidth={4} />
          <circle cx="50" cy="50" r="14" fill="#0a0a0f" />
        </svg>
      </div>
    </div>
  );
}

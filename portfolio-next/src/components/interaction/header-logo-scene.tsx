"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const INK = "#0a0a0f";
const PANEL = "#16161f";
const CYAN = "#00f5ff";

// Cabeza low-poly angular — planos facetados (icosaedro truncado a mano vía
// flatShading), ojos cian emisivos. Ver branding-y-filosofia.md §5 y §10.
// El balanceo ambiental (Float, de drei) y la inclinación hacia el puntero
// se aplican en dos grupos anidados y se suman siempre — así la pieza nunca
// queda congelada aunque el mouse deje de moverse (antes el idle-sway solo
// corría con el puntero exactamente en el centro del viewport, algo que casi
// nunca ocurre en la práctica).
function LowPolyHead() {
  const tiltRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0 });

  useFrame((state, delta) => {
    const pointer = state.pointer; // -1..1, normalizado a todo el viewport
    // Solo inclinación vertical (arriba/abajo) — sin giro lateral izq/der.
    target.current.x = pointer.y * 0.3;

    if (!tiltRef.current) return;
    // Lerp suave hacia el objetivo — nunca un salto brusco al cambiar de foco.
    tiltRef.current.rotation.x = THREE.MathUtils.damp(tiltRef.current.rotation.x, target.current.x, 4, delta);
  });

  const eyeGeometry = useMemo(() => new THREE.SphereGeometry(0.09, 8, 8), []);

  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.7} floatingRange={[-0.05, 0.05]}>
      <group ref={tiltRef}>
        <mesh castShadow={false} receiveShadow={false}>
          <icosahedronGeometry args={[0.85, 0]} />
          <meshStandardMaterial color={PANEL} flatShading roughness={0.55} metalness={0.1} />
        </mesh>
        <mesh geometry={eyeGeometry} position={[0.28, 0.08, 0.72]}>
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
        <mesh geometry={eyeGeometry} position={[-0.28, 0.08, 0.72]}>
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

export function HeaderLogoScene() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 3], fov: 35 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} color={INK} />
      <directionalLight position={[2, 2, 3]} intensity={1.4} />
      <LowPolyHead />
    </Canvas>
  );
}

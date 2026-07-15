"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const INK = "#0a0a0f";
const PANEL = "#16161f";
const CYAN = "#00f5ff";

// Cabeza low-poly angular — planos facetados (icosaedro truncado a mano vía
// flatShading), ojos cian emisivos. Ver branding-y-filosofia.md §5 y §10.
function LowPolyHead() {
  const headRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const pointer = state.pointer; // -1..1, normalizado a todo el viewport
    const idle = Math.abs(pointer.x) < 0.001 && Math.abs(pointer.y) < 0.001;
    target.current.x = idle ? Math.sin(state.clock.elapsedTime * 0.6) * 0.15 : pointer.y * 0.35;
    target.current.y = idle ? Math.sin(state.clock.elapsedTime * 0.4) * 0.25 : pointer.x * 0.5;

    if (!headRef.current) return;
    // Lerp suave hacia el objetivo — nunca un salto brusco al cambiar de foco.
    headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, target.current.x, 6, delta);
    headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, target.current.y, 6, delta);
  });

  const eyeGeometry = useMemo(() => new THREE.SphereGeometry(0.09, 8, 8), []);

  return (
    <group ref={headRef}>
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
  );
}

export function HeaderLogoScene() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
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

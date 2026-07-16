"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePowerLevel } from "@/components/interaction/power-level-context";

const INK = "#0a0a0f";
const PANEL = "#16161f";
const ACCENTS = ["#00f5ff", "#ffe000", "#ff2d55"];
const COUNT = 56;

type Particle = {
  position: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  driftPhase: number;
  driftSpeed: number;
  scale: number;
  color: THREE.Color;
};

function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { events } = usePowerLevel();
  const lastEventCount = useRef(events.length);
  const flashUntil = useRef(0);

  // "Power up" real conecta el fondo con el HUD (branding-y-filosofia.md
  // §7): un hito nuevo hace que las partículas brillen un instante — nunca
  // gatea nada, solo refuerza narrativamente el mismo evento del HUD.
  useEffect(() => {
    if (events.length > lastEventCount.current) {
      flashUntil.current = performance.now() + 900;
    }
    lastEventCount.current = events.length;
  }, [events]);

  // useState (no useMemo) a propósito: el inicializador de useState es el
  // único lugar donde React garantiza una sola ejecución, así que es el
  // sitio correcto para Math.random() — useMemo puede volver a ejecutarse
  // y con valores aleatorios eso rompería la pureza (regla purity de
  // eslint-plugin-react-hooks / React Compiler).
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: COUNT }, (_, i) => {
      const isAccent = i % 9 === 0;
      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 10,
          -Math.random() * 14 - 2
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        ),
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.15 + Math.random() * 0.25,
        scale: isAccent ? 0.22 + Math.random() * 0.1 : 0.12 + Math.random() * 0.16,
        color: new THREE.Color(isAccent ? ACCENTS[i % ACCENTS.length] : PANEL),
      };
    })
  );

  // Los colores por instancia se fijan una sola vez al montar — setColorAt
  // es imperativo (no hay prop declarativa estable en R3F 9 para esto).
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    particles.forEach((p, i) => mesh.setColorAt(i, p.color));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [particles]);

  const pointerTarget = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    const flashing = performance.now() < flashUntil.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const t = state.clock.elapsedTime * p.driftSpeed + p.driftPhase;
      dummy.position.set(
        p.position.x + Math.sin(t) * 0.4,
        p.position.y + Math.cos(t * 0.8) * 0.3,
        p.position.z
      );
      dummy.rotation.set(
        t * p.rotationSpeed.x,
        t * p.rotationSpeed.y,
        t * p.rotationSpeed.z
      );
      const s = flashing ? p.scale * 1.35 : p.scale;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Parallax suave: el campo entero se desplaza levemente hacia el
    // cursor, dando sensación de profundidad ("modo juego") sin mover la
    // cámara (más barato, sin distorsión de perspectiva rara).
    pointerTarget.current.x = state.pointer.x * 0.6;
    pointerTarget.current.y = state.pointer.y * 0.4;
    group.position.x = THREE.MathUtils.damp(group.position.x, pointerTarget.current.x, 3, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, pointerTarget.current.y, 3, delta);
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial flatShading roughness={0.6} metalness={0.15} />
      </instancedMesh>
    </group>
  );
}

export function GameBackgroundScene() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: INK }}
    >
      <fog attach="fog" args={[INK, 6, 16]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <ParticleField />
    </Canvas>
  );
}

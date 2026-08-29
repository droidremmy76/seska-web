"use client";

import { useEffect, useState } from "react";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { ParticleField } from "@/components/three/ParticleField";
import { SceneController } from "@/components/three/SceneController";

function supportsWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function PersistentThreeCanvas() {
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [particleCount, setParticleCount] = useState(12000);

  useEffect(() => {
    setMounted(true);
    setWebgl(supportsWebGL());
    const compact = window.matchMedia("(max-width: 760px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setParticleCount(reduced ? 3500 : compact ? 7000 : 15000);
  }, []);

  if (!mounted || !webgl) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "#020817",
      }}
    >
      <ThreeCanvas>
        <SceneController />
        <ParticleField count={particleCount} />
      </ThreeCanvas>
    </div>
  );
}

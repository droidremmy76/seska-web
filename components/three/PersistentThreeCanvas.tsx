"use client";

import { useEffect, useState } from "react";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { ParticleField } from "@/components/three/ParticleField";

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

  useEffect(() => {
    setMounted(true);
    setWebgl(supportsWebGL());
  }, []);

  if (!mounted || !webgl) return null;

  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "#020817" }}>
      <ThreeCanvas>
        <ParticleField />
      </ThreeCanvas>
    </div>
  );
}

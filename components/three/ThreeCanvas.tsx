"use client";

import { Canvas, type RootState } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

export function ThreeCanvas({ children, className }: { children: ReactNode; className?: string }) {
  const { lenisRef, ready } = useMotion();
  const root = useRef<RootState | null>(null);

  useEffect(() => {
    if (!ready) return;

    const tick = (time: number) => {
      lenisRef.current?.raf(time * 1000);
      ScrollTrigger.update();
      root.current?.advance(time, true);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      gsap.ticker.remove(tick);
    };
  }, [ready, lenisRef]);

  return (
    <Canvas
      className={className}
      frameloop="never"
      onCreated={(state) => { root.current = state; }}
      camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 1000 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
    >
      {children}
    </Canvas>
  );
}

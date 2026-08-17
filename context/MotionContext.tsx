"use client";

import { createContext, useContext, useEffect, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import type LenisType from "lenis";

type MotionContextValue = {
  lenis: LenisType | null;
  lenisRef: MutableRefObject<LenisType | null>;
  ready: boolean;
};

const MotionContext = createContext<MotionContextValue | undefined>(undefined);

export function MotionProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisType | null>(null);
  const [lenis, setLenis] = useState<LenisType | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      const [{ default: Lenis }] = await Promise.all([import("lenis")]);
      if (cancelled) return;

      const instance = new Lenis({
        autoRaf: false,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      });

      lenisRef.current = instance;
      setLenis(instance);
      setReady(true);
    }

    initialize();

    return () => {
      cancelled = true;
      lenisRef.current?.destroy();
      lenisRef.current = null;
      setLenis(null);
      setReady(false);
    };
  }, []);

  return (
    <MotionContext.Provider value={{ lenis, lenisRef, ready }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useMotion must be used inside MotionProvider");
  return context;
}

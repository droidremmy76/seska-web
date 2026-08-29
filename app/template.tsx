"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Template({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!shellRef.current || !layerRef.current || !contentRef.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      tl.set(layerRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
      tl.fromTo(
        contentRef.current,
        { opacity: 0.72, y: 16 },
        { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" },
        0.08
      );
      tl.to(
        layerRef.current,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 0.72, ease: "power4.inOut" },
        0.12
      );
    }, shellRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={shellRef} className="route-transition-shell">
      <div ref={layerRef} className="route-transition-layer" aria-hidden="true">
        <span className="route-transition-label">SESKA INVESTMENTS / KAMPALA / DIGITAL PRINTING AT ITS BEST</span>
        <span className="route-transition-mark"><i /><i /><i /><i /></span>
      </div>
      <div ref={contentRef} className="route-transition-content">{children}</div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCursor } from "@/context/CursorContext";

const CURSOR_STYLES = {
  default: { size: 14, bg: "#FFFFFF", border: "rgba(255,255,255,.9)", text: "#020817", opacity: 0.92 },
  pointer: { size: 52, bg: "#00AEEF", border: "#00AEEF", text: "#020817", opacity: 0.96 },
  view: { size: 88, bg: "#FF007F", border: "#FF007F", text: "#FFFFFF", opacity: 0.98 },
  drag: { size: 96, bg: "#FFE600", border: "#FFE600", text: "#020817", opacity: 0.98 },
} as const;

export function CustomCursor() {
  const { variant, text, visible } = useCursor();
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (hover: hover)");
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !enabled) return;

    document.documentElement.classList.add("seska-custom-cursor");

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      setInside(true);
    };
    const onLeave = () => setInside(false);
    const onEnter = () => setInside(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);

    return () => {
      document.documentElement.classList.remove("seska-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !enabled) return;

    const style = CURSOR_STYLES[variant];
    gsap.to(cursor, {
      width: style.size,
      height: style.size,
      backgroundColor: style.bg,
      borderColor: style.border,
      color: style.text,
      opacity: visible && inside ? style.opacity : 0,
      duration: 0.28,
      ease: "power3.out",
      overwrite: true,
    });
  }, [variant, visible, inside, enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="seska-cursor"
        data-variant={variant}
      >
        <span>{text}</span>
      </div>
      <style jsx global>{`
        @media (pointer: fine) and (hover: hover) {
          html.seska-custom-cursor,
          html.seska-custom-cursor * {
            cursor: none !important;
          }
        }
        .seska-cursor {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          width: 14px;
          height: 14px;
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 999px;
          pointer-events: none;
          transform: translate(-50%, -50%);
          background: #fff;
          will-change: transform, width, height, opacity, background-color;
          box-shadow: 0 12px 36px rgba(2,8,23,.16);
          overflow: hidden;
        }
        .seska-cursor span {
          display: block;
          max-width: 72px;
          padding: 0 8px;
          text-align: center;
          font-size: 9px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0;
          transform: scale(.75);
          transition: opacity .18s ease, transform .18s ease;
        }
        .seska-cursor[data-variant="pointer"] span,
        .seska-cursor[data-variant="view"] span,
        .seska-cursor[data-variant="drag"] span {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </>
  );
}

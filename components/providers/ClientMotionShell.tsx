"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { MotionProvider } from "@/context/MotionContext";
import { SceneProvider } from "@/context/SceneContext";
import { CursorProvider } from "@/context/CursorContext";
import { CustomCursor } from "@/components/motion/CustomCursor";

const PersistentThreeCanvas = dynamic(
  () => import("@/components/three/PersistentThreeCanvas").then((m) => m.PersistentThreeCanvas),
  { ssr: false, loading: () => null }
);

export function ClientMotionShell({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <SceneProvider>
        <CursorProvider>
          <PersistentThreeCanvas />
          {children}
          <CustomCursor />
        </CursorProvider>
      </SceneProvider>
    </MotionProvider>
  );
}

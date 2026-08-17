"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { MotionProvider } from "@/context/MotionContext";

const PersistentThreeCanvas = dynamic(
  () => import("@/components/three/PersistentThreeCanvas").then((m) => m.PersistentThreeCanvas),
  { ssr: false, loading: () => null }
);

export function ClientMotionShell({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      {children}
      <PersistentThreeCanvas />
    </MotionProvider>
  );
}

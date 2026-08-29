"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SceneMode = "hero" | "services" | "work" | "process" | "contact";

type SceneContextValue = {
  scene: SceneMode;
  setScene: (scene: SceneMode) => void;
};

const SceneContext = createContext<SceneContextValue | undefined>(undefined);

export function SceneProvider({ children }: { children: ReactNode }) {
  const [scene, setSceneState] = useState<SceneMode>("hero");
  const setScene = useCallback((nextScene: SceneMode) => setSceneState(nextScene), []);
  const value = useMemo(() => ({ scene, setScene }), [scene, setScene]);

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useScene() {
  const context = useContext(SceneContext);
  if (!context) throw new Error("useScene must be used inside SceneProvider");
  return context;
}

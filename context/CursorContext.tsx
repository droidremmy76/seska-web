"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CursorVariant = "default" | "pointer" | "view" | "drag";

type CursorContextValue = {
  variant: CursorVariant;
  text: string;
  visible: boolean;
  setCursor: (variant: CursorVariant, text?: string) => void;
  resetCursor: () => void;
  setVisible: (visible: boolean) => void;
};

const CursorContext = createContext<CursorContextValue | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(true);

  const setCursor = useCallback((nextVariant: CursorVariant, nextText = "") => {
    setVariant(nextVariant);
    setText(nextText);
  }, []);

  const resetCursor = useCallback(() => {
    setVariant("default");
    setText("");
  }, []);

  const value = useMemo(
    () => ({ variant, text, visible, setCursor, resetCursor, setVisible }),
    [variant, text, visible, setCursor, resetCursor]
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) throw new Error("useCursor must be used inside CursorProvider");
  return context;
}

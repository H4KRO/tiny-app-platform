import { useMemo } from "react";

export function useMakeId() {
  return useMemo(() => Math.random().toString(), []);
}

export const ELECTRON_DRAG = (window as any).electronAPI
  ? ({ "-webkit-app-region": "drag" } as any)
  : {};

export const ELECTRON_NO_DRAG = (window as any).electronAPI
  ? ({ "-webkit-app-region": "no-drag" } as any)
  : {};

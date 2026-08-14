/* Shared OS types */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowInstance extends Rect {
  id: string;
  appId: string;
  title: string;
  payload?: unknown;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prevRect?: Rect;
  snapped?: "left" | "right" | null;
}

export type ToastTone = "info" | "warn" | "accent";

export interface Toast {
  id: string;
  title: string;
  body: string;
  tone: ToastTone;
}

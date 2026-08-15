import type { Rect } from "./types";
import { isMobileViewport } from "./useIsMobile";
export const TOP_BAR = 44;
export const BOTTOM_BAR = 56;
export const TOP_BAR_MOBILE = 44;
export const BOTTOM_BAR_MOBILE = 104;
export function topBarHeight(): number {
  return isMobileViewport() ? TOP_BAR_MOBILE : TOP_BAR;
}
export function bottomBarHeight(): number {
  return isMobileViewport() ? BOTTOM_BAR_MOBILE : BOTTOM_BAR;
}
export function desktopBounds(): Rect {
  const w = typeof window !== "undefined" ? window.innerWidth : 1280;
  const h = typeof window !== "undefined" ? window.innerHeight : 720;
  const top = topBarHeight();
  const bottom = bottomBarHeight();
  return { x: 0, y: top, w, h: Math.max(120, h - top - bottom) };
}
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

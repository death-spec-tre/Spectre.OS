import { useEffect, useRef, useState } from "react";
import { BACKGROUND_IMAGE_URL, BACKGROUND_POSTER_URL, BACKGROUND_VIDEO_URL } from "@/config/background";

/**
 * Full-bleed background behind the whole desktop. Works with any footage —
 * the scrim + grain + vignette layers on top exist purely so window chrome,
 * dock text, and widget copy stay legible no matter what's playing under
 * them. Swap the source in src/config/background.ts, nothing here needs to
 * change when you do.
 */
export default function BackgroundLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const useVideo = Boolean(BACKGROUND_VIDEO_URL) && !reducedMotion;
  const useImage = !useVideo && Boolean(BACKGROUND_IMAGE_URL || BACKGROUND_VIDEO_URL);
  const imageSrc = BACKGROUND_IMAGE_URL || BACKGROUND_POSTER_URL;

  if (!useVideo && !useImage) return null;

  return (
    <div className="bg-layer" aria-hidden="true">
      {useVideo && (
        <video
          ref={videoRef}
          className="bg-layer-media"
          src={BACKGROUND_VIDEO_URL}
          poster={BACKGROUND_POSTER_URL || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
      {useImage && imageSrc && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img className="bg-layer-media" src={imageSrc} />
      )}
      <div className="bg-layer-scrim" />
      <div className="bg-layer-grain" />
    </div>
  );
}

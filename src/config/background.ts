/**
 * Desktop background — video or image.
 *
 * Change ONE of the two URLs below and the whole desktop updates. Nothing else
 * in the app needs to change.
 *
 * Why a URL and not an imported file:
 * This app builds with `vite-plugin-singlefile`, which inlines local assets
 * as base64 into one giant HTML file (see PRODUCT.md). A large local video
 * would either bloat that single-file build or bloat the git repo if you're
 * pushing it to GitHub. Pointing at an externally-hosted URL keeps both
 * light and lets you swap backgrounds any time without touching code or
 * rebuilding — just edit the string and reload.
 *
 * Where to host a video for free:
 * - GitHub itself: create a Release on your repo and attach the .mp4 as a
 *   release asset — GitHub gives you a stable, permanent CDN-backed URL for it
 *   (Releases assets aren't counted against normal repo size the same way).
 * - Any object storage / CDN you already use (Cloudflare R2, Bunny, S3 + CF,
 *   Cloudinary, etc.) — just needs to serve the raw .mp4 with CORS allowed.
 *
 * BACKGROUND_VIDEO_URL takes priority. Leave it "" to fall back to
 * BACKGROUND_IMAGE_URL (a static image, e.g. for slow connections or mobile).
 * Leave both "" to fall back to the original plain dark desktop.
 *
 * It's currently pointed at /bg/misty-pavilion.mp4, a file sitting in this
 * project's public/ folder — that works fine locally and even on GitHub
 * Pages, but a ~60MB file in a git repo isn't great practice. Before you
 * push this, consider swapping it for an externally-hosted link instead
 * (see the note above) and deleting public/bg/misty-pavilion.mp4.
 */
export const BACKGROUND_VIDEO_URL = "/bg/misty-pavilion.mp4";

export const BACKGROUND_IMAGE_URL = "";

/**
 * Shown instantly while the video downloads, and used as the background on
 * connections where `prefers-reduced-motion` is set (video is skipped and
 * this still image is used instead). Optional — leave "" to skip.
 */
export const BACKGROUND_POSTER_URL = "";

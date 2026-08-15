export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "deathspectre";
export const PORTFOLIO_TOPIC = "spectre-portfolio";
export const STATUS_TOPICS = {
  wip: "status-wip",
  completed: "status-completed",
} as const;
export const GITHUB_API_BASE = "https://api.github.com";
export const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";

import { STATUS_TOPICS } from "./config";
import type { GithubProjectStatus, GithubRepo } from "./types";
export function determineStatus(repo: GithubRepo, configStatus?: string): GithubProjectStatus {
  if (repo.archived) return "ARCHIVED";
  if (configStatus) {
    const s = configStatus.toLowerCase();
    if (s === "wip") return "WIP";
    if (s === "completed") return "COMPLETED";
    if (s === "archived") return "ARCHIVED";
  }
  const topics = repo.topics ?? [];
  if (topics.includes(STATUS_TOPICS.wip)) return "WIP";
  if (topics.includes(STATUS_TOPICS.completed)) return "COMPLETED";
  return "WIP";
}

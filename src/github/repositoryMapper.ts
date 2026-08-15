import { PORTFOLIO_TOPIC, STATUS_TOPICS } from "./config";
import { determineStatus } from "./projectStatus";
import type { GithubProject, GithubRepo, SpectreConfig } from "./types";
const HIDDEN_TOPICS = new Set<string>([PORTFOLIO_TOPIC, STATUS_TOPICS.wip, STATUS_TOPICS.completed]);
export function mapRepoToProject(repo: GithubRepo, config: SpectreConfig | null): GithubProject {
  const status = determineStatus(repo, config?.status);
  const visibleTopics = (repo.topics ?? []).filter((t) => !HIDDEN_TOPICS.has(t));
  const technologies =
    config?.technologies && config.technologies.length > 0
      ? config.technologies
      : Array.from(new Set([repo.language, ...visibleTopics].filter(Boolean) as string[]));
  return {
    id: String(repo.id),
    repoName: repo.name,
    title: config?.title?.trim() || repo.name,
    description: config?.description?.trim() || repo.description?.trim() || "No description provided.",
    status,
    category: config?.category?.trim() || "Uncategorized",
    featured: Boolean(config?.featured),
    technologies: technologies.slice(0, 8),
    language: repo.language,
    topics: visibleTopics,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    archived: repo.archived,
    defaultBranch: repo.default_branch,
    owner: repo.owner.login,
    license: repo.license?.name ?? null,
    githubUrl: repo.html_url,
    homepageUrl: repo.homepage?.trim() || null,
    icon: config?.icon,
    hasSpectreConfig: config !== null,
  };
}

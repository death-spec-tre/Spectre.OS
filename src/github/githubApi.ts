import { GITHUB_API_BASE, GITHUB_USERNAME, PORTFOLIO_TOPIC } from "./config";
import { mapRepoToProject } from "./repositoryMapper";
import { fetchSpectreConfig } from "./spectreConfig";
import type { GithubProject, GithubRepo } from "./types";
export class GithubApiError extends Error {}
async function githubFetch<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
  } catch {
    throw new GithubApiError("Network unreachable.");
  }
  if (res.status === 403) {
    throw new GithubApiError("Rate limited by the GitHub API. Try again shortly.");
  }
  if (res.status === 404) {
    throw new GithubApiError(`GitHub user not found.`);
  }
  if (!res.ok) {
    throw new GithubApiError(`GitHub API responded ${res.status}.`);
  }
  return (await res.json()) as T;
}
export async function fetchUserRepos(username: string = GITHUB_USERNAME): Promise<GithubRepo[]> {
  return githubFetch<GithubRepo[]>(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
}
export interface PortfolioIndexResult {
  projects: GithubProject[];
  totalRepos: number;
}
export async function fetchPortfolioProjects(username: string = GITHUB_USERNAME): Promise<PortfolioIndexResult> {
  const repos = await fetchUserRepos(username);
  const matching = repos.filter((r) => (r.topics ?? []).includes(PORTFOLIO_TOPIC));
  const projects = await Promise.all(
    matching.map(async (repo) => {
      const config = await fetchSpectreConfig(repo.owner.login, repo.name, repo.default_branch);
      return mapRepoToProject(repo, config);
    }),
  );
  projects.sort((a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime());
  return { projects, totalRepos: repos.length };
}
export async function fetchReadmePreview(owner: string, repo: string): Promise<string | null> {
  try {
    const data = await githubFetch<{
      content: string;
      encoding: string;
    }>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`);
    if (data.encoding !== "base64") return null;
    return decodeBase64Utf8(data.content);
  } catch {
    return null;
  }
}
function decodeBase64Utf8(b64: string): string {
  const clean = b64.replace(/\n/g, "");
  const binary = atob(clean);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

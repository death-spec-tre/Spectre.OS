export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  default_branch: string;
  owner: {
    login: string;
    html_url: string;
    avatar_url: string;
  };
  license: {
    name: string;
    spdx_id: string;
  } | null;
}
export interface SpectreConfig {
  portfolio?: boolean;
  title?: string;
  status?: "wip" | "completed" | "archived" | string;
  category?: string;
  featured?: boolean;
  description?: string;
  technologies?: string[];
  icon?: string;
}
export type GithubProjectStatus = "WIP" | "COMPLETED" | "ARCHIVED";
export interface GithubProject {
  id: string;
  repoName: string;
  title: string;
  description: string;
  status: GithubProjectStatus;
  category: string;
  featured: boolean;
  technologies: string[];
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  archived: boolean;
  defaultBranch: string;
  owner: string;
  license: string | null;
  githubUrl: string;
  homepageUrl: string | null;
  icon?: string;
  hasSpectreConfig: boolean;
}

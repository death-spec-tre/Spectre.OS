import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPortfolioProjects } from "./githubApi";
import type { GithubProject } from "./types";
export type GithubIndexStatus = "idle" | "loading" | "ready" | "error";
interface GithubIndexState {
  status: GithubIndexStatus;
  projects: GithubProject[];
  totalRepos: number;
  error: string | null;
  lastSynced: number | null;
}
interface Cache {
  projects: GithubProject[];
  totalRepos: number;
  lastSynced: number;
}
let cache: Cache | null = null;
let inflight: Promise<{
  projects: GithubProject[];
  totalRepos: number;
}> | null = null;
const INITIAL_STATE: GithubIndexState = {
  status: "idle",
  projects: [],
  totalRepos: 0,
  error: null,
  lastSynced: null,
};
export function useGithubProjects() {
  const [state, setState] = useState<GithubIndexState>(() =>
    cache
      ? {
          status: "ready",
          projects: cache.projects,
          totalRepos: cache.totalRepos,
          error: null,
          lastSynced: cache.lastSynced,
        }
      : INITIAL_STATE,
  );
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const load = useCallback(async (force = false) => {
    if (!force && cache) {
      setState({
        status: "ready",
        projects: cache.projects,
        totalRepos: cache.totalRepos,
        error: null,
        lastSynced: cache.lastSynced,
      });
      return;
    }
    setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      if (!inflight || force) {
        inflight = fetchPortfolioProjects();
      }
      const { projects, totalRepos } = await inflight;
      inflight = null;
      cache = { projects, totalRepos, lastSynced: Date.now() };
      if (mountedRef.current) {
        setState({ status: "ready", projects, totalRepos, error: null, lastSynced: cache.lastSynced });
      }
    } catch (err) {
      inflight = null;
      if (mountedRef.current) {
        setState((s) => ({
          ...s,
          status: "error",
          error: err instanceof Error ? err.message : "Unable to reach GitHub.",
        }));
      }
    }
  }, []);
  useEffect(() => {
    if (state.status === "idle") load();
  }, []);
  const refresh = useCallback(() => load(true), [load]);
  const retry = useCallback(() => load(false), [load]);
  return { ...state, refresh, retry };
}

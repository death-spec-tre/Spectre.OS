import { GITHUB_RAW_BASE } from "./config";
import type { SpectreConfig } from "./types";
export async function fetchSpectreConfig(owner: string, repo: string, branch: string): Promise<SpectreConfig | null> {
  try {
    const res = await fetch(`${GITHUB_RAW_BASE}/${owner}/${repo}/${branch}/.spectre.yml`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const text = await res.text();
    return parseSpectreYaml(text);
  } catch {
    return null;
  }
}
export function parseSpectreYaml(text: string): SpectreConfig {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out: Record<string, unknown> = {};
  let i = 0;
  while (i < lines.length) {
    const stripped = lines[i].replace(/#.*$/, "");
    if (!stripped.trim()) {
      i++;
      continue;
    }
    const match = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(stripped);
    if (!match) {
      i++;
      continue;
    }
    const key = match[1];
    const rest = match[2].trim();
    if (rest === ">" || rest === ">-" || rest === "|" || rest === "|-") {
      i++;
      const parts: string[] = [];
      while (i < lines.length && (/^\s+\S/.test(lines[i]) || !lines[i].trim())) {
        if (lines[i].trim()) parts.push(lines[i].trim());
        i++;
      }
      out[key] = parts.join(" ").trim();
      continue;
    }
    if (rest === "") {
      const items: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        items.push(
          lines[j]
            .replace(/^\s*-\s+/, "")
            .trim()
            .replace(/^["']|["']$/g, ""),
        );
        j++;
      }
      out[key] = items;
      i = items.length ? j : i + 1;
      continue;
    }
    const unquoted = rest.replace(/^["']|["']$/g, "");
    if (unquoted === "true") out[key] = true;
    else if (unquoted === "false") out[key] = false;
    else out[key] = unquoted;
    i++;
  }
  return out as SpectreConfig;
}

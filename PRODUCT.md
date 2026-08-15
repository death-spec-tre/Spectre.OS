# Product

## Platform

web

## Users

Primary: recruiters/hiring managers evaluating Ankush for employment, and freelance/agency clients (e.g. restaurant owners considering Craftwork.AI / SmartDine) evaluating him for hire. Secondary: Ankush himself, using it as a personal showcase/archive of his work. All three audiences matter roughly equally right now — the site isn't optimized for one over the others.

## Product Purpose

A personal developer portfolio for Ankush (alias "Death Spectre" / "deathspectre"), built as an interactive desktop-OS simulation ("SPECTRE.OS") rather than a conventional scrolling page. Windows, a dock, a terminal, and desktop widgets stand in for the usual portfolio sections (work, notes, system info, contact). Success = a visitor coming away convinced of his technical craft — the interface itself is part of the proof, not just a container for it.

## Positioning

Two things a generic portfolio template can't truthfully claim:
1. The OS-shell interior itself (draggable/resizable windows, a working terminal with real commands, a taskbar, boot sequence) is hand-built, demonstrating frontend engineering skill directly rather than just describing it.
2. The Projects section (WORK → GitHub folder) is a live GitHub integration, not static copy: repos tagged `spectre-portfolio` on GitHub are auto-indexed via the REST API, with status/technologies/README resolved from repo metadata and an optional `.spectre.yml`. Pushing a tagged repo makes it appear on the site with no code changes.

## Operating Context

Visited cold, in a browser, usually once, by someone deciding quickly whether to keep looking or move on (recruiter skimming, client evaluating). Desktop and mobile both matter — a responsive OS-shell layout (stacked hero on narrow viewports, taskbar becoming a bottom dock) is already implemented. The GitHub-backed Projects panel depends on GitHub's public API at runtime (unauthenticated, client-side) and has real loading/error states for when that API is unreachable or rate-limited.

## Capabilities and Constraints

- Stack: React + TypeScript + Vite + Tailwind v4, built as a single-file production bundle (`vite-plugin-singlefile`) — assets get base64-inlined rather than served separately, which caps how large any embedded image/art can reasonably be.
- Window manager: draggable/resizable/minimizable windows, a running-apps taskbar, app registry (`src/os/apps/registry.tsx` + `meta.ts`) — new "apps" plug into this rather than being one-off pages.
- Terminal (`TerminalApp.tsx`): real command parser (`help`, `neofetch`, `ls`, `cd`, app-opening commands, an easter-egg `sudo` path). Copy in here is intentionally in-voice.
- GitHub Projects (`src/github/*`): unauthenticated REST calls only — no token in the client by design (see `config.ts` comments on why). Username is `VITE_GITHUB_USERNAME` (env var, not hardcoded). Status priority: `archived` → `.spectre.yml status` → `status-wip`/`status-completed` topic → default WIP.
- Constraint (explicit, from the person building this): no localStorage/browser storage in the OS shell's own state — window state, notes, etc. live in React state only and reset on reload. This has been the working assumption throughout; treat it as intentional unless told otherwise.
- Undecided: whether/when the static WORK folder project entries get replaced with `deathspectre`'s real shipped work — see Evidence on Hand.

## Brand Commitments

- Name: SPECTRE.OS. Identity: "Death Spectre" / GitHub `deathspectre`. Wordmark logo (the angular "S" emblem, both as a raster image and ASCII-art renders) is user-provided artwork, already wired into the hero, top bar, bottom bar, and terminal `neofetch`.
- Tagline: "TERMINAL FOR IDEAS." Footer line: "CODE • BUILD • ENGINEER • CREATE."
- Voice is deliberately split by zone, confirmed directly: **playful/irreverent in OS chrome** (boot screen, terminal banner, system notifications, error states like "coffee.exe has stopped responding") but **serious in project write-ups** (case-study descriptions, metrics, README previews). Don't flatten this distinction in either direction — chrome copy shouldn't get corporate, and project copy shouldn't get jokey.

## Evidence on Hand

- Real, shipped work referenced in prior sessions: SmartDine (restaurant management SaaS, sole developer/owner), Craftwork.AI (studio site targeting restaurant clients), Minecraft plugins sold under "Death Spectre" on Spigot (including a PlayerContract plugin), VelocityJunkie (a from-scratch Java/LWJGL racing game engine, NFS Most Wanted/Carbon–inspired), and several client restaurant websites (Touch Of Spice, Sichuan & Co, Vasudeva).
- **Gap to flag**: the current WORK folder's static project entries (ReplayCore, Citadel, MythicEntities, ConcurrentKV, etc.) are placeholder/demo content — they are NOT the real projects listed above. Don't treat them as evidence of what Ankush has actually built, and don't extend/polish them as if they were real case studies without checking first. Replacing them with the real project list is an open task, not yet done.
- The GitHub live-index mechanism (topic `spectre-portfolio`, `.spectre.yml`) is real and functional, but depends on Ankush actually tagging his real repos with that topic — as of this record, unverified whether any repo has been tagged yet.

## Product Principles

1. The interface is the pitch — craft in the OS shell itself counts as much as the content inside it.
2. Never fabricate portfolio content (metrics, testimonials, project claims). GitHub is the source of truth for the Projects section by design; static copy elsewhere should stay honest about what's real vs. placeholder.
3. Respect the voice split: irreverent chrome, serious substance. Don't let one bleed into the other.
4. Prefer additive, modular changes (new app in the registry, new GitHub-module file) over restructuring what already works — this project has been built incrementally across many sessions and stability matters.
5. No client-side secrets. The GitHub integration's "unauthenticated only, no token in the browser" rule is a hard constraint, not a preference.

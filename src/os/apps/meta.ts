/* Pure app metadata — no imports, avoids module cycles with the registry. */

export interface AppMeta {
  appId: string;
  title: string;
  glyph: string;
  w: number;
  h: number;
  singleton?: boolean;
  resizable?: boolean;
}

export const APP_META: Record<string, AppMeta> = {
  work: { appId: "work", title: "WORK", glyph: "📁", w: 760, h: 500, singleton: true, resizable: true },
  brain: { appId: "brain", title: "BRAIN", glyph: "🧠", w: 860, h: 580, singleton: true, resizable: true },
  lab: { appId: "lab", title: "LAB", glyph: "🧪", w: 740, h: 540, singleton: true, resizable: true },
  notes: { appId: "notes", title: "NOTES", glyph: "📓", w: 720, h: 540, singleton: true, resizable: true },
  system: { appId: "system", title: "SYSTEM", glyph: "⚙", w: 680, h: 540, singleton: true, resizable: true },
  contact: { appId: "contact", title: "CONTACT", glyph: "📡", w: 640, h: 540, singleton: true, resizable: true },
  terminal: { appId: "terminal", title: "TERMINAL", glyph: "▣", w: 720, h: 460, singleton: true, resizable: true },
  about: { appId: "about", title: "README.txt", glyph: "▭", w: 580, h: 480, singleton: true, resizable: true },
  project: { appId: "project", title: "PROJECT", glyph: "◜", w: 780, h: 580, resizable: true },
  ghproject: { appId: "ghproject", title: "GH PROJECT", glyph: "⑂", w: 780, h: 600, resizable: true },
};

export type AppId = keyof typeof APP_META;

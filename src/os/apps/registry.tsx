import type { ComponentType } from "react";
import type { AppProps } from "@/os/ui";
import WorkApp from "./WorkApp";
import ProjectApp from "./ProjectApp";
import GithubProjectApp from "./GithubProjectApp";
import BrainApp from "./BrainApp";
import LabApp from "./LabApp";
import NotesApp from "./NotesApp";
import SystemApp from "./SystemApp";
import ContactApp from "./ContactApp";
import TerminalApp from "./TerminalApp";
import AboutApp from "./AboutApp";

export const APP_COMPONENTS: Record<string, ComponentType<AppProps>> = {
  work: WorkApp,
  project: ProjectApp,
  ghproject: GithubProjectApp,
  brain: BrainApp,
  lab: LabApp,
  notes: NotesApp,
  system: SystemApp,
  contact: ContactApp,
  terminal: TerminalApp,
  about: AboutApp,
};

export function renderApp(appId: string, props: AppProps) {
  const Comp = APP_COMPONENTS[appId];
  return Comp ? <Comp {...props} /> : null;
}

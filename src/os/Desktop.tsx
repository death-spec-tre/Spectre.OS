import { useEffect } from "react";
import { useOS } from "./OSContext";
import Window from "./Window";
import { renderApp } from "./apps/registry";
import Notifications from "./Notifications";
import SystemShell from "./SystemShell";
import BackgroundLayer from "./BackgroundLayer";
export default function Desktop() {
  const os = useOS();
  useEffect(() => {
    const t = window.setTimeout(
      () =>
        os.notify(
          "SPECTRE.OS",
          "Session started. Select a module from the shell — or open TERMINAL and type 'help'.",
          "accent",
        ),
      1400,
    );
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="os-skin vignette desktop-grid desktop-live relative h-full w-full overflow-hidden">
      <BackgroundLayer />
      <div className="ambient-glow" aria-hidden="true" />
      <SystemShell />

      {os.windows.map((w) => (
        <Window key={w.id} win={w}>
          {renderApp(w.appId, { payload: w.payload, winId: w.id })}
        </Window>
      ))}

      <Notifications />
    </div>
  );
}

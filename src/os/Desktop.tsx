import { useEffect } from "react";
import { useOS } from "./OSContext";
import Window from "./Window";
import { renderApp } from "./apps/registry";
import Notifications from "./Notifications";
import SystemShell from "./SystemShell";

export default function Desktop() {
  const os = useOS();

  useEffect(() => {
    const t = window.setTimeout(
      () =>
        os.notify(
          "SPECTRE.OS",
          "Session started. Select a module from the shell — or open TERMINAL and type 'help'.",
          "accent"
        ),
      1400
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="os-skin vignette desktop-grid relative h-full w-full overflow-hidden">
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

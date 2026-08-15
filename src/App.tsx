import { useState } from "react";
import { OSProvider } from "./os/OSContext";
import BootScreen from "./os/BootScreen";
import Desktop from "./os/Desktop";
export default function App() {
  const [booted, setBooted] = useState(false);
  return (
    <OSProvider>
      <div className="os-skin fixed inset-0 overflow-hidden bg-void font-mono text-ink">
        {booted ? <Desktop /> : <BootScreen onDone={() => setBooted(true)} />}
      </div>
    </OSProvider>
  );
}

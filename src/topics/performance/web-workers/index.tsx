import { useEffect, useState } from "react";
import { GitHubCard } from "@/components";
import "../prefetch/on-demand/OnDemandPrefetch.scss";
import BlockingUI from "./BlockingUI";
import NonBlockingUI from "./NonBlockingUI";

export default function WebWorkersDemo() {
  const [uiCounter, setUiCounter] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setUiCounter((c) => (c + 1) % 1000000), 16);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="on-demand-prefetch-demo">
      <h2>Web Workers: Blocking vs Background</h2>
      <p>
        Click the buttons to run a heavy 2s computation. The first blocks the
        UI, the second runs in a Worker so the UI stays responsive.
      </p>

      <div className="explanation">
        <h3>Why use Web Workers?</h3>
        <p>
          Heavy synchronous work on the main thread freezes input, animations,
          and rendering. Workers offload that work to a separate thread.
        </p>
      </div>

      <GitHubCard
        repository="en-atul/react-perf"
        filePath="src/topics/performance/web-workers/index.tsx"
        title="View Implementation Code"
        description="Compare main-thread blocking vs. worker-based computation"
      />

      <div
        className="demo-buttons"
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "start",
        }}
      >
        <BlockingUI />
        <NonBlockingUI />
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>UI Responsiveness Indicator:</strong>
        <div style={{ marginTop: 8 }}>
          Counter keeps ticking if UI isn't blocked: {uiCounter}
        </div>
      </div>
    </div>
  );
}

import { GitHubCard } from "@/components";
import "./OnDemandPrefetch.scss";
import NetworkMonitor from "@/components/NetworkMonitor";
import LoadWithPrefetchAndDemand from "./LoadWithPrefetchAndDemand";
import LoadOnDemand from "./LoadOnDemand";

export function OnDemandPrefetchDemo() {
  return (
    <div className="on-demand-prefetch-demo">
      <h2>On Demand and Smart Preload/Prefetch Demo</h2>
      <p>
        Experience the power of predictive loading: hover to preload, click to
        open instantly. Move your cursor away to cancel unnecessary downloads.
      </p>

      <div className="explanation">
        <h3>What is On Demand and Smart Preload/Prefetch?</h3>
        <p>
          This advanced technique predicts user intent and optimizes loading
          accordingly. When you hover over a button, it begins downloading the
          component in the background. If you click before preloading finishes,
          it continues loading on-demand. If you move away, it immediately
          cancels to save bandwidth.
        </p>

        <div className="benefits">
          <h4>Key Advantages:</h4>
          <ul>
            <li>Lightning-fast opening when preloaded</li>
            <li>Seamless fallback for immediate clicks</li>
            <li>Intelligent bandwidth management</li>
            <li>Zero waste on abandoned interactions</li>
            <li>Better perceived performance</li>
          </ul>
        </div>
      </div>

      <GitHubCard
        repository="en-atul/react-perf"
        filePath="src/topics/performance/prefetch/on-demand/index.tsx"
        title="View Implementation Code"
        description="Explore the complete source code with intelligent preloading logic"
      />

      <div className="demo-buttons">
        <LoadWithPrefetchAndDemand />
        <LoadOnDemand />
      </div>

      <NetworkMonitor types={{ js: true }} />
    </div>
  );
}

export default OnDemandPrefetchDemo;

import { GitHubCard } from "@/components";

import "../demo.scss";
import "./memoize.scss";
import ReactMemo from "./ReactMemo";
import UseCallback from "./UseCallback";
import UseMemo from "./UseMemo";
import AdvancedMemo from "./AdvancedReactMemo";

export default function Memoization() {
  return (
    <div className="on-demand-prefetch-demo">
      <h2>React Memoization Techniques</h2>
      <p>
        Explore different memoization techniques to prevent unnecessary re-renders and expensive calculations.
        Learn when and how to use React.memo, useMemo, and useCallback for optimal performance.
      </p>

      <div className="explanation">
        <h3>What is Memoization?</h3>
        <p>
          Memoization is an optimization technique that caches the results of expensive operations
          and returns the cached result when the same inputs occur again. In React, this prevents
          unnecessary re-renders and recalculations.
        </p>
      </div>

      <GitHubCard
        repository="en-atul/react-perf"
        filePath="src/topics/performance/memoization/index.tsx"
        title="View Implementation Code"
        description="Prevent unnecessary re-renders with React.memo, useMemo, and useCallback"
      />

      <div className="demo-buttons">
        <ReactMemo />
        <UseMemo />
        <UseCallback />
        <AdvancedMemo/>
      </div>
    </div>
  );
}

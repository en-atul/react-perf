import React, { Suspense, useState, useRef } from "react";
import "./OnDemandPrefetch.scss";

const AsyncHeavyComponentModalForOnDemand = React.lazy(() =>
  import(
    /* webpackChunkName: "async-heavy-component-modal-on-demand" */ "./AsyncHeavyComponentModal2"
  ).then((module) => ({ default: module.default }))
);

export function LoadOnDemand() {
  const [showModal, setShowModal] = useState(false);
  const [onDemandOpenMs, setOnDemandOpenMs] = useState<number | null>(null);
  const onDemandClickStartRef = useRef<number | null>(null);

  return (
    <div>
      <div>
        <button
          className="on-demand-prefetch-btn demo-btn modal-btn"
          onClick={() => {
            onDemandClickStartRef.current = performance.now();
            setShowModal(true);
          }}
        >
          On-Demand Load
        </button>
        {onDemandOpenMs !== null && (
          <div style={{ marginTop: 8, color: "#374151" }}>
            Open time (on-demand): {onDemandOpenMs.toFixed(0)} ms
          </div>
        )}
      </div>

      {showModal && (
        <Suspense fallback={<div>Loading modal...</div>}>
          <AsyncHeavyComponentModalForOnDemand
            onClose={() => setShowModal(false)}
            isOpen
            onReady={() => {
              const now = performance.now();
              if (onDemandClickStartRef.current !== null) {
                setOnDemandOpenMs(now - onDemandClickStartRef.current);
                onDemandClickStartRef.current = null;
              }
            }}
          />
        </Suspense>
      )}

    </div>
  );
}

export default LoadOnDemand;

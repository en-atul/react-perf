import React, {
  Suspense,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { GitHubCard } from "@/components";
import "./OnDemandPrefetch.scss";

const AsyncHeavyComponentModal = React.lazy(() =>
  import(
    /* webpackChunkName: "async-heavy-component-modal" */ "./AsyncHeavyComponentModal"
  ).then((module) => ({ default: module.default }))
);


const preloadComponent = (importFunction: () => Promise<any>) => {
  return importFunction();
};

export function useOnDemandPrefetch() {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadPromise, setPreloadPromise] = useState<Promise<any> | null>(
    null
  );
  const preloadTimeoutRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startPreload = useCallback(
    (importFunction: () => Promise<any>, delay = 0) => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      preloadTimeoutRef.current = setTimeout(() => {
        setIsPreloading(true);
        const promise = preloadComponent(importFunction);
        setPreloadPromise(promise);

        promise
          .then(() => {
            if (!abortControllerRef.current?.signal.aborted) {
              setIsPreloading(false);
              setPreloadPromise(null);
            }
          })
          .catch(() => {
            if (!abortControllerRef.current?.signal.aborted) {
              setIsPreloading(false);
              setPreloadPromise(null);
            }
          });
      }, delay);
    },
    []
  );

  const cancelPreload = useCallback(() => {
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
      preloadTimeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setPreloadPromise(null);
    setIsPreloading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isPreloading,
    startPreload,
    cancelPreload,
  };
}

interface ModalTriggerPointProps {
  children: React.ReactNode;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  preloadDelay?: number;
  className?: string;
  importTarget: () => Promise<any>;
  onClick?: () => void;
}

export function ModalTriggerPoint({
  children,
  onHoverStart,
  onHoverEnd,
  preloadDelay = 0,
  className = "",
  importTarget,
  onClick,
}: ModalTriggerPointProps) {
  const { startPreload, cancelPreload, isPreloading } = useOnDemandPrefetch();
  const [hasStartedPreload, setHasStartedPreload] = useState(false);

  const handleMouseEnter = useCallback(() => {
    onHoverStart?.();
    setHasStartedPreload(true);
    startPreload(importTarget, preloadDelay);
  }, [onHoverStart, startPreload, preloadDelay, importTarget]);

  const handleMouseLeave = useCallback(() => {
    onHoverEnd?.();
    cancelPreload();
  }, [onHoverEnd, cancelPreload]);

  const handleClick = useCallback(() => {
    if (!hasStartedPreload) {
      startPreload(importTarget, 0);
    }
    // Always call the onClick handler
    onClick?.();
  }, [hasStartedPreload, startPreload, importTarget, onClick]);

  return (
    <button
      className={`on-demand-prefetch-btn ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {isPreloading && <span className="preload-indicator">⏳</span>}
    </button>
  );
}

export function OnDemandPrefetchDemo() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="on-demand-prefetch-demo">
      <h2>On Demand and Smart Preload/Prefetch Demo</h2>
      <p>
        Experience the power of predictive loading: hover to preload, click to open instantly. 
        Move your cursor away to cancel unnecessary downloads.
      </p>

      <div className="explanation">
        <h3>What is On Demand and Smart Preload/Prefetch?</h3>
        <p>
          This advanced technique predicts user intent and optimizes loading accordingly. 
          When you hover over a button, it begins downloading the component in the background. 
          If you click before preloading finishes, it continues loading on-demand. 
          If you move away, it immediately cancels to save bandwidth.
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

      <ModalTriggerPoint
        onHoverStart={() => console.log("Starting background preload...")}
        onHoverEnd={() => console.log("Cancelled preload")}
        preloadDelay={0}
        className="demo-btn modal-btn"
        importTarget={() =>
          import(
            /* webpackChunkName: "async-heavy-component-modal" */ "./AsyncHeavyComponentModal"
          )
        }
        onClick={() => setShowModal(true)}
      >
         Hover to Preload & Click to Open
      </ModalTriggerPoint>
      {showModal && (
        <Suspense fallback={<div>Loading modal...</div>}>
          <AsyncHeavyComponentModal
            onClose={() => setShowModal(false)}
            isOpen
          ></AsyncHeavyComponentModal>
        </Suspense>
      )}
    </div>
  );
}

export default OnDemandPrefetchDemo;

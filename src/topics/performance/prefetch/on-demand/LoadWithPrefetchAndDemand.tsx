import React, {
  Suspense,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
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

export function LoadWithPrefetchAndDemand() {
  const [showModal, setShowModal] = useState(false);
  const [prefetchOpenMs, setPrefetchOpenMs] = useState<number | null>(null);
  const prefetchClickStartRef = useRef<number | null>(null);

  return (
    <div>
      <div>
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
          onClick={() => {
            prefetchClickStartRef.current = performance.now();
            setShowModal(true);
          }}
        >
          Hover to Preload & Click to Open
        </ModalTriggerPoint>
        {prefetchOpenMs !== null && (
          <div style={{ marginTop: 8, color: "#374151" }}>
            Open time (prefetch): {prefetchOpenMs.toFixed(0)} ms
          </div>
        )}
      </div>

      {showModal && (
        <Suspense fallback={<div>Loading modal...</div>}>
          <AsyncHeavyComponentModal
            onClose={() => setShowModal(false)}
            isOpen
            onReady={() => {
              const now = performance.now();
              if (prefetchClickStartRef.current !== null) {
                setPrefetchOpenMs(now - prefetchClickStartRef.current);
                prefetchClickStartRef.current = null;
              }
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

export default LoadWithPrefetchAndDemand;

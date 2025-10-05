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

const cancelPreload = (preloadPromise: Promise<any> | null) => {
  return null;
};

// On-demand prefetch hook
export function useOnDemandPrefetch() {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadPromise, setPreloadPromise] = useState<Promise<any> | null>(
    null
  );
  const preloadTimeoutRef = useRef<number | null>(null);

  const startPreload = useCallback(
    (importFunction: () => Promise<any>, delay = 0) => {
      // Clear any existing timeout
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }

      // Set a delay before starting preload (optional)
      preloadTimeoutRef.current = setTimeout(() => {
        setIsPreloading(true);
        const promise = preloadComponent(importFunction);
        setPreloadPromise(promise);

        promise
          .then(() => {
            setIsPreloading(false);
            setPreloadPromise(null);
          })
          .catch(() => {
            setIsPreloading(false);
            setPreloadPromise(null);
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

    if (preloadPromise) {
      // Cancel the preload promise
      setPreloadPromise(null);
    }

    setIsPreloading(false);
  }, [preloadPromise]);

  useEffect(() => {
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, []);

  return {
    isPreloading,
    startPreload,
    cancelPreload,
  };
}

// On-demand prefetch button component
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

  const handleMouseEnter = useCallback(() => {
    onHoverStart?.();
    // Start preloading the provided target
    startPreload(importTarget, preloadDelay);
  }, [onHoverStart, startPreload, preloadDelay, importTarget]);

  const handleMouseLeave = useCallback(() => {
    onHoverEnd?.();
    // Cancel preload if user moves cursor away
    cancelPreload();
  }, [onHoverEnd, cancelPreload]);

  return (
    <button
      className={`on-demand-prefetch-btn ${className} ${
        isPreloading ? "preloading" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
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
      <h2>On-Demand Prefetch Demo</h2>
      <p>
        Hover over the buttons to start preloading components. Move your cursor
        away to cancel the preload.
      </p>

      <ModalTriggerPoint
        onHoverStart={() => console.log("Starting modal preload...")}
        onHoverEnd={() => console.log("Cancelled modal preload")}
        preloadDelay={0}
        className="demo-btn modal-btn"
        importTarget={() =>
          import(
            /* webpackChunkName: "async-heavy-component-modal" */ "./AsyncHeavyComponentModal"
          )
        }
        onClick={() => setShowModal(true)}
      >
        Preload (hover) & Open Modal (click)
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


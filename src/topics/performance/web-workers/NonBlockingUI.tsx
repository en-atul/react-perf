import { useEffect, useRef, useState } from "react";

export default function NonBlockingUI() {
  const [workerTimeMs, setWorkerTimeMs] = useState<number | null>(null);
  const [isWorkerWorking, setIsWorkerWorking] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const [workerInput, setWorkerInput] = useState("");

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const startWorker = () => {
    if (!workerRef.current) {
      try {
        workerRef.current = new Worker(new URL("./worker.ts", import.meta.url));
      } catch (err) {
        try {
          const blob = new Blob(
            [
              `self.addEventListener('message', function(e){\n` +
                `  var durationMs = e.data.durationMs;\n` +
                `  var start = performance.now();\n` +
                `  var count = 0;\n` +
                `  while (performance.now() - start < durationMs){ count += Math.sqrt(Math.random() * 1000); }\n` +
                `  self.postMessage({ result: count });\n` +
                `});`,
            ],
            { type: "application/javascript" }
          );
          const url = URL.createObjectURL(blob);
          workerRef.current = new Worker(url);
        } catch {}
      }
    }
  };

  const handleWorkerClick = () => {
    startWorker();
    if (!workerRef.current) return;
    setIsWorkerWorking(true);
    const t0 = performance.now();

    const handleMessage = (e: MessageEvent) => {
      const { result } = e.data as { result: number };

      console.log("----Result from worker computation:", result);
      const t1 = performance.now();
      setWorkerTimeMs(t1 - t0);
      setIsWorkerWorking(false);
      workerRef.current?.removeEventListener("message", handleMessage);
    };

    workerRef.current.addEventListener("message", handleMessage);
    workerRef.current.postMessage({ durationMs: 2000 });
  };

  return (
    <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}>
      <h4 style={{ margin: 0, marginBottom: 8 }}>
        Web Worker (Non‑Blocking UI)
      </h4>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        Try typing while it runs — the input should remain responsive.
      </p>
      <input
        value={workerInput}
        onChange={(e) => setWorkerInput(e.target.value)}
        placeholder="Type here — remains responsive"
        style={{
          width: "100%",
          padding: 8,
          border: "1px solid #d1d5db",
          borderRadius: 6,
          marginBottom: 8,
        }}
      />

      <button
        className="on-demand-prefetch-btn demo-btn"
        onClick={handleWorkerClick}
        disabled={isWorkerWorking}
      >
        {isWorkerWorking
          ? "Computing in Worker..."
          : "Run in Worker (non‑blocking)"}
      </button>

      {workerTimeMs !== null && (
        <div style={{ marginTop: 8, color: "#374151" }}>
          Elapsed (worker): {workerTimeMs.toFixed(0)} ms
        </div>
      )}
    </div>
  );
}

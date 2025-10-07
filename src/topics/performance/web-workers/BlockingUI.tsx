import { useState } from "react";

function blockMainThread(durationMs: number) {
  const start = performance.now();
  let count = 0;

  // Block the main thread for the specified duration
  while (performance.now() - start < durationMs) {
    count += Math.sqrt(Math.random() * 1000);
  }
  return count;
}

export default function BlockingUI() {
  const [blockingTimeMs, setBlockingTimeMs] = useState<number | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [blockingInput, setBlockingInput] = useState("");

  const handleBlockClick = () => {
    setIsWorking(true);
    const t0 = performance.now();
    const result = blockMainThread(2000);
    const t1 = performance.now();
    setBlockingTimeMs(t1 - t0);

    console.log("----Result from blocking computation:", result);
    if (result < 0) console.log(result);
    setIsWorking(false);
  };

  return (
    <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}>
      <h4 style={{ margin: 0, marginBottom: 8 }}>Main Thread (Blocking UI)</h4>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        Try typing, click the button, then type again while it runs — it will
        freeze.
      </p>
      <input
        value={blockingInput}
        onChange={(e) => setBlockingInput(e.target.value)}
        placeholder="Type here — will freeze during computation"
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
        onClick={handleBlockClick}
        disabled={isWorking}
      >
        {isWorking ? "Computing (blocks UI)..." : "Run Blocking Computation"}
      </button>

      {blockingTimeMs !== null && (
        <div style={{ marginTop: 8, color: "#374151" }}>
          Elapsed (blocking): {blockingTimeMs.toFixed(0)} ms
        </div>
      )}
    </div>
  );
}

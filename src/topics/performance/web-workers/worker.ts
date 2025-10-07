// The worker performs the same heavy busy loop without blocking the UI.
self.addEventListener("message", (e: MessageEvent) => {
  const { durationMs } = e.data as { durationMs: number };
  const start = performance.now();
  let count = 0;
  while (performance.now() - start < durationMs) {
    count += Math.sqrt(Math.random() * 1000);
  }

  self.postMessage({ result: count });
});

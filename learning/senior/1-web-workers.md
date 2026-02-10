# Senior Performance: Offloading to Web Workers

## The Problem: The Main Thread Block
JavaScript is single-threaded. This means your UI rendering (React updates, CSS animations) and your Logic (heavy math, data parsing) share the same CPU time.

If your Logic takes >16ms (1 frame at 60fps), your UI **will freeze**.

### Scenario: The Trading App
When we calculate 50 different technical indicators for 5,000 data points:
1.  User clicks "Load AAPL".
2.  App calculates SMA, EMA, RSI, MACD, Elliott Waves...
3.  **UI FREEZES for 200ms.**
4.  Chart appears.

This "jank" distinguishes a Junior app from a Senior/Native-feeling app.

## The Solution: Web Workers
Web Workers allow you to run JavaScript in a **separate thread**.

### Architecture
-   **Main Thread (UI):** "Hey Worker, here is the raw data. Analyze it."
-   **Worker Thread (Background):** "Received. Crunching numbers... Done."
-   **Main Thread (UI):** "Thanks. I'll render the chart now."

## Implementation Pattern
We don't need complex libraries. The native API is powerful.

```typescript
// 1. worker.ts (The Logic)
self.onmessage = (e: MessageEvent) => {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
};

// 2. Component.tsx (The UI)
useEffect(() => {
  const worker = new Worker(new URL('./worker.ts', import.meta.url));
  
  worker.onmessage = (e) => {
    setData(e.data);
  };
  
  worker.postMessage(rawData);
  
  return () => worker.terminate(); // Cleanup!
}, [rawData]);
```

## "Gotchas" for Seniors
1.  **Serialization:** You can only pass JSON-serializable data. You cannot pass functions or DOM elements to a worker.
2.  **Overhead:** Spawning a worker has a cost (~40ms). Reuse workers or use a "Worker Pool" for frequent small tasks.
3.  **Vite/Webpack:** Modern bundlers handle `new Worker(new URL(...))` automatically, bundling the worker code separately.

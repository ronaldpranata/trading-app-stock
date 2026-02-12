# React Basics & Interview Guide

This guide covers fundamental React concepts often asked in interviews, mapped to examples in our `trading-app`.

## Core Concepts

### 1. What is React and how does it work?
**Answer:** React is a JavaScript library for building user interfaces. It uses a **Virtual DOM** (a lightweight copy of the actual DOM) to track changes. When state changes, React compares the Virtual DOM with the real DOM (Disffing) and only updates the parts that changed (Reconciliation), making it very fast.

### 2. What is the difference between State and Props?
**Answer:**
- **Props** (Properties) are read-only data passed *down* from a parent to a child component. They make components reusable.
  - *Example:* Passing `data={chartData}` to `StockChartDisplay`.
- **State** is mutable data managed *internal* to the component. When state changes, the component re-renders.
  - *Example:* `const [timeRange, setTimeRange] = useState('3M')` inside `StockChart`.

### 3. What involves the Component Lifecycle in Functional Components?
**Answer:** In modern React (Functional Components), we use the `useEffect` hook to handle side effects that correspond to lifecycle methods:
- **Mounting (componentDidMount):** `useEffect(() => { ... }, [])` (Empty dependency array).
- **Updating (componentDidUpdate):** `useEffect(() => { ... }, [prop])` (Runs when `prop` changes).
- **Unmounting (componentWillUnmount):** Returning a cleanup function from `useEffect`.

#### Example: Cleanup (componentWillUnmount)
This is crucial for clearing timers, subscriptions, or event listeners to prevent memory leaks.

```tsx
useEffect(() => {
  // Mount: Start a timer
  const timer = setInterval(() => {
    console.log('Polling data...');
  }, 1000);

  // Unmount: Cleanup function
  return () => {
    clearInterval(timer); // Stops the timer when component is removed
    console.log('Component unmounted, timer cleared.');
  };
}, []); // Empty array = runs once on mount
```

---

## Hooks (The "Magic" Functions)

### 4. What is the `useState` hook?
**Answer:** It declares a state variable. It returns a pair: the current state value and a function to update it.
```tsx
const [price, setPrice] = useState(100);
```

### 5. What is `useEffect` and when does it run?
**Answer:** It handles "side effects" like fetching data, subscriptions, or manually changing the DOM. It runs **after** the render.
- If dependencies `[]` are empty: Runs only once on mount.
- If dependencies `[symbol]` has values: Runs whenever `symbol` changes.
- If no array: Runs on *every* render (dangerous!).

### 6. What are `useMemo` and `useCallback`? (Performance)
**Answer:** They are used to prevent unnecessary re-computations or re-renders.
- **useMemo:** Caches the **result** of a calculation.
  - *Example:* `const chartData = useMemo(() => expensiveCalculation(data), [data]);`
- **useCallback:** Caches the **function definition** itself so it doesn't get recreated on every render.
  - *Example:* Passing a click handler to a child component (like `handleTimeRangeChange` in `StockChart`).

### 7. What involves Prop Drilling and how do we solve it?
**Answer:** Prop drilling is passing data through many layers of components just to get it to a deeply nested child.
**Solutions:**
1.  **Context API:** For global themes or user auth (e.g., our `ThemeRegistry`).
2.  **Redux/Zustand:** For complex global state manager (e.g., our `stockSlice` allows any component to read stock data without passing props).
3.  **Composition:** Passing components as `children`.

---

## Modern React Features

### 8. Client vs. Server Components (Next.js)
**Answer:**
- **Server Components (RSC):** Render on the server, send HTML to the browser. Access backend directly. No `useState`/`useEffect`. (Default in `app/page.tsx`).
- **Client Components (`'use client'`):** Render in the browser. Interactive (listeners, state). (Used in `StockChart.tsx`).

### 9. What is the Virtual DOM?
**Answer:** It's an in-memory representation of the real DOM. React creates a tree of elements in memory, checks what changed, and efficiently updates the browser DOM in a batch process. This minimizes slow DOM manipulations.

## Code examples in this project

- **Props:** See `PredictionDisplay({ prediction, currentPrice })`.
- **State:** See `activeTab` in `SingleStockView`.
- **Effects:** See `useStock` hook fetching data when `symbol` changes.
- **Memoization:** See `StockChart.tsx` wrapping `StockChartDisplay` in `memo`.

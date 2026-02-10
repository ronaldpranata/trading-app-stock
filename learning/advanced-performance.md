# Advanced React Performance: Thinking in Render Cycles

To move from "Junior" to "Senior," you must stop thinking about "Page Loads" and start thinking about **Render Cycles**. React is fast, but you can make it slow if you misunderstand *Stability*.

## 1. The Render Cycle & Referential Identity

In JavaScript, objects and functions are compared by *reference*, not value.

```javascript
{} === {} // false
[] === [] // false
(() => {}) === (() => {}) // false
```

**Why this matters:**
Every time a component re-renders, all functions inside it are re-created. Their *reference* changes.

```tsx
function MyComponent() {
  // This function is NEW every single render
  const handleClick = () => { ... }; 
  
  // This child will re-render EVERY time, even if nothing changed!
  // Because 'onClick' prop has a new reference.
  return <Child onClick={handleClick} />;
}
```

## 2. Stability: `useCallback` and `useMemo`

We use these hooks to preserve "Referential Identity" (Stability).

**From `src/hooks/useStock.ts`:**
```typescript
  // We wrap this in useCallback so the 'load' function
  // stays the same (stable) between renders.
  const load = useCallback(
    (stockSymbol: string) => {
      dispatch(setPrimarySymbol(stockSymbol));
    },
    [dispatch] // Only recreating if 'dispatch' changes (which it never does)
  );
```

**Rule of Thumb:**
- Wrap functions passed to children in `useCallback`.
- Wrap expensive calculations in `useMemo`.
- **Don't** wrap cheap calculations. The overhead of the hook costs more than `a + b`.

## 3. The `useEffect` Trap

If your dependencies aren't stable, `useEffect` runs too often.

```typescript
// BAD
useEffect(() => {
  api.fetchData(options); // 'options' is an object created in render body
}, [options]); // Runs every render because options !== options

// GOOD
const stableOptions = useMemo(() => ({ limit: 10 }), []);
useEffect(() => {
  api.fetchData(stableOptions);
}, [stableOptions]); // Runs once
```

## 4. Virtualization (Handling Big Data)

If you render 10,000 stock ticks in a list, the DOM will choke.
**Solution:** Render only what is visible.

React ecosystem libraries like `react-window` allow you to render only the 10 rows on screen, even if the array has 10,000 items.

## 5. React.lazy & Suspense (Code Splitting)

Don't load the admin dashboard code if the user is just looking at the home page.

```tsx
// Only loads 'AdminPanel.js' when it's rendered
const AdminPanel = React.lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<div>Loading component...</div>}>
      {isAdmin && <AdminPanel />}
    </Suspense>
  );
}
```

**Senior Mindset:** Performance isn't about making code shorter. It's about ensuring React does the minimum amount of work necessary to update the UI.

# React Memoization: A Deep Dive

**Prerequisite:** Read [Advanced Performance](./advanced-performance.md) first to understand the "Render Cycle".

Memoization is a performance optimization technique where you cache the result of a calculation (or a component render) so you don't have to redo it if the inputs haven't changed.

## The Big Three

In React, we have three tools for this. They work together like a chain; if one link breaks, the whole optimization fails.

1.  **`React.memo`**: Caches a **Component** (skips re-render).
2.  **`useMemo`**: Caches a **Value** (skips recalculation).
3.  **`useCallback`**: Caches a **Function** (maintains referential identity).

---

## 1. React.memo (The Component Gate)

By default, **if a parent re-renders, all its children re-render**, regardless of whether their props changed.

`React.memo` changes this behavior: "Only re-render this child if its props have changed."

### Example from Our Codebase
We recently optimized `Header.tsx` because it was re-rendering every time `Home` re-rendered (which happens often due to live stock data).

```tsx
// src/components/layout/Header.tsx
import { memo } from 'react';

function Header(props: HeaderProps) {
  // ... rendering logic
}

// Wrap the export in memo
export default memo(Header);
```

**The Catch:** `React.memo` uses a "shallow comparison" of props. This means it checks `prevProp === nextProp`.

---

## 2. useCallback (The Glue)

This is where most optimizations break. If you pass a function to a memoized component, you **must** wrap that function in `useCallback`.

### Why?
In JavaScript, `function() {} === function() {}` is **false**.
Every time the parent renders, it creates a *new* function. If you pass this new function to a child, `React.memo` sees a "new prop" and re-renders the child anyway.

### Bad Pattern (Breaks Memoization)
```tsx
function Parent() {
  // Created FRESH every render
  const handleSelect = (symbol) => { load(symbol); };

  // StockSearch will re-render EVERY time because handleSelect is "new"
  return <StockSearch onSelectStock={handleSelect} />;
}
```

### Good Pattern (Preserves Identity)
```tsx
function Parent() {
  // Stable function reference
  const handleSelect = useCallback((symbol) => {
    load(symbol);
  }, []); // Dependencies

  // StockSearch (memoized) sees the SAME function prop -> No re-render
  return <StockSearch onSelectStock={handleSelect} />;
}
```

We applied this in `src/app/page.tsx` for `handleSymbolChange`.

---

## 3. useMemo (Expensive Props)

Sometimes you need to pass an object or array to a child. Like functions, objects `{}` are new every render.

```tsx
function Parent() {
    // New object every render
    const config = { mode: 'dark', showGraph: true }; 
    
    // Child re-renders because 'config' is a new reference
    return <MemoizedChild config={config} />;
}
```

**Solution:**
```tsx
function Parent() {
    // Cache the object
    const config = useMemo(() => ({ 
        mode: 'dark', 
        showGraph: true 
    }), []);

    return <MemoizedChild config={config} />;
}
```

We used this in `src/app/page.tsx` for `headerProps`.

---

## The "Memoization Chain" Checklist

If your component is still re-rendering, check the chain:

1.  [ ] Is the Component wrapped in `React.memo`?
2.  [ ] Are all **function props** wrapped in `useCallback` by the parent?
3.  [ ] Are all **object/array props** wrapped in `useMemo` by the parent?

If you miss just one, the component will re-render, and your optimization efforts do nothing (or actually cost more due to the overhead).

---

## Advanced Best Practices (Pro Tips)

### 1. Composition over Memoization
Before you reach for `memo`, ask: **Can I restructure my component?**
Often, state is located too high in the tree.

**Bad structure (Requires Memo):**
```tsx
function App() {
  const [color, setColor] = useState('red');
  return (
    <div>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      {/* ExpensiveComponent re-renders when color changes even though it doesn't need color! */}
      <ExpensiveComponent /> 
    </div>
  );
}
```

**Better structure (Composition):**
Push the state down to where it's used.
```tsx
function ColorPicker() {
  const [color, setColor] = useState('red');
  return <input value={color} onChange={(e) => setColor(e.target.value)} />;
}

function App() {
  return (
    <div>
      <ColorPicker />
      <ExpensiveComponent /> {/* Safe! */}
    </div>
  );
}
```
Or use `children` prop to lift the expensive component up.

### 2. Stable Hooks Don't Need Dependencies
React guarantees that `setState` functions (like `setCount`) and `dispatch` (from Redux) are stable. You don't *need* to include them in dependency arrays, but most linters (including ours) will ask you to. It's safe to include them.

### 3. Primitive Props Are Cheap
You do **not** need `useMemo` for strings, numbers, or booleans.
```tsx
// BAD - Unnecessary overhead
const title = useMemo(() => "Dashboard", []);

// GOOD - Primitives compare by value (equality) automatically
const title = "Dashboard";
```

### 4. Custom Comparison Function
`React.memo` accepts a second argument: `arePropsEqual(prevProps, nextProps)`. Use this if you want to ignore specific props.

```tsx
const DataItem = memo(function DataItem({ data, onRemove }) {
  // ...
}, (prev, next) => {
  // Only re-render if ID changes. Ignore 'onRemove' changes!
  return prev.data.id === next.data.id;
});
```
**Warning:** This can lead to stale closures bugs if you aren't careful. Use rarely.

### 5. Premature Optimization
Memoization has a cost.
-   **Memory**: Storing previous inputs/outputs.
-   **CPU**: Running the comparison check `prev === next`.

**Don't** memoize simple components like `<Button>` or `<Icon>`. The comparison check often costs more than just re-rendering the div. Focus on:
-   Lists / Tables
-   Charts / Graphs
-   Heavy computation
-   Components with many children

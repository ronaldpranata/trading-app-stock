# React Hooks Pattern: "The Composable"

This guide explains the Custom Hook pattern, which is the React equivalent of Vue's Composition API (composables). We use this heavily in `src/hooks/useStock.ts`.

## 1. What is a Custom Hook?

A custom hook is just a function that starts with `use`. It can call other hooks (like `useState`, `useEffect`, or `useSelector`).

**Goals of a Custom Hook:**
1.  **Encapsulate Logic:** Hide complex Redux/API logic from the UI.
2.  **Reusability:** Share logic across multiple components.
3.  **Composition:** Combine smaller hooks into larger features.

## 2. Case Study: `useStock`

Let's look at `src/hooks/useStock.ts`. This hook acts as a "Controller" for stock data. The UI component (`page.tsx`) doesn't know *how* data is fetched or stored; it just asks `useStock` for it.

### Step 1: Accessing State (Selectors)

Instead of `this.$store.state.stock...` in every component, we select data once here.

```typescript
// src/hooks/useStock.ts
export function useStock() {
  const dispatch = useAppDispatch();
  
  // Selectors for symbols
  const symbol = useAppSelector(selectPrimarySymbol);
  const comparisonSymbols = useAppSelector(selectComparisonSymbols);
  // ...
```

### Step 2: Fetching Data (RTK Query)

The hook manages the data fetching logic using RTK Query hooks.

```typescript
  // Automatic fetching when `symbol` changes
  const { 
    data: primaryStock, 
    isLoading: isPrimaryLoading, 
    // ...
  } = useGetStockDataQuery(symbol || '', { skip: !symbol });
```

This is like a reactive `watch` effect in Vue Composition API.

### Step 3: Deriving State

We calculate derived values inside the hook, so components get clean data.

```typescript
  // Derived Values
  const currentPrice = primaryStock?.quote?.price || 0;
  const priceChange = {
    change: primaryStock?.quote?.change || 0,
    changePercent: primaryStock?.quote?.changePercent || 0,
    // ...
  };
```

### Step 4: Exposing Actions

We wrap dispatch calls in `useCallback` to prevent unnecessary re-renders in child components.

```typescript
  // Actions
  const load = useCallback(
    (stockSymbol: string) => {
      dispatch(setPrimarySymbol(stockSymbol));
    },
    [dispatch] // Dependencies
  );
```

### Step 5: The Public Interface

Finally, we return an object with everything the UI needs.

```typescript
  return {
    // State
    primaryStock,
    currentPrice,
    isLoading, // Aggregated loading state!
    error,
    
    // Actions
    load,
    refresh,
    addComparison,
  };
}
```

## 3. Why This Pattern?

**Vue Analogy:** This is exactly like a Vue Composable (`useStock.js`) that returns `refs` and methods.

**Benefits:**
- **Decoupled UI:** `page.tsx` is cleaner. It just renders data.
- **Testing:** You can test `useStock` independently from the UI.
- **Changes:** If we switch from Redux to Context API later, we likely only need to update `useStock.ts`, not every component.

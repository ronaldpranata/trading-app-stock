# Modern Redux Architecture: Slices & RTK Query

This guide explains the Redux architecture used in this project, which follows the modern **Redux Toolkit (RTK)** pattern. It differs significantly from older Redux patterns and Vuex.

## 1. The Core Concept: "UI State" vs. "Server State"

In modern frontend development, we separate state into two buckets:

1.  **UI State (Client-only):** Things like "is the modal open?", "what is the current filter?", "which tab is active?".
2.  **Server State (API Data):** Data fetched from the backend (e.g., stock prices, user profile).

We handle these differently in this project.

## 2. Server State: RTK Query (`src/store/api/stockApi.ts`)

Instead of writing manual async functions (thunks) to fetch data (like Vuex actions), we declare **API endpoints**.

```typescript
// src/store/api/stockApi.ts
export const stockApi = createApi({
  reducerPath: 'stockApi', // Unique key in the store
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    // Query: Data fetching (GET requests)
    getStockData: builder.query<StockData, string>({
      // The query function handles the fetching logic
      async queryFn(symbol, _queryApi, _extraOptions, fetchWithBQ) {
         // ... fetch quote, historical, fundamental in parallel ...
         return { data: ... };
      }
    }),
  }),
});

// Auto-generated hook for components
export const { useGetStockDataQuery } = stockApi;
```

**Why this is better than Vuex Actions:**
- **Auto-Caching:** If you request "AAPL" data twice, the second request reads from cache instantly.
- **Auto-Loading state:** No need to manually set `isLoading = true` in your reducers. The hook gives you `isLoading` for free.
- **Deduplication:** Prevents duplicate requests for the same data.

## 3. UI State: Slices (`src/store/slices/stockSlice.ts`)

For state that *isn't* from the API (like "which stock is selected?"), we use **Slices**. This is similar to a Vuex Module but shorter.

```typescript
// src/store/slices/stockSlice.ts
const stockSlice = createSlice({
  name: 'stock',
  initialState: { primarySymbol: null, comparisonSymbols: [] },
  reducers: {
    // Actions are defined directly with the reducer logic
    setPrimarySymbol: (state, action: PayloadAction<string>) => {
      // Immer library allows "mutating" logic safely
      state.primarySymbol = action.payload;
    },
    addComparisonSymbol: (state, action) => {
       state.comparisonSymbols.push(action.payload);
    }
  },
});

export const { setPrimarySymbol } = stockSlice.actions;
export const stockReducer = stockSlice.reducer;
```

**Key difference from Vue:**
- In Vuex, mutations and actions are separate.
- In RTK Slices, reducers generate the actions automatically.

## 4. Derived State: Selectors (`src/store/selectors.ts`)

Selectors are like **Vuex Getters**. They compute derived data from the store.

```typescript
// src/store/selectors.ts

// Simple selector
export const selectStockState = (state: RootState) => state.stock;

// Memoized selector (re-computes only when inputs change)
export const selectPrimarySymbol = createSelector(
  selectStockState,
  (stock) => stock.primarySymbol
);

// Composing selectors
export const selectCanAddMoreComparisons = createSelector(
  selectComparisonSymbols,
  (symbols) => symbols.length < 2
);
```

We use `createSelector` (from Reselect) for performance. It works exactly like a computed property in Vue.

## 5. Connecting it all: The Store (`src/store/index.ts`)

The store combines the Slices and the API.

```typescript
// src/store/index.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,         // UI Slice
    stock: stockReducer,       // UI Slice
    [stockApi.reducerPath]: stockApi.reducer, // API Slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stockApi.middleware), // API Middleware
});
```

This setup gives you the best of both worlds: efficient caching for data (API) and predictable state management for your app (Slices).

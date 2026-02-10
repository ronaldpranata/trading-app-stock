# Getting Started From Scratch

This guide walks you through building a professional React application like this one, starting from an empty folder.

## 1. Initialize the Project

We use **Next.js** as our framework. It handles routing, bundling, and server-side rendering out of the box.

```bash
# 1. Create the app (Select Yes for TypeScript, ESLint, Tailwind, App Router)
npx create-next-app@latest my-trading-app

# 2. Enter the directory
cd my-trading-app
```

## 2. Install Core Dependencies

Install the libraries that power our architecture.

```bash
# State Management (Redux Toolkit)
npm install @reduxjs/toolkit react-redux transform-imports

# UI Components & Icons
npm install lucide-react clsx tailwind-merge

# Charts
npm install recharts

# Animations
npm install framer-motion

# Unit Testing & Validation
npm install -D vitest jsdom @testing-library/react @testing-library/dom @vitejs/plugin-react
```

## 3. Set Up Directory Structure

Clean up the default `src/` folder and create our Feature-First structure.

```bash
cd src
mkdir components features hooks store types utils workers
mkdir components/ui components/layout
```

## 4. Configure Redux Toolkit

### A. Create the Store (`src/store/index.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    // Add reducers here later
  },
  middleware: (getDefault) => getDefault().concat(
    // Add API middleware here later
  ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### B. Create Typed Hooks (`src/store/hooks.ts`)

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### C. Provide the Store (`src/providers.tsx`)

Create a client-side provider component to wrap your app.

```tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

### D. Wrap the App (`src/app/layout.tsx`)

```tsx
import { Providers } from '@/providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## 5. First Feature: Stock Data

### A. Define Types (`src/types/stock.ts`)

```typescript
export interface StockQuote {
  price: number;
  change: number;
  // ...
}
```

### B. Create API Service (`src/store/api/stockApi.ts`)

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getStock: builder.query<StockQuote, string>({
      query: (symbol) => `stock?symbol=${symbol}`,
    }),
  }),
});

export const { useGetStockQuery } = stockApi;
```

### C. Register API in Store (`src/store/index.ts`)

```typescript
import { stockApi } from './api/stockApi';

export const store = configureStore({
  reducer: {
    [stockApi.reducerPath]: stockApi.reducer,
  },
  middleware: (g) => g().concat(stockApi.middleware),
});
```

## 6. Next Steps

1.  **Build Components**: Start creating dumb UI components in `src/components/ui`.
2.  **Add Features**: Create smart components in `src/features/stock`.
3.  **Add Testing**: Configure `vitest.config.ts` and write your first test.
4.  **Add Workers**: If you need heavy math, setup a Web Worker in `src/workers`.

You now have a production-grade foundation!

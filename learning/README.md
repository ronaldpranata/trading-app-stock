# Learning React & Modern Redux: A Step-by-Step Curriculum

Welcome! This documentation is designed to take you from "Vue Developer with some React knowledge" to "Senior React Engineer," using this `trading-app` project as your living textbook.

Follow this path step-by-step.

## Phase 1: The Foundation (Bridging the Gap)
*Start here to map your existing Vue knowledge to React.*

### 1. [React for Vue Developers](./react-vs-vue-concepts.md)
   - **Goal:** Understand how `page.tsx` works compared to a Vue component.
   - **Key Concepts:** JSX vs Templates, `useState` vs `data`, `useEffect` vs Lifecycle.
   - **Practical:** Read this file, then look at `src/app/page.tsx` to identify the patterns.

### 2. [React Hooks Pattern: "The Composable"](./hooks-design-pattern.md)
   - **Goal:** Master the "Custom Hook" pattern, the heart of modern React logic.
   - **Key Concepts:** Encapsulation, Composition, Rules of Hooks.
   - **Practical:** Study `src/hooks/useStock.ts`. It is the "Controller" for our application.

---

## Phase 2: State Management (The Architecture)
*Learn how we handle data at scale without "Prop Drilling".*

### 3. [Modern Redux Architecture](./redux-modern-architecture.md)
   - **Goal:** Stop writing manual `fetch` calls. Learn the "Slice + API" pattern.
   - **Key Concepts:** Redux Toolkit (RTK), RTK Query, Selectors vs Getters.
   - **Practical:** Review `src/store/api/stockApi.ts` (Server State) and `src/store/slices/stockSlice.ts` (UI State).

---

## Phase 3: Senior Engineering (Performance & Scale)
*How to write code that scales to 100+ developers and thousands of rows of data.*

### 4. [TypeScript for Seniors](./typescript-for-seniors.md)
   - **Goal:** Use TypeScript for safety, not just autocomplete.
   - **Key Concepts:** Discriminated Unions (Status states), Generics, Utility Types.
   - **Practical:** Look at `src/types/stock.ts` to see how we define data structures.

### 5. [Advanced Performance](./advanced-performance.md)
   - **Goal:**  Understand the "Render Cycle" and stop accidental re-renders.
   - **Key Concepts:** Referential Identity, `useMemo`, `useCallback`, Virtualization.
   - **Practical:** Understand why we use `useCallback` inside `useStock.ts`.

### 6. [Enterprise Patterns](./enterprise-patterns.md)
   - **Goal:** Architect components that are flexible and maintainable.
   - **Key Concepts:** Compound Components, Render Props, Barrel Files.
   - **Practical:** Think about how you would refactor `StockChart` components to be more composable.

---

## How to Use This
1. Read the guide.
2. Open the referenced file in the codebase.
3. Try to make a small change (e.g., add a new state variable, or a new API endpoint) to test your understanding.

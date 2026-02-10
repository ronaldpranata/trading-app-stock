# Learning React & Modern Redux: A Step-by-Step Curriculum

Welcome! This documentation is designed to take you from "Vue Developer with some React knowledge" to "Senior React Engineer," using this `trading-app` project as your living textbook.

Follow this path step-by-step.

## Phase 1: The Foundation (Bridging the Gap)
*Start here to map your existing Vue knowledge to React.*

### 0. [Getting Started From Zero](./getting-started-from-scratch.md)
   - **Goal:** Setup guide for building this exact project from scratch.
   - **Key Concepts:** Next.js + Redux Toolkit + TypeScript setup.
   - **Practical:** Follow this if you want to rebuild the app yourself.

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

## Phase 3: Senior Engineering (Architecture & Patterns)
*How to write code that scales to 100+ developers.*

### 4. [Project Structure & Best Practices](./project-structure.md)
   - **Goal:** Organize your code using the "Feature-First" Screaming Architecture.
   - **Key Concepts:** Colocation, Barrel Files, Feature Folders.
   - **Practical:** Refactor your `src` folder to match the recommended structure.

### 5. [React Design Patterns](./react-patterns.md)
   - **Goal:** Master established patterns for reusable UI.
   - **Key Concepts:** Container/Presentational, Custom Hooks, Compound Components.
   - **Practical:** Review `src/features/stock/StockChart.tsx` for separation of concerns.

### 6. [TypeScript for Seniors](./typescript-for-seniors.md)
   - **Goal:** Use TypeScript for safety, not just autocomplete.
   - **Key Concepts:** Discriminated Unions (Status states), Generics, Utility Types.
   - **Practical:** Look at `src/types/stock.ts` to see how we define data structures.

### 7. [Advanced Performance](./advanced-performance.md)
   - **Goal:**  Understand the "Render Cycle" and stop accidental re-renders.
   - **Key Concepts:** Referential Identity, `useMemo`, `useCallback`, Virtualization.
   - **Practical:** Understand why we use `useCallback` inside `useStock.ts`.

### 8. [Enterprise Patterns](./enterprise-patterns.md)
   - **Goal:** Additional patterns for complex widgets.
   - **Key Concepts:** Render Props, Slot Pattern.
   - **Practical:** Compare with the patterns learned in Module 5.

---

## Phase 4: Quality Assurance
*Professionalize your workflow with automated testing.*

### 9. [Unit Testing Guide](./unit-testing-guide.md)
   - **Goal:** Write tests for Logic, State, and UI using Vitest.
   - **Key Concepts:** Testing Pyramid, Jest/Vitest, React Testing Library.
   - **Practical:** Run `npm test` to see the examples in `src/utils`, `src/store`, and `src/components`.

### 10. [Integration Testing Guide](./integration-testing-guide.md)
   - **Goal:** Test Hooks with Redux and Components with dynamic props.
   - **Key Concepts:** Mocking Modules, Provider Wrapping, RenderProps.
   - **Practical:** See `src/hooks/__tests__/useStock.test.tsx`.

### 11. [Senior Testing Strategy](./testing-strategy-senior.md)
   - **Goal:** Understand the "Why" behind E2E, Visual Regression, and A11y.
   - **Key Concepts:** The Testing Trophy, CI/CD Pipelines, Accessibility Standards.
   - **Practical:** Run `npx playwright test` to see the full E2E suite in action.

---

## Phase 5: Advanced Optimization & Features
*Pushing the boundaries of performance and reliability.*

### 12. [Web Workers & Performance](./senior/1-web-workers.md)
   - **Goal:** Keep the UI silky smooth (60fps) even during heavy data processing.
   - **Key Concepts:** Parallelism, Thread Safety, Serialization.
   - **Practical:** See `src/workers/analysis.worker.ts` and how `useStock` delegates heavy lifting.

### 13. [Error Boundaries & Resilience](./senior/2-error-boundaries.md)
   - **Goal:** Prevent the "White Screen of Death" when a component crashes.
   - **Key Concepts:** React Lifecycle (`componentDidCatch`), Fallback UI, Isolation.
   - **Practical:** Check `src/components/ErrorBoundary.tsx` and how it wraps complex widgets.

### 14. [React Server Components (RSC)](./senior/3-server-components.md)
   - **Goal:** Understand the future of React architecture (Next.js App Router).
   - **Key Concepts:** Server-side Execution, Zero-Bundle-Size Components, Streaming.
   - **Practical:** Review `src/app/page.tsx` (a Server Component) vs `src/components/StockChart.tsx` ('use client').

---

## How to Use This
1. Read the guide.
2. Open the referenced file in the codebase.
3. Try to make a small change (e.g., add a new state variable, or a new API endpoint) to test your understanding.

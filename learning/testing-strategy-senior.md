# Senior Frontend Testing Strategy

As a senior engineer, your goal isn't just "high coverage"—it's **High Confidence** with **Low Maintenance**.

## 1. The Pyramid vs. The Trophy
In modern React, we move away from testing implementation details (Unit) towards testing user flows (Integration).

-   **Static Analysis (ESLint/TypeScript):** Catch typos/types instantly.
-   **Unit Tests:** For complex math/logic (e.g., `elliottWave.ts`).
-   **Integration Tests (The Sweet Spot):** Render a component/hook, mock the network, and assert on the DOM.
-   **E2E (Playwright):** A few "Smoke Tests" to ensure the app boots and critical paths work.

## 2. Accessibility (A11y) is Non-Negotiable
We use `vitest-axe` to catch low-hanging fruit:
-   Missing `alt` text.
-   Low color contrast.
-   Bad ARIA labels.

**Rule:** Every interactive component (`Button`, `Input`, `Modal`) *must* have an a11y test case.

## 3. Visual Regression (The Next Step)
E2E tests check *functionality*, but they don't check if the button moved 5px or turned pink.
-   **Tool:** Chromatic or Playwright Visual Comparisons.
-   **Strategy:** Snapshot critical UI components (`PriceTicker`, `Chart`) on every PR.

## 4. Continuous Integration (CI)
Tests that only run on your machine are useless.
-   **Pre-commit:** Run related unit tests + simple E2E.
-   **Pull Request:** Run FULL suite + A11y check.
-   **Merge:** Deploy to staging -> Run E2E Smoke Test.

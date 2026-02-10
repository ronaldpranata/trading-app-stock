# Professional Unit Testing in React

Testing is what separates "Coding" from "Engineering". This guide explains how to test your React application using **Vitest** and **React Testing Library**.

## 1. The Strategy: What to Test?

We follow the "Testing Pyramid":
1.  **Unit Tests (Most numerous):** Test individual functions and components.
2.  **Integration Tests:** Test how components work together.
3.  **E2E Tests (Fewest):** Test the full app flow (e.g., Cypress/Playwright).

In this project, we focus on **Unit Tests** for:
- **Business Logic:** Calculations, data transformations.
- **State Management:** Redux slices/reducers.
- **UI Components:** Rendering correctness, critical user interactions.

## 2. Testing Pure Logic (The Easiest)

File: `src/utils/__tests__/technicalAnalysis.test.ts`

These are simple input/output tests. No React, no DOM.

```typescript
it('should calculate SMA correctly', () => {
    const data = [10, 20, 30, 40, 50];
    const sma = calculateSMA(data, 5);
    expect(sma).toBe(30);
});
```

**Philosophy:** Test the *edge cases* (empty arrays, nulls, negative numbers).

## 3. Testing Redux Slices

File: `src/store/slices/__tests__/stockSlice.test.ts`

Reducers are just functions that take `(state, action)` and return `newState`.

```typescript
it('should handle setPrimarySymbol', () => {
    const initialState = { primarySymbol: null };
    const nextState = stockReducer(initialState, setPrimarySymbol('AAPL'));
    expect(nextState.primarySymbol).toEqual('AAPL');
});
```

**Why test this?** To ensure complex state logic (like "max 2 comparison stocks") is enforced correctly.

## 4. Testing Components (The Hardest)

File: `src/components/ui/Badge.test.tsx`

We use `React Testing Library` (RTL).
**Philosophy:** "Test behavior, not implementation details."

Instead of checking "does the component have a state variable called 'isOpen'?", we check "if I click the button, does the text change?".

```typescript
it('renders success variant correctly', () => {
    render(<Badge variant="success">Success</Badge>);
    // Check if the class is applied (Implementation detail? A little, but necessary for UI libs)
    expect(screen.getByText('Success').className).toContain('bg-green-500');
});
```

## 5. Running Tests

We use `Vitest` as our runner. It's fast and compatible with Vite/Next.js.

```bash
npm test        # Runs tests in watch mode
npm run test -- run # Runs tests once (for CI)
```

## Best Practices
1.  **Arrange, Act, Assert:** Structure your tests clearly.
2.  **Mock Externalities:** Don't make real API calls in unit tests. Mock `fetch` or the API hook.
3.  **Don't Snapshot Everything:** Snapshots are brittle. Assert specific values.

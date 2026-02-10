# Enterprise React Patterns: Scaling to 100+ Devs

To build scalable applications, you need patterns that decouple components and logic.

## 1. Compound Components (vs. "God Props")

**Problem:** A Dropdown component that takes 50 props (`isOpen`, `onOpen`, `itemRender`, `footerComponent`, `theme`...). This is unmaintainable.

**Solution:** Compound Components. Instead of props, expose sub-components that share state implicitly (via Context).

```tsx
// Using the pattern
<Select onChange={val => setVal(val)}>
  <Select.Label>Choose a Stock</Select.Label>
  <Select.Trigger />
  <Select.Content>
    <Select.Item value="AAPL">Apple</Select.Item>
    <Select.Item value="GOOGL">Google</Select.Item>
  </Select.Content>
</Select>
```

**Why:** The consumer decides the layout (Label above Trigger? Below?). The `<Select>` component only handles the logic (open/close state).

## 2. Default Exports vs. Named Exports (Codebase Organization)

**Barrel Files (`index.ts`):**
In `src/store/index.ts`, we export everything from one file.

```typescript
export * from './slices/authSlice';
export * from './slices/stockSlice';
export * from './hooks';
```

**Pros:** Cleaner imports (`import { useStock } from '@/store'`).
**Cons:** Can affect tree-shaking if not careful (unused code bundled). Modern bundlers handle this well, but be mindful.

**Named Exports:**
We prefer named exports (`export const MyComponent`) over default (`export default`).
- **Refactoring:** Renaming `MyComponent` automatically refactors imports in VS Code.
- **Consistency:** Enforces the same name across the codebase.

## 3. Render Props (Inversion of Control)

Sometimes you want to share *logic* but let the parent decide the *UI*.

```tsx
// Reusable logic component
<MouseTracker render={({ x, y }) => (
  // Parent decides what to render with that data
  <h1>The mouse is at {x}, {y}</h1>
)} />
```

This pattern is largely replaced by **Custom Hooks**, but is still useful when you need to render something *inside* a library component (e.g., cell renderer in a Data Grid).

## 4. Custom Hook Composition

Don't write one giant hook. Compose them.

**Bad:** `useGodHook()` that fetches user, theme, stock, and settings.
**Good:**

```typescript
function useDashboard() {
  const user = useUser();       // Handled by UserContext
  const theme = useTheme();     // Handled by ThemeContext
  const stock = useStock();     // Handled by Redux
  
  // Combine them for specific dashboard logic
  const canTrade = user.isPremium && stock.isOpen;
  
  return { canTrade, theme };
}
```

**Senior Mindset:** Code is read 10x more than it is written. Optimize for readability and modularity, not for writing fewer lines.

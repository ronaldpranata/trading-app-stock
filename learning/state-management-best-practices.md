# State Management Best Practices: Props vs. Hooks

In React applications, managing how data flows between components is crucial for maintainability and performance. This guide explains why we refactored the application to use **Custom Hooks** instead of **Prop Drilling**, and outlines best practices for choosing the right approach.

## 1. The Problem: Prop Drilling

**Prop Drilling** occurs when data must be passed from a parent component to a deep child component through several intermediate components that don't need the data themselves.

### Example (Before Refactoring):
```tsx
// Page.tsx (Parent) manages everything
<Page>
  <Header 
    user={user} 
    onLogout={handleLogout} 
    stock={stock} 
    onSearch={handleSearch} 
  />
  <AppLayout>
    <Sidebar user={user} />
    <MainContent>
       <StockView stock={stock} />
    </MainContent>
  </AppLayout>
</Page>
```

### Downsides:
1.  **Tight Coupling**: Intermediate components (`AppLayout`, `MainContent`) must know about data they don't use (`stock`, `user`).
2.  **Boilerplate**: You write the same prop definitions over and over in every file.
3.  **Refactoring Pain**: Renaming a prop or adding a new one requires changing every file in the chain.
4.  **Unnecessary Re-renders**: If the top-level data changes, *all* intermediate components might re-render, even if they don't use the data.

## 2. The Solution: Custom Hooks & Global State

By using **Custom Hooks** (driven by Context, Redux, or Zustand), components can "hook into" the data they need directly, bypassing the parent-child chain.

### Example (After Refactoring):
```tsx
// Page.tsx (Clean Layout)
<Page>
  <Header /> {/* internal useAuth() */}
  <AppLayout>
    <SingleStockView /> {/* internal useStock() */}
  </AppLayout>
</Page>

// Header.tsx
function Header() {
  const { user, logout } = useAuth(); // Connects directly
  return ...
}

// SingleStockView.tsx
function SingleStockView() {
  const { stockData } = useStock(); // Connects directly
  return ...
}
```

### Benefits:
1.  **Decoupling**: `Page.tsx` doesn't need to know that `Header` needs user info or that `StockView` needs stock data.
2.  **Maintainability**: You can change how `useStock` works without touching the UI components that use it.
3.  **Cleaner Code**: Components become smaller, focused only on *rendering*.
4.  **Performance Check**: Only components that *consume* the hook re-render when that specific data updates.

## 3. Best Practices: When to use which?

Standard Props are NOT bad. They are essential for **Reusable Presentational Components**.

| Feature | Use Props (Standard) | Use Hooks (Global State) |
| :--- | :--- | :--- |
| **Component Type** | **"Dumb" / Presentational** | **"Smart" / Container / Page** |
| **Reusability** | **High** (Can be used anywhere with any data) | **Low** (Tied to your specific app logic) |
| **Example** | `Button`, `Card`, `StockPill`, `PriceLabel` | `Header`, `UserProfile`, `StockChartContainer` |
| **Data Source** | Passed from parent | Pulled from store/context |

### The "Hybrid" Approach (Best Practice)
Commonly, you build "Smart" containers that hook into state, and pass data down to "Dumb" presentational implementation details *immediately* below them.

**Example in our App:**
- **`SingleStockView` (Smart):** Calls `useStock()` to get the data.
- **`StockChart` (Presentational):** Receives `data` and `indicators` as props.
  *(Note: We actually made StockChart smart too for convenience, which is valid for specific feature-heavy apps, but strictly speaking, making it accept props makes it reusable for other stocks).*

## Summary associated with our Refactor
We moved `Header`, `LoginForm`, `StockSearch`, `CompareView`, and `SingleStockView` to the **"Smart Component"** pattern. 
- They represent specific *features* of our app.
- They are not generic UI elements.
- Therefore, they should manage their own dependencies via hooks.

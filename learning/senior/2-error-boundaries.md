# Senior Reliability: Error Boundaries (Blast Radius)

## The Problem: The White Screen of Death
In React, if *any* component throws an error during rendering, **the entire application unmounts**.

A typo in a `Tooltip` component shouldn't crash your entire `TradingDashboard`.

## The Solution: Limit the "Blast Radius"
We wrap risky components in an **Error Boundary**. If they crash, only that specific section shows an error UI, while the login, sidebar, and navigation remain functional.

## Implementation Pattern
Error Boundaries *must* be Class Components (as of React 18/19). Hooks like `useError` do not exist yet for catching render errors.

```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true }; // Update state so next render shows fallback
  }

  componentDidCatch(error, info) {
    // Log to Sentry/Datadog here
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}
```

## Usage Strategy
Don't wrap every button. Wrap **Feature Blocks**.

```tsx
// ✅ Good: Wrap major widgets
<ErrorBoundary fallback={<ChartError />}>
  <ComplexChart />
</ErrorBoundary>

<ErrorBoundary fallback={<FeedError />}>
  <LiveNewsFeed />
</ErrorBoundary>

// ❌ Bad: Wrapping too small
<ErrorBoundary>
  <Button /> 
</ErrorBoundary>
```

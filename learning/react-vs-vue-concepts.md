# React for Vue Developers: A Concept Map

This guide helps you map your Vue.js knowledge to React, using examples from `src/app/page.tsx` and other files in this project.

## 1. Templates vs. JSX

**Vue:** Uses HTML-based templates with directives (`v-if`, `v-for`, `v-bind`).
**React:** Uses **JSX** (JavaScript XML), which is just JavaScript syntax extension. You use JS logic directly inside your "template".

### Control Flow (v-if / v-else)

**Vue:**
```html
<div v-if="loading">Loading...</div>
<div v-else>Content</div>
```

**React (`page.tsx`):**
In React, we use the logical AND (`&&`) operator or ternary operators (`? :`) for conditional rendering.

```tsx
// From src/app/page.tsx
if (auth.isChecking) {
  return (
    <div className="...">Loading...</div>
  );
}

// Inside JSX
{loginError && (
  <div className="bg-red-500/10 ...">
    <p>{loginError}</p>
  </div>
)}
```

### Lists (v-for)

**Vue:**
```html
<ul>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</ul>
```

**React (`page.tsx`):**
We use the native array `.map()` method.

```tsx
// From src/app/page.tsx
{tabs.map((tab) => (
  <button
    key={tab.id}
    onClick={() => ui.setActiveTab(tab.id)}
    className="..."
  >
    {tab.label}
  </button>
))}
```

## 2. Reactivity: Data vs. State

**Vue (Options API):** `data()` returns an object.
**Vue (Composition API):** `ref()` or `reactive()`.

**React:** `useState` hook.

```tsx
// From src/app/page.tsx
const [password, setPassword] = useState("");
const [loginError, setLoginError] = useState("");

// Updating state
setPassword("newPassword"); // Replaces reference, triggers re-render
```

**Key Difference:** In Vue, you can mutate state directly (`this.password = '...'`). In React, you **must** use the setter function (`setPassword(...)`). React relies on immutability to detect changes.

## 3. Side Effects: Lifecycle vs. useEffect

**Vue:** `onMounted`, `watch`, `onUnmounted`.
**React:** `useEffect`. This single hook handles mounting, updating, and unmounting.

```tsx
// From src/app/page.tsx

// Initial load (like onMounted + watch dependencies)
useEffect(() => {
  if (auth.isAuthenticated && !stock.primaryStock) {
    stock.load("AAPL");
  }
}, [auth.isAuthenticated, stock.primaryStock, stock]);
// ^ Dependency array: effect re-runs ONLY if these values change.
```

If the dependency array is empty `[]`, it runs once on mount (like `onMounted`).
If you return a function, it runs on unmount (cleanup).

## 4. Computed Properties vs. Derived State

**Vue:** `computed(() => ...)` limits re-calculation.
**React:** Plain variables re-calculate on every render. For expensive calculations, use `useMemo`.

```tsx
// From src/app/page.tsx
// This logic runs every time the component re-renders
const predictionDirection = stock.primaryStock?.prediction?.direction || "NEUTRAL";
```

## 5. Components & Props

**Vue:** Defined in `props` option or `defineProps`.
**React:** Function arguments.

```tsx
// From src/app/page.tsx
function QuickStats({ quote, fundamentals, prediction }: { quote: any, ... }) {
  // Props are just the first argument to the function
  if (!quote) return null;
  
  return (
    <Card>...</Card>
  )
}
```

## Summary Table

| Concept | Vue.js | React |
| :--- | :--- | :--- |
| **Markup** | HTML Templates | JSX (JavaScript) |
| **State** | `data` / `ref` | `useState` |
| **Computed** | `computed` | `useMemo` / Variables |
| **Lifecycle** | `onMounted` / `watch` | `useEffect` |
| **Events** | `@click` | `onClick` |
| **Props** | `props: ['foo']` | `function MyComp({ foo })` |

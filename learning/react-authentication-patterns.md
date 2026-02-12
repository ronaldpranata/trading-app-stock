# React Authentication Patterns: From Junior to Senior

Authentication is often implemented incorrectly in React applications, leading to subtle bugs like infinite loops, flashing content, and race conditions. This guide explains the "Why" behind the architecture we implemented in the Stock Predictor app.

## 1. The "Infinite Loop" Trap

A common mistake is putting the initial authentication check directly inside a custom hook like `useAuth`.

### ❌ The Anti-Pattern (Junior Approach)

```typescript
// useAuth.ts
export function useAuth() {
  const dispatch = useDispatch();
  
  // 🚩 PROBLEM: This runs every time a component uses this hook!
  // If 5 components use useAuth, you get 5 API calls.
  // If the state update triggers a re-render, it might run again.
  useEffect(() => {
    dispatch(checkAuth());
  }, []);
  
  return { ... };
}
```

### ✅ The Solution: The Provider Pattern (Senior Approach)

We move the initialization logic to a centralized **Provider** that is guaranteed to mount only once.

```typescript
// AuthProvider.tsx
export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const initialized = useRef(false); // Ref tracks "did this run?" without causing re-renders

  useEffect(() => {
    // strict mode safe double-check
    if (!initialized.current) {
      initialized.current = true;
      dispatch(checkAuth());
    }
  }, []);

  return <>{children}</>;
}
```

**Takeaway**: Side effects that should happen *once per app lifecycle* belong in a Provider, not a Hook.

## 2. Managing UI State vs. Auth State

Another common bug is the "Login Form Reset."

### The Bug
1. User types password and hits Submit.
2. `login` action is dispatched -> global `isCheckingAuth` state becomes `true`.
3. Main Layout sees `isCheckingAuth === true` and unmounts the current page to show a "Loading Spinner".
4. API fails (wrong password).
5. `isCheckingAuth` becomes `false`.
6. Login Page remounts. **The form state (and error message) is lost because the component was destroyed.**

### ✅ The Fix: Decoupled States
We separate **"App Initialization"** from **"User Login Action"**.

- `isCheckingAuth`: Only true during the initial app load (checking cookies).
- `isLoggingIn`: Local state in the form to disable buttons/inputs.

In `authSlice.ts`, we made sure `login.pending` does **not** set `isCheckingAuth = true`.

## 3. Route Protection: Client-Side Redirects

For Client-Side Rendering (CSR) apps (or hybrid Next.js apps), we often protect routes inside the page component or a wrapper.

```typescript
// app/page.tsx (Protected Route)
export default function Dashboard() {
  const { isAuthenticated, isChecking } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for check to finish, then redirect if needed
    if (!isChecking && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isChecking, isAuthenticated]);

  // Prevent "Flash of Unauthenticated Content"
  if (isChecking) return <LoadingSpinner />;
  if (!isAuthenticated) return null; // Will redirect shortly

  return <DashboardContent />;
}
```

## Summary Checklist for Auth

- [ ] **Initialization**: Happen once in a Provider?
- [ ] **Loading States**: Are we blocking usage while checking credentials?
- [ ] **Feedback**: Do error messages persist after a failed attempt?
- [ ] **Redirects**: Do we handle both "Unauthenticated access to protected page" and "Authenticated access to login page"?

By following these patterns, we ensure a robust, loop-free authentication experience.

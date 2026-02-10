# Project Structure & Best Practices

This guide outlines the recommended folder structure and architectural patterns for scalable React applications, specifically tailored for this project (Next.js + Redux Toolkit).

## 1. The "Screaming Architecture"

We follow a philosophy where the folder structure screams **what the application does**, not just what technologies it uses.

**Bad:**
```
src/
  components/
  containers/
  actions/
  reducers/
```
*(This tells you it's a Redux app, but not what it does.)*

**Good (Feature-First):**
```
src/
  features/
    auth/
    stock-analysis/
    user-profile/
  components/
    ui/
```
*(This tells you it's an app with Auth, Stocks, and Profiles.)*

## 2. Recommended Folder Structure

```
src/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── api/              # Backend API routes
│   └── globals.css       # Global styles
├── components/           # Shared UI components
│   ├── ui/               # "Dumb" design system (Buttons, Cards)
│   └── layout/           # Header, Sidebar, Footer
├── features/             # Business Logic (The Core)
│   ├── auth/             # Auth feature
│   │   ├── LoginForm.tsx
│   │   ├── authSlice.ts  # Redux slice for this feature
│   │   └── useAuth.ts    # Hook for this feature
│   └── stock/            # Stock feature
│       ├── StockChart.tsx
│       ├── stockSlice.ts
│       └── stockApi.ts
├── hooks/                # Global hooks (useDebounce, useOnClickOutside)
├── lib/                  # 3rd party library configs (firebase, stripe)
├── store/                # Global Redux store configuration
│   ├── index.ts          # Store setup
│   └── hooks.ts          # Typed useDispatch/useSelector
├── types/                # Global TypeScript definitions
└── utils/                # Pure helper functions (formatCurrency, formatDate)
```

## 3. Feature-First Architecture

Scale your app by grouping related files together by **Feature**, not by **Type**.

### Why?
When you work on the "Auth" feature, you usually need to touch `LoginForm.tsx`, `authSlice.ts`, and `useAuth.ts` all at once. If they are scattered across `src/components`, `src/store`, and `src/hooks`, you waste time context switching.

### The "Feature" Folder Pattern
Each feature folder should be self-contained:

```
src/features/chat/
├── components/           # Components only used in Chat
│   ├── ChatWindow.tsx
│   └── MessageInput.tsx
├── hooks/                # Hooks only used in Chat
│   └── useChatSocket.ts
├── store/                # State only used in Chat
│   └── chatSlice.ts
└── index.ts              # Experiment: Public API for this feature
```

## 4. Redux Patterns

### Slices vs. Ducks
We use the **Redux Toolkit (RTK) Slice Pattern**.
- **Slice**: A single file containing the State interface, Initial State, Reducers, and Actions.
- **Location**: Ideally co-located in `src/features/<name>/<name>Slice.ts`. For smaller apps (like this one initially), `src/store/slices/` is acceptable, but migrating to `features` is better as you grow.

### API Injection (Code Splitting)
Instead of one giant `stockApi.ts`, you can stick to one base API and inject endpoints from features.

```typescript
// src/features/user/userApi.ts
import { api } from '@/store/api';

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query({ ... }),
  }),
});

export const { useGetUserQuery } = userApi;
```
*This keeps your API logic bundled with the feature that uses it.*

## 5. Colocation & "Barrel" Files

### Colocation
Keep tests and styles next to the component.
```
src/components/Button/
├── Button.tsx
├── Button.module.css
├── Button.test.tsx
└── index.ts
```

### The "Barrel" Pattern (`index.ts`)
Use `index.ts` to export only what is necessary.

```typescript
// src/components/ui/index.ts
export * from './Button';
export * from './Card';
export * from './Input';
```

**Pros:**
- cleaner imports: `import { Button } from '@/components/ui'` instead of `.../Button/Button'`
- Encapsulation: You can refactor the internal structure of `ui` without breaking imports elsewhere.

## 6. Smart vs. Dumb Components

### Dumb (Presentational) Components
- **Location**: `src/components/ui`
- **Focus**: How things look.
- **Props**: Data and callbacks.
- **Dependencies**: No Redux, no API calls. minimal hooks.

### Smart (Container) Components
- **Location**: `src/features/<feature>/components` or `src/app`
- **Focus**: How things work.
- **Props**: Minimal.
- **Dependencies**: Connects to Redux, fetches data, manages complex state.

**Rule of Thumb:** If it has `useSelector` or `useQuery`, it's a Smart Component. Keep them separate from Dumb Components to make UI reusable.

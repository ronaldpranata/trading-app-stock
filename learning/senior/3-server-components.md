# Senior Architecture: React Server Components (RSC)

## The Problem: The Bundle Size
In a traditional Single Page App (SPA), the user downloads **ALL** the JavaScript for the entire app before it becomes interactive.

If you use a heavy library like `d3.js` or `moment.js` for formatting dates, the user downloads that library code, even though they only see the *result* (text).

## The Solution: Server Components
Server Components run **only on the server**. They render to HTML, and that HTML is sent to the client.

### Key Difference
-   **Client Component (`"use client"`):** Hydrated, interactive, uses `useState`, `useEffect`.
-   **Server Component (Default):** Static, consistent, has direct DB access, **Zero Bundle Size**.

### Example: Markdown Renderer
**Old Way (Client Component):**
1.  User downloads `markdown-parser.js` (50kb).
2.  Browser parses markdown -> HTML.
3.  User sees content.

**New Way (RSC):**
1.  Server parses markdown -> HTML.
2.  User downloads HTML (2kb).
3.  **Zero JavaScript sent to client.**

## When to use which?
| Feature | Server Component | Client Component |
| :--- | :--- | :--- |
| Fetch Data | ✅ (Direct DB/API) | ⚠️ (Need useEffect + API) |
| Interactivity (onClick) | ❌ | ✅ |
| State (useState) | ❌ | ✅ |
| Lifecycle (useEffect) | ❌ | ✅ |
| Access LocalStorage | ❌ | ✅ |

## The "Hole" Pattern
How do you mix them? Pass Client Components as **children** to Server Components.

```tsx
// Page.tsx (Server Component)
import ClientChart from './ClientChart'; // "use client" inside
import db from './db';

async function Dashboard() {
  const data = await db.query('SELECT * FROM stocks'); // Run on server!
  
  return (
    <div>
      <h1>Market Status</h1>
      {/* Pass server data to client component */}
      <ClientChart initialData={data} /> 
    </div>
  );
}
```

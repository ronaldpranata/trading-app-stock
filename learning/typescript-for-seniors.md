# TypeScript for Senior React Devs: Safety & Scalability

TypeScript is more than just interfaces. It's a way to enforce correctness at compile time.

## 1. Union Types over Booleans

**Problem:** `isLoading` and `isError` can both be true at the same time if not managed carefully. This is an "impossible state".

**Solution:** Discriminated Unions.

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error';
// Now it's impossible to be 'loading' and 'error' at the same time.
```

**From `src/store/api/stockApi.ts`:**
RTK Query handles this internally, giving you a status object where `isFetching`, `isSuccess`, etc., are consistent.

## 2. Generics for Reusable Components

**Go Generic:** Don't write a `StockTable`. Write a `Table<T>`.

```typescript
interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T; // Enforces that columns match the data keys!
    header: string;
  }[];
}

function Table<T>({ data, columns }: TableProps<T>) {
  // ...
}
```

This ensures that if you pass a `Stock` object, you can't accidentally ask for a generic `user.name` column.

## 3. Utility Types (`Pick`, `Omit`, `Partial`)

Instead of redefining types, derive them.

**From `src/types/stock.ts`:**
If we wanted a type for just updating a stock prediction, we wouldn't rewrite the interface.

```typescript
// Create a new type with only the 'direction' and 'confidence' fields
type PredictionUpdate = Pick<PredictionResult, 'direction' | 'confidence'>;

// Create a version where everything is optional
type PartialStock = Partial<StockData>;
```

## 4. `unknown` vs `any`

**Run away from `any`.** It disables TypeScript.
Use `unknown` if you truly don't know the type. It forces you to check before using it.

## 5. Inference

**Best Practice:** Let TypeScript infer the return type.

```typescript
// Redundant
function add(a: number, b: number): number {
  return a + b;
}

// Better - TS knows it returns a number
function add(a: number, b: number) {
  return a + b;
}
```

**Senior Mindset:** TypeScript is your first unit test. If it compiles, it should define a valid state of your application.

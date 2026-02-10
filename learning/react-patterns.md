# React Design Patterns for Senior Engineers

Beyond basic hooks and components, these patterns help manage complexity in large-scale applications.

## 1. Container / Presentational Pattern

Designing components that are separate from their data dependencies makes them reusable and easier to test.

### Presentational (The "Look")
The pure UI. Does not know about Redux or APIs.

```tsx
// UserList.tsx
interface UserListProps {
  users: User[];
  isLoading: boolean;
  onSelect: (id: string) => void;
}

export const UserList = ({ users, isLoading, onSelect }: UserListProps) => {
  if (isLoading) return <Spinner />;
  return (
    <ul>
      {users.map(u => (
        <li key={u.id} onClick={() => onSelect(u.id)}>{u.name}</li>
      ))}
    </ul>
  );
};
```

### Container (The "Logic")
The data fetcher. Wraps the presentational component.

```tsx
// UserListContainer.tsx
export const UserListContainer = () => {
  const { data, isLoading } = useGetUsersQuery();
  const dispatch = useDispatch();

  const handleSelect = (id: string) => {
    dispatch(selectUser(id));
  };

  return <UserList users={data} isLoading={isLoading} onSelect={handleSelect} />;
};
```

**Why?** You can reuse `UserList` with mock data for Storybook or tests easily.

## 2. Custom Hooks for Logic Separation

Move complex `useEffect` and `useState` logic out of components into custom hooks. The component should just *render*.

**Bad:**
```tsx
const StockChart = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // 20 lines of fetching logic
  }, []);
  // 10 lines of formatting logic
  return <Chart data={data} />;
}
```

**Good:**
```tsx
const StockChart = () => {
  const { chartData, isLoading, error } = useStockChartData('AAPL');
  
  if (isLoading) return <Loader />;
  return <Chart data={chartData} />;
}
```

## 3. Compound Components

Used for complex UI widgets that need to share state implicitly (like `<select>` and `<option>`).

```tsx
// Usage
<Accordion>
  <Accordion.Item id="1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

**Implementation:**
Use `React.Context` internally to share the `activeId` state between the parent `Accordion` and the child `Accordion.Item` components without passing props manually through every level.

## 4. Render Props

A technique for sharing code between components using a prop whose value is a function.

```tsx
<MouseTracker render={({ x, y }) => (
  <h1>The mouse position is ({x}, {y})</h1>
)}/>
```
*Note: Custom hooks have largely replaced this pattern for logic reuse, but it is still powerful for UI composition.*

## 5. Composition vs. Inheritance

React favors composition. Instead of creating a `BaseCard` class and extending it, create a `Card` component that accepts `children`.

```tsx
// Composition
const WelcomeCard = () => (
  <Card>
    <Card.Header title="Welcome" />
    <Card.Body>Hello User!</Card.Body>
  </Card>
);
```
This is more flexible than trying to subclass components.

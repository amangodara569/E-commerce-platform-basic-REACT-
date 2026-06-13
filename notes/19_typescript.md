# 19 — TypeScript with React

> **References:**
> - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
> - [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
> - [React TypeScript Docs](https://react.dev/learn/typescript)

---

## Why TypeScript with React?

TypeScript adds **static type checking** to JavaScript, catching errors at compile time instead of runtime.

**Benefits:**
- Catch bugs before running code
- Better IDE autocomplete
- Easier refactoring
- Self-documenting code (types = documentation)
- Better team collaboration

```bash
# Create React + TypeScript project
npm create vite@latest my-app -- --template react-ts

# Add TypeScript to existing Vite project
npm install -D typescript @types/react @types/react-dom
```

---

## Basic TypeScript Types

```typescript
// Primitives
const name: string = "Aman";
const age: number = 21;
const isAdmin: boolean = true;

// Arrays
const fruits: string[] = ['apple', 'banana'];
const numbers: number[] = [1, 2, 3];
const mixed: (string | number)[] = ['a', 1, 'b', 2];

// Objects (using interface)
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;        // Optional property
  readonly role: string; // Cannot be changed after creation
}

// Objects (using type)
type Product = {
  id: number;
  name: string;
  price: number;
  category: 'electronics' | 'clothing' | 'food';  // Union type
};

// Function types
type Handler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type Formatter = (value: number) => string;
```

---

## Typing Component Props

```tsx
// Using interface (recommended for props)
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function Button({ label, onClick, variant = 'primary', disabled = false, size = 'md' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {label}
    </button>
  );
}

// Using React.FC (functional component type)
const Button: React.FC<ButtonProps> = ({ label, onClick, ...rest }) => {
  return <button onClick={onClick} {...rest}>{label}</button>;
};

// ✅ Modern recommendation: Don't use React.FC — just type props directly
function Button({ label, onClick }: ButtonProps) { ... }
```

---

## Typing Common Props

```tsx
// Children prop
interface CardProps {
  children: React.ReactNode;  // Most flexible — accepts anything renderable
  title?: string;
}

// Alternative children types
interface Props {
  children: React.ReactElement;      // Single React element
  children: JSX.Element;             // Same as ReactElement
  children: React.ReactNode;         // Most permissive (recommended)
  children: string;                  // Only strings
  children: (data: User) => React.ReactNode;  // Render prop
}

// Event handlers
interface FormProps {
  onSubmit: (data: FormData) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

// Style props
interface ComponentProps {
  style?: React.CSSProperties;
  className?: string;
}

// Extending HTML element props
interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function MyInput({ label, error, ...inputProps }: MyInputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
      {error && <p>{error}</p>}
    </div>
  );
}
// Now MyInput accepts all regular input props (placeholder, type, etc.) plus label & error
```

---

## Typing useState

```tsx
// TypeScript infers simple types automatically
const [count, setCount] = useState(0);        // number
const [name, setName] = useState('');          // string
const [isOpen, setIsOpen] = useState(false);   // boolean

// Explicit types needed for complex cases
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Product[]>([]);
const [error, setError] = useState<string | null>(null);

// Interface for form state
interface FormState {
  username: string;
  email: string;
  password: string;
}

const [form, setForm] = useState<FormState>({
  username: '',
  email: '',
  password: '',
});
```

---

## Typing useRef

```tsx
import { useRef } from 'react';

// DOM element ref
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);

// Mutable value ref (not null)
const countRef = useRef<number>(0);
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

function Component() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    inputRef.current?.focus();  // Optional chaining — inputRef.current might be null
  }

  return <input ref={inputRef} type="text" />;
}
```

---

## Typing useEffect and useCallback

```tsx
// useEffect — no special typing needed, but type dependencies
useEffect(() => {
  const subscription = subscribe(userId);
  return () => subscription.unsubscribe();
}, [userId]);  // TypeScript checks userId is valid

// useCallback
const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  submitForm(formData);
}, [formData]);
```

---

## Typing useReducer

```tsx
// Define action types as discriminated union
type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET'; payload: number };

interface CounterState {
  count: number;
  history: number[];
}

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1, history: [...state.history, state.count] };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { count: 0, history: [] };
    case 'SET':
      return { ...state, count: action.payload };  // TypeScript knows payload exists here!
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, history: [] });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 10 })}>Set 10</button>
    </div>
  );
}
```

---

## Typing Context

```tsx
// contexts/AuthContext.tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    const userData = await loginAPI(email, password);
    setUser(userData);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Usage
function ProfilePage() {
  const { user, logout } = useAuth();
  // TypeScript knows user can be null!
  return <div>{user?.name ?? 'Guest'}</div>;
}
```

---

## Generic Components

```tsx
// Generic list component — works with any type of data
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage = 'No items' }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyMessage}</p>;

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// Usage — TypeScript infers T from usage
<List
  items={users}                    // T = User
  keyExtractor={u => u.id}         // TypeScript knows u is User
  renderItem={u => <span>{u.name}</span>}
/>

<List
  items={products}                 // T = Product
  keyExtractor={p => p.id}         // TypeScript knows p is Product
  renderItem={p => <span>{p.name} — ₹{p.price}</span>}
/>
```

---

## Typing Event Handlers

```tsx
// Input change
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value);
}

// Textarea change
function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {}

// Select change
function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {}

// Form submit
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

// Button click
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log(e.currentTarget.id);
}

// Key press
function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === 'Enter') { ... }
}

// Drag
function handleDrop(e: React.DragEvent<HTMLDivElement>) {
  const files = e.dataTransfer.files;
}
```

---

## Utility Types

```tsx
// Partial — makes all properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

// Required — makes all properties required
type RequiredUser = Required<PartialUser>;

// Pick — select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

// Omit — exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Record — object with known keys and value type
type RolePermissions = Record<'admin' | 'user' | 'moderator', string[]>;

// ReturnType — get return type of a function
type FetchResult = ReturnType<typeof fetchUser>;

// React specific
type ButtonRef = React.Ref<HTMLButtonElement>;
type DivProps = React.HTMLAttributes<HTMLDivElement>;
type ComponentWithChildren = React.PropsWithChildren<{ title: string }>;
```

---

## Practical Example: Typed API Hook

```tsx
// hooks/useApi.ts
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApi<T>(url: string): ApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: T = await res.json();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: (err as Error).message });
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Usage with full type safety
interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  const { data: users, loading, error } = useApi<User[]>('/api/users');
  // users is User[] | null — TypeScript enforces proper handling

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;
  if (!users) return null;

  return (
    <ul>
      {users.map(user => (  // TypeScript knows user is User
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  );
}
```

---

## Summary

| Concept | TypeScript Syntax |
|---|---|
| Props | `interface ButtonProps { ... }` |
| Optional prop | `label?: string` |
| Children | `children: React.ReactNode` |
| State | `useState<User \| null>(null)` |
| Ref | `useRef<HTMLInputElement>(null)` |
| Context | `createContext<ContextType \| undefined>(undefined)` |
| Event | `(e: React.ChangeEvent<HTMLInputElement>)` |
| Generic component | `function List<T>({ items }: ListProps<T>)` |

---

> **Previous:** [18 — Advanced Patterns ←](./18_advanced_patterns.md)
> **Next:** [20 — Testing in React →](./20_testing.md)

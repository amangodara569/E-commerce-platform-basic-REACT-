# 11 — Hooks Deep Dive

> **References:**
> - [Hooks Reference — React Docs](https://react.dev/reference/react)
> - [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)
> - [useRef](https://react.dev/reference/react/useRef)
> - [useCallback](https://react.dev/reference/react/useCallback)
> - [useMemo](https://react.dev/reference/react/useMemo)
> - [useReducer](https://react.dev/reference/react/useReducer)

---

## What Are Hooks?

**Hooks** are special functions that let you "hook into" React features from functional components. They always start with `use`.

```
Built-in Hooks:
├── useState          → Manage local state
├── useEffect         → Side effects & lifecycle
├── useRef            → DOM access / mutable value
├── useContext        → Consume Context
├── useReducer        → Complex state logic
├── useCallback       → Memoize functions
├── useMemo           → Memoize computed values
├── useId             → Generate unique IDs
├── useTransition     → Mark non-urgent updates
├── useDeferredValue  → Defer a value's update
└── Custom Hooks      → Your own reusable hooks
```

---

## Rules of Hooks

**These rules are mandatory — breaking them causes bugs:**

1. **Only call Hooks at the top level** — Not inside loops, conditions, or nested functions
2. **Only call Hooks from React functions** — Not from regular JS functions

```jsx
// ❌ WRONG — Hooks inside condition
function Bad({ show }) {
  if (show) {
    const [count, setCount] = useState(0);  // Breaks rules!
  }
}

// ❌ WRONG — Hook inside a loop
function Bad({ items }) {
  items.forEach(item => {
    const [value, setValue] = useState('');  // Breaks rules!
  });
}

// ✅ CORRECT — Hooks always at top level
function Good({ show, items }) {
  const [count, setCount] = useState(0);     // Always called
  const [value, setValue] = useState('');    // Always called

  if (show) { /* use count */ }
  items.forEach(item => { /* use value */ });
}
```

---

## useRef

`useRef` returns a **mutable ref object** that persists across renders. The value stored in `ref.current` does **not** trigger re-renders when changed.

### Use Case 1: Accessing DOM Elements

```jsx
import { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus();  // Directly access the DOM element
  }

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="I can be focused!" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

```jsx
// Scrolling into view
function ScrollExample() {
  const sectionRef = useRef(null);

  function scrollToSection() {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <button onClick={scrollToSection}>Jump to Section</button>
      <div style={{ height: '1000px' }}>Long content...</div>
      <section ref={sectionRef}>
        <h2>Target Section</h2>
      </section>
    </div>
  );
}
```

### Use Case 2: Storing Mutable Values (Without Re-render)

```jsx
function StopWatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);  // Store interval ID

  function start() {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  }

  function stop() {
    setRunning(false);
    clearInterval(intervalRef.current);  // Access interval ID
  }

  function reset() {
    stop();
    setTime(0);
  }

  return (
    <div>
      <p>{time}s</p>
      <button onClick={running ? stop : start}>
        {running ? 'Stop' : 'Start'}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Use Case 3: Tracking Previous Value

```jsx
function usePrevious(value) {
  const prevRef = useRef();

  useEffect(() => {
    prevRef.current = value;  // Update after render
  });

  return prevRef.current;  // Returns value from BEFORE this render
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <p>
      Now: {count}, Before: {prevCount ?? 'none'}
    </p>
  );
}
```

---

## useReducer

`useReducer` is an alternative to `useState` for **complex state logic**. Think of it like a mini-Redux inside a component.

```
dispatch(action) → reducer(currentState, action) → newState
```

```jsx
import { useReducer } from 'react';

// 1. Define the reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET':
      return { count: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// 2. Use the reducer
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 10 })}>Set 10</button>
    </div>
  );
}
```

### Complex State with useReducer — Todo App

```jsx
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'DELETE':
      return state.filter(todo => todo.id !== action.id);
    case 'CLEAR_DONE':
      return state.filter(todo => !todo.done);
    default:
      return state;
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [input, setInput] = useState('');

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={() => {
        dispatch({ type: 'ADD', payload: input });
        setInput('');
      }}>Add</button>
      
      <button onClick={() => dispatch({ type: 'CLEAR_DONE' })}>
        Clear Done
      </button>

      {todos.map(todo => (
        <div key={todo.id}>
          <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => dispatch({ type: 'TOGGLE', id: todo.id })}>✓</button>
          <button onClick={() => dispatch({ type: 'DELETE', id: todo.id })}>🗑</button>
        </div>
      ))}
    </div>
  );
}
```

### useState vs useReducer

| | `useState` | `useReducer` |
|---|---|---|
| Best for | Simple values, independent states | Complex objects, multiple related actions |
| Update logic | In component | In reducer function |
| Testing | Harder | Easy (reducer is pure function) |
| When to use | 1-3 state variables | 4+ related states or complex transitions |

---

## useCallback

`useCallback` **memoizes a function** — returns the same function reference as long as dependencies haven't changed.

```jsx
import { useCallback, memo } from 'react';

// ❌ Without useCallback — new function created on every render
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('clicked');
  };
  // Every render creates a NEW handleClick function
  // Child always re-renders because it receives a "new" function!

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Re-render Parent ({count})
      </button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
}

// ✅ With useCallback — same function reference preserved
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);  // No dependencies — never changes
  // Same function reference every render → Child doesn't re-render!

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Re-render Parent ({count})
      </button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
}

// Child wrapped in memo to prevent unnecessary re-renders
const ExpensiveChild = memo(function ExpensiveChild({ onClick }) {
  console.log('Child rendered!');
  return <button onClick={onClick}>Child Button</button>;
});
```

### useCallback with Dependencies

```jsx
function SearchComponent({ userId }) {
  const [query, setQuery] = useState('');

  // This function depends on userId — recreate it when userId changes
  const handleSearch = useCallback(async () => {
    const results = await searchForUser(userId, query);
    return results;
  }, [userId, query]);  // Recreate when userId or query changes

  return <button onClick={handleSearch}>Search</button>;
}
```

---

## useMemo

`useMemo` **memoizes a computed value** — only recalculates when dependencies change.

```jsx
import { useMemo } from 'react';

function ExpensiveList({ items, searchQuery }) {
  // ❌ Without useMemo — recalculates on EVERY render
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ With useMemo — only recalculates when items or searchQuery changes
  const filteredItems = useMemo(() => {
    console.log('Filtering...');
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <ul>
      {filteredItems.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```

```jsx
// Another example: expensive calculation
function PrimeCalculator({ limit }) {
  // Finding primes is expensive for large limits
  const primes = useMemo(() => {
    const result = [];
    for (let i = 2; i <= limit; i++) {
      if (isPrime(i)) result.push(i);
    }
    return result;
  }, [limit]);  // Only recalculate when limit changes

  return <p>Found {primes.length} primes up to {limit}</p>;
}
```

### useCallback vs useMemo

```jsx
// useMemo — memoizes the RESULT of calling a function
const doubledValue = useMemo(() => compute(a, b), [a, b]);
// doubledValue = the computed value

// useCallback — memoizes the FUNCTION ITSELF
const doSomething = useCallback(() => compute(a, b), [a, b]);
// doSomething = the function (call it later)

// Equivalence:
const fn = useCallback(fn, deps);
const fn = useMemo(() => fn, deps);  // Same thing!
```

---

## useId

Generates unique, stable IDs for accessibility:

```jsx
import { useId } from 'react';

function FormField({ label, type }) {
  const id = useId();  // Generates a unique ID like ":r0:"

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </div>
  );
}

// Safe to use multiple times — each gets a unique ID
<FormField label="Username" type="text" />
<FormField label="Email" type="email" />
```

---

## useTransition

Mark state updates as **non-urgent** so React can keep the UI responsive:

```jsx
import { useTransition } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e) {
    setQuery(e.target.value);  // Urgent update (fast)

    startTransition(() => {
      // Non-urgent update — React can interrupt this
      const newResults = filterHugeList(e.target.value);
      setResults(newResults);
    });
  }

  return (
    <div>
      <input onChange={handleSearch} value={query} />
      {isPending && <p>Loading...</p>}
      <ResultList results={results} />
    </div>
  );
}
```

---

## useDeferredValue

Defer a value's update for performance:

```jsx
import { useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery lags behind query — React renders with old value
  // first, then updates to new value when possible

  const isStale = deferredQuery !== query;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      {/* Renders with old query first, then updates */}
      <ExpensiveFilteredList query={deferredQuery} />
    </div>
  );
}
```

---

## Custom Hooks

Custom hooks let you **extract and reuse stateful logic** across components.

### Convention: Custom hooks must start with `use`

### Example 1: useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setStoredValue(newValue) {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  return [value, setStoredValue];
}

// Usage
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  // Persists in localStorage automatically!
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### Example 2: useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setData(data);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage — one line instead of 20!
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;
  return <div>{user.name}</div>;
}
```

### Example 3: useWindowSize

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Usage
function Layout() {
  const { width } = useWindowSize();
  return width < 768 ? <MobileLayout /> : <DesktopLayout />;
}
```

### Example 4: useDebounce

```jsx
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);  // Only fires 300ms after typing stops
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

---

## Summary

| Hook | Use For |
|---|---|
| `useRef` | DOM access, mutable values that don't cause re-renders |
| `useReducer` | Complex state with multiple actions |
| `useCallback` | Memoize callback functions to prevent child re-renders |
| `useMemo` | Memoize expensive computed values |
| `useId` | Generate accessible unique IDs |
| `useTransition` | Mark non-urgent state updates |
| `useDeferredValue` | Defer a value update for performance |
| Custom Hooks | Extract reusable stateful logic |

---

> **Previous:** [10 — Forms ←](./10_forms.md)
> **Next:** [12 — Context API →](./12_context_api.md)

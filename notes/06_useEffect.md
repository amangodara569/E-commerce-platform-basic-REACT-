# 06 — useEffect & Component Lifecycle

> **References:**
> - [Synchronizing with Effects — React Docs](https://react.dev/learn/synchronizing-with-effects)
> - [useEffect API Reference](https://react.dev/reference/react/useEffect)
> - [You Might Not Need an Effect — React Docs](https://react.dev/learn/you-might-not-need-an-effect)

---

## Component Lifecycle

Every React component goes through a **lifecycle**:

```
Mount → Update → Unmount
  ↓        ↓        ↓
Born    Changed    Destroyed
```

| Phase | When? | Equivalent |
|---|---|---|
| **Mount** | Component appears in DOM for the first time | `componentDidMount` (class) |
| **Update** | Component re-renders due to state/prop change | `componentDidUpdate` (class) |
| **Unmount** | Component is removed from DOM | `componentWillUnmount` (class) |

---

## The useEffect Hook

`useEffect` lets you **synchronize a component with an external system** (APIs, browser APIs, timers, subscriptions, etc.) and also run code at specific lifecycle moments.

```jsx
import { useEffect } from 'react';

useEffect(
  () => {
    // EFFECT CODE — runs after render
    // Do: fetch data, set up subscriptions, start timers, update DOM

    return () => {
      // CLEANUP FUNCTION — runs before next effect or on unmount
      // Do: clear timers, cancel requests, unsubscribe
    };
  },
  [/* dependency array */]
);
```

---

## Dependency Array Variations

The **dependency array** controls WHEN the effect runs:

### 1. No Dependency Array — Runs After Every Render

```jsx
useEffect(() => {
  console.log('Runs after EVERY render');
});
// ⚠️ Rarely what you want — can cause infinite loops
```

### 2. Empty Array `[]` — Runs Only Once (on Mount)

```jsx
useEffect(() => {
  console.log('Runs ONCE when component mounts');
  // Perfect for: initial data fetch, setting up subscriptions
}, []);
```

### 3. With Dependencies — Runs When Dependencies Change

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(`Fetching user ${userId}`);
    // Runs when component mounts AND whenever userId changes
    fetchUser(userId).then(data => setUser(data));
  }, [userId]);  // Re-runs whenever userId changes
}
```

---

## Common useEffect Patterns

### Pattern 1: Fetch Data on Mount

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Immediately invoked async function (can't make useEffect itself async)
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);  // Only on mount

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Pattern 2: Fetch When Dependency Changes

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;  // Guard clause

    let cancelled = false;  // Prevent race conditions

    async function loadUser() {
      setLoading(true);
      const data = await fetchUser(userId);
      
      if (!cancelled) {  // Only update state if still relevant
        setUser(data);
        setLoading(false);
      }
    }

    loadUser();

    // Cleanup: cancel if userId changes before fetch completes
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <p>Loading user...</p>;
  if (!user) return <p>No user found</p>;
  return <div>{user.name}</div>;
}
```

### Pattern 3: Set Up a Timer

```jsx
function CountdownTimer({ seconds }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft === 0) return;  // Stop when done

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    // Cleanup: clear the interval when component unmounts
    // or when timeLeft changes
    return () => clearInterval(timerId);
  }, [timeLeft]);

  return <p>Time left: {timeLeft}s</p>;
}
```

### Pattern 4: Event Listener

```jsx
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    // Set up listener
    window.addEventListener('resize', handleResize);

    // Cleanup: remove listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);  // Only set up once

  return <p>Window: {size.width} x {size.height}</p>;
}
```

### Pattern 5: Sync with Browser APIs (Title)

```jsx
function DocumentTitleUpdater({ title }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    // Restore the title when component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title]);  // Update when title prop changes

  return null;
}

// Usage
<DocumentTitleUpdater title="Shopping Cart (3 items)" />
```

### Pattern 6: WebSocket / Real-time Connection

```jsx
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to chat room
    const socket = connectToRoom(roomId);
    
    socket.onmessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    // Cleanup: disconnect when roomId changes or component unmounts
    return () => socket.disconnect();
  }, [roomId]);

  return (
    <div>
      {messages.map((msg, i) => <p key={i}>{msg}</p>)}
    </div>
  );
}
```

---

## Cleanup Function — Why It's Important

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // User types "react" quickly:
    // 1. query = "r"   → fetch starts
    // 2. query = "re"  → OLD fetch response arrives, sets wrong data! 🐛
    // 3. query = "react" → correct data (but #2 already corrupted state!)

    let isCancelled = false;

    async function search() {
      const data = await fetchResults(query);
      if (!isCancelled) {  // Only update if still relevant
        setResults(data);
      }
    }

    search();

    // This cleanup runs BEFORE the effect runs again
    return () => {
      isCancelled = true;  // Cancel previous search
    };
  }, [query]);

  return <ResultList results={results} />;
}
```

---

## useEffect Execution Order

```jsx
function MyComponent({ id }) {
  console.log('1. Render (function body runs)');

  useEffect(() => {
    console.log('3. Effect runs (after paint)');

    return () => {
      console.log('2. Cleanup of previous effect runs');
    };
  }, [id]);

  return <div>Component</div>;
}

// Order when id changes:
// 1. Render
// → DOM updates
// → Browser paints
// 2. Cleanup of OLD effect
// 3. NEW effect runs
```

---

## Common Mistakes with useEffect

### Mistake 1: Missing Dependencies

```jsx
// ❌ count is used but not in dependency array → stale closure
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);  // count is always 0 (stale!)
  }, 1000);
  return () => clearInterval(timer);
}, []);  // Missing [count]!

// ✅ Use functional update to avoid needing count as dependency
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);  // Always uses latest state
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

### Mistake 2: Object/Array in Dependencies (Infinite Loop!)

```jsx
// ❌ options is recreated on every render → infinite loop!
function SearchBar({ options }) {
  useEffect(() => {
    // ...
  }, [options]);  // options is a new object reference each render
}

// ✅ Solutions:
// 1. Memoize with useMemo
const memoOptions = useMemo(() => options, [options.id]);

// 2. Depend on specific primitive values
useEffect(() => {}, [options.id, options.limit]);
```

### Mistake 3: Async useEffect

```jsx
// ❌ useEffect cannot return a Promise
useEffect(async () => {
  const data = await fetchData();  // Returns a Promise, not a cleanup fn!
  setData(data);
}, []);

// ✅ Define async function inside
useEffect(() => {
  async function load() {
    const data = await fetchData();
    setData(data);
  }
  load();
}, []);
```

---

## useLayoutEffect

`useLayoutEffect` runs **synchronously after DOM mutations but before the browser paints**.

```jsx
import { useLayoutEffect } from 'react';

// Use for: measuring DOM elements, synchronous DOM mutations
function Tooltip({ children, text }) {
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    // Measure DOM immediately after render, before paint
    const rect = tooltipRef.current.getBoundingClientRect();
    // Position tooltip based on measurement
    if (rect.bottom > window.innerHeight) {
      tooltipRef.current.style.top = 'auto';
      tooltipRef.current.style.bottom = '100%';
    }
  });

  return (
    <div>
      {children}
      <div ref={tooltipRef} className="tooltip">{text}</div>
    </div>
  );
}
```

| | `useEffect` | `useLayoutEffect` |
|---|---|---|
| When | After paint | After DOM update, before paint |
| Use for | Data fetching, subscriptions | DOM measurements, synchronous DOM mutations |
| Performance | Non-blocking | Can block paint |

---

## You Might Not Need an Effect

Some things don't need `useEffect`:

```jsx
// ❌ Don't derive state with useEffect
function UserGreeting({ user }) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(`Hello, ${user.name}!`);  // Unnecessary effect!
  }, [user.name]);

  return <p>{greeting}</p>;
}

// ✅ Just compute it during render
function UserGreeting({ user }) {
  const greeting = `Hello, ${user.name}!`;  // Derived, not stored
  return <p>{greeting}</p>;
}
```

```jsx
// ❌ Don't filter lists with useEffect
useEffect(() => {
  setFilteredList(list.filter(item => item.active));
}, [list]);

// ✅ Compute during render
const filteredList = list.filter(item => item.active);
```

---

## Summary

| Scenario | Code |
|---|---|
| Run on mount only | `useEffect(() => {}, [])` |
| Run on every render | `useEffect(() => {})` |
| Run when deps change | `useEffect(() => {}, [dep1, dep2])` |
| Cleanup on unmount | Return a cleanup function from the effect |
| Fetch data | Use inside effect, handle loading/error states |

---

> **Previous:** [05 — State & useState ←](./05_state.md)
> **Next:** [07 — Event Handling →](./07_events.md)

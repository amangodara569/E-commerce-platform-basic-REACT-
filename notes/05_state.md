# 05 — State & useState

> **References:**
> - [State: A Component's Memory — React Docs](https://react.dev/learn/state-a-components-memory)
> - [useState Hook API](https://react.dev/reference/react/useState)
> - [Queueing State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)

---

## What is State?

**State** is a component's internal memory — data that a component needs to remember and that can change over time.

When state changes, React **automatically re-renders** the component to reflect the new data.

```jsx
// Props vs State
// Props  = Data received FROM parent (read-only, external)
// State  = Data managed BY the component (mutable, internal)
```

**Examples of state:**
- A counter's current count
- A form input's current value
- Whether a modal is open or closed
- The currently selected tab
- The list of fetched items

---

## useState Hook

`useState` is a built-in React Hook that adds state to functional components.

```jsx
import { useState } from 'react';

function Counter() {
  //         ↓ current value    ↓ function to update it    ↓ initial value
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**Syntax Breakdown:**
```jsx
const [stateValue, setterFunction] = useState(initialValue);
//     ^^^^^^^^^    ^^^^^^^^^^^^^^^            ^^^^^^^^^^^^
//     Read this    Call to update             Starting value
```

---

## Why Not Just Use a Variable?

```jsx
// ❌ This DOESN'T work — React doesn't know the variable changed
function Counter() {
  let count = 0;

  function increment() {
    count++;  // Changes the variable
    // But React doesn't re-render! UI stays at 0.
    console.log(count); // Logs correctly, but UI doesn't update
  }

  return <button onClick={increment}>{count}</button>;
}

// ✅ This WORKS — useState triggers a re-render
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

**The key:** Calling `setCount()` tells React to re-render the component with the new value.

---

## Initial State Values

```jsx
// Primitive values
const [count, setCount] = useState(0);          // number
const [name, setName] = useState('');           // string
const [isOpen, setIsOpen] = useState(false);    // boolean

// Complex values
const [user, setUser] = useState(null);         // null initially
const [items, setItems] = useState([]);         // empty array
const [form, setForm] = useState({              // object
  username: '',
  email: '',
  password: '',
});

// Lazy initialization (for expensive computations)
const [data, setData] = useState(() => {
  // This function runs ONLY once on mount
  return JSON.parse(localStorage.getItem('savedData')) || [];
});
```

---

## Updating State

### Simple Updates

```jsx
function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <p>Light is {isOn ? 'ON' : 'OFF'}</p>
      <button onClick={() => setIsOn(!isOn)}>Toggle</button>
      <button onClick={() => setIsOn(true)}>Turn On</button>
      <button onClick={() => setIsOn(false)}>Turn Off</button>
    </div>
  );
}
```

### Functional Updates (Important!)

When the new state depends on the previous state, use the **functional form**:

```jsx
// ❌ Can cause bugs with rapid updates
function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);  // Uses stale count
    setCount(count + 1);  // Still uses old count! Result: +1 not +2
  }
}

// ✅ Correct — uses the latest state
function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(prev => prev + 1);  // React gives us the latest state
    setCount(prev => prev + 1);  // Now this correctly adds 2
  }
}
```

**Always use functional update when new state depends on old state!**

---

## Updating Objects in State

**Never mutate state directly!** Always create a new object:

```jsx
function ProfileForm() {
  const [user, setUser] = useState({
    name: 'Aman',
    age: 21,
    city: 'Delhi',
  });

  // ❌ WRONG — mutating state directly
  function wrongUpdate() {
    user.name = 'Rahul';  // Mutation! React won't re-render
    setUser(user);         // Same reference, no re-render
  }

  // ✅ CORRECT — create a new object with spread operator
  function updateName(newName) {
    setUser({
      ...user,         // Copy all existing properties
      name: newName,   // Override only name
    });
  }

  function updateAge(newAge) {
    setUser(prev => ({
      ...prev,
      age: newAge,
    }));
  }

  return (
    <div>
      <p>{user.name}, {user.age}, {user.city}</p>
      <button onClick={() => updateName('Rahul')}>Change Name</button>
      <button onClick={() => updateAge(22)}>Change Age</button>
    </div>
  );
}
```

---

## Updating Arrays in State

**Never use push/pop/splice** on state arrays. Always create new arrays:

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build a project', done: false },
  ]);

  // ✅ Adding an item — use spread or concat
  function addTodo(text) {
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, done: false }
    ]);
  }

  // ✅ Removing an item — use filter
  function removeTodo(id) {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }

  // ✅ Updating an item — use map
  function toggleTodo(id) {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, done: !todo.done }
        : todo
    ));
  }

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)}>🗑</button>
        </li>
      ))}
      <button onClick={() => addTodo('New Task')}>Add Task</button>
    </ul>
  );
}
```

### Array Operation Reference

| Operation | ❌ Don't Do | ✅ Do Instead |
|---|---|---|
| Add | `arr.push(item)` | `[...arr, item]` |
| Add at start | `arr.unshift(item)` | `[item, ...arr]` |
| Remove | `arr.splice(idx, 1)` | `arr.filter(...)` |
| Update | `arr[idx] = newItem` | `arr.map(...)` |
| Sort | `arr.sort()` | `[...arr].sort()` |

---

## Multiple State Variables

```jsx
function UserForm() {
  // Multiple pieces of state for different concerns
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitForm({ name, email });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) return <p>Thanks for signing up, {name}!</p>;

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

## State Batching (React 18+)

React batches multiple state updates in the same event handler into a single re-render:

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  function handleClick() {
    // React 18: Both updates are BATCHED → only ONE re-render
    setCount(c => c + 1);
    setName('Aman');
  }
}
```

---

## State Lifting (Sharing State)

When two sibling components need the same state, **lift it up** to their common parent:

```jsx
// ❌ Each component has its own state — they can't share
function App() {
  return (
    <div>
      <TemperatureInput />  {/* Has its own °C state */}
      <TemperatureDisplay /> {/* Can't access the above state */}
    </div>
  );
}

// ✅ Lift state up to the common parent
function App() {
  const [temperature, setTemperature] = useState(0);

  return (
    <div>
      <TemperatureInput
        value={temperature}
        onChange={setTemperature}
      />
      <TemperatureDisplay celsius={temperature} />
    </div>
  );
}

function TemperatureInput({ value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    />
  );
}

function TemperatureDisplay({ celsius }) {
  return <p>{celsius}°C = {celsius * 9/5 + 32}°F</p>;
}
```

---

## Derived State (Computed Values)

Don't store values in state if they can be computed from existing state:

```jsx
function Cart() {
  const [items, setItems] = useState([
    { id: 1, name: 'Apple', price: 30, qty: 2 },
    { id: 2, name: 'Banana', price: 15, qty: 3 },
  ]);

  // ✅ Computed from state — not stored separately in state
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isEmpty = items.length === 0;

  return (
    <div>
      <p>Items: {totalItems}</p>
      <p>Total: ₹{totalPrice}</p>
      {isEmpty && <p>Your cart is empty</p>}
    </div>
  );
}
```

---

## Summary

| Concept | Key Point |
|---|---|
| `useState` | Adds state to functional components |
| Setter function | Calling it triggers a re-render |
| Functional update | `setState(prev => prev + 1)` for state-dependent updates |
| Objects | Spread `{...prev, key: val}` — never mutate |
| Arrays | Use `filter`, `map`, spread — never `push`/`splice` |
| State lifting | Move state up to share between siblings |
| Derived state | Compute from state, don't store redundantly |

---

> **Previous:** [04 — Props ←](./04_props.md)
> **Next:** [06 — useEffect & Lifecycle →](./06_useEffect.md)

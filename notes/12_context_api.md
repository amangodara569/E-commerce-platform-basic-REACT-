# 12 — Context API

> **References:**
> - [Passing Data Deeply with Context — React Docs](https://react.dev/learn/passing-data-deeply-with-context)
> - [useContext Hook](https://react.dev/reference/react/useContext)
> - [createContext](https://react.dev/reference/react/createContext)

---

## The Problem: Prop Drilling

Without Context, you have to pass data through every layer of components, even those that don't use it:

```
App (has user data)
  ↓ pass user
  Page
    ↓ pass user
    Sidebar
      ↓ pass user
      UserMenu  ← finally uses user data
```

**Context** solves this by making data available to ANY component in the tree, without manual prop passing.

---

## Creating and Using Context

Context has three parts:
1. **Create** — `createContext()`
2. **Provide** — Wrap components in `<Context.Provider>`
3. **Consume** — Use `useContext()` in any child

### Step-by-Step Example

```jsx
// 1. Create the context (usually in a separate file)
// contexts/ThemeContext.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');  // 'light' = default value
```

```jsx
// 2. Provide the context (wrap components that need access)
// App.jsx
import { useState } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Content from './components/Content';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    // All children can now access the theme value
    <ThemeContext.Provider value={theme}>
      <Navbar />
      <Content />
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
}
```

```jsx
// 3. Consume the context (any descendant, any depth)
// components/Navbar.jsx
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

function Navbar() {
  const theme = useContext(ThemeContext);  // Access value directly!
  // No props needed — no matter how deep this is

  return (
    <nav className={`navbar navbar-${theme}`}>
      <h1>My App</h1>
    </nav>
  );
}
```

---

## Complete Context Pattern with State

The most common pattern — providing both state and updater:

```jsx
// contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

// Create context with undefined default (we'll provide real value)
const AuthContext = createContext(undefined);

// Custom provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(email, password) {
    setIsLoading(true);
    try {
      const userData = await loginAPI(email, password);
      setUser(userData);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('token');
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming (best practice — don't expose context directly)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

```jsx
// App.jsx — Wrap with provider
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

```jsx
// LoginPage.jsx — Use the context
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
}

// Navbar.jsx — Use user data anywhere
function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user.name}!</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
}
```

---

## Multiple Contexts

You can have multiple contexts for different concerns:

```jsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <NotificationProvider>
            <Router />
          </NotificationProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// In any component:
function ProductPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { notify } = useNotification();

  // Uses all four contexts!
}
```

---

## Theme Context — Real-World Example

```jsx
// contexts/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// App.css or index.css — CSS Variables for themes
/*
[data-theme="light"] {
  --bg: #ffffff;
  --text: #000000;
  --card: #f5f5f5;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #ffffff;
  --card: #2d2d2d;
}
*/
```

---

## Shopping Cart Context — Full Example

```jsx
// contexts/CartContext.jsx
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(item => item.id === action.product.id);
      if (existing) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(item => item.id !== action.id);
    case 'UPDATE_QTY':
      return state.map(item =>
        item.id === action.id ? { ...item, qty: action.qty } : item
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      addToCart: (product) => dispatch({ type: 'ADD', product }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE', id }),
      updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

// Usage
function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}

function CartIcon() {
  const { totalItems } = useCart();
  return <span>🛒 {totalItems}</span>;
}
```

---

## Context Performance — Avoiding Re-renders

Every time context value changes, ALL consumers re-render. Optimize with `useMemo`:

```jsx
// ❌ New object created on every render → all consumers re-render
function Provider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Memoize the value object
function Provider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(() => ({
    user,
    setUser,
    isAdmin: user?.role === 'admin',
  }), [user]);  // Only new object when user changes

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Context vs. Props vs. State Management

| | Props | Context | Redux/Zustand |
|---|---|---|---|
| Data flows | Parent → Child | Provider → Any consumer | Global store → Any component |
| Best for | Component-specific data | App-wide data (theme, auth) | Complex shared state |
| Boilerplate | Low | Medium | High (Redux) / Low (Zustand) |
| Performance | Excellent | Good (with care) | Excellent |

---

## Summary

| Concept | Key Point |
|---|---|
| `createContext()` | Creates a context object |
| `<Context.Provider value={...}>` | Wraps components that need access |
| `useContext(Context)` | Reads context value in any child |
| Custom hook | Wrap `useContext` in a custom hook for better API |
| Multiple contexts | Use separate contexts for different concerns |
| Performance | Memoize context value to prevent unnecessary re-renders |

---

> **Previous:** [11 — Hooks ←](./11_hooks.md)
> **Next:** [13 — React Router →](./13_react_router.md)

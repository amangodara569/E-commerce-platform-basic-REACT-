# 14 — State Management (Redux & Zustand)

> **References:**
> - [Redux Toolkit Docs](https://redux-toolkit.js.org/)
> - [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
> - [When to use Redux](https://redux.js.org/faq/general#when-should-i-use-redux)

---

## Why External State Management?

Context API is great for simple global state (theme, auth), but struggles with:
- **Frequent updates** — every context change re-renders all consumers
- **Complex state logic** — multiple interconnected pieces of state
- **Dev tools** — debugging complex state flows

**When to reach for state management:**
- Large app with many components sharing state
- Complex state updates with many side effects
- Need for time-travel debugging
- Team environment where predictability matters

---

## Option 1: Zustand (Simple & Modern ✅ Recommended)

Zustand is minimal, fast, and has no boilerplate:

```bash
npm install zustand
```

### Basic Store

```jsx
// stores/useCounterStore.js
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  // State
  count: 0,
  
  // Actions
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setCount: (value) => set({ count: value }),
}));

export default useCounterStore;
```

```jsx
// Any component — just call the hook!
import useCounterStore from './stores/useCounterStore';

function Counter() {
  const count = useCounterStore(state => state.count);
  const increment = useCounterStore(state => state.increment);
  const decrement = useCounterStore(state => state.decrement);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// Another component — accesses same global state
function CountDisplay() {
  const count = useCounterStore(state => state.count);
  return <h1>The count is: {count}</h1>;
}
```

### Real-World Zustand Store — Cart

```jsx
// stores/useCartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(  // Automatically persists to localStorage!
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        const existing = items.find(item => item.id === product.id);

        if (existing) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, qty: item.qty + 1 }
                : item
            )
          });
        } else {
          set({ items: [...items, { ...product, qty: 1 }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter(item => item.id !== id) }),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, qty } : item
          )
        });
      },

      clearCart: () => set({ items: [] }),

      // Computed values (getters)
      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      },
      get totalPrice() {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
      },
    }),
    {
      name: 'cart-storage',  // localStorage key
    }
  )
);

export default useCartStore;
```

```jsx
// Usage across components
function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem);
  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}

function CartIcon() {
  const totalItems = useCartStore(state => state.totalItems);
  return <span>🛒 {totalItems}</span>;
}

function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCartStore();
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <input
            type="number"
            value={item.qty}
            onChange={e => updateQty(item.id, Number(e.target.value))}
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ₹{totalPrice}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

---

## Zustand Middleware

```jsx
import { create } from 'zustand';
import { devtools, persist, immer } from 'zustand/middleware';

// devtools — adds Redux DevTools support
// persist — persists state to localStorage
// immer — allows direct mutation (Immer handles immutability)
const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set(state => ({ count: state.count + 1 })),
      }),
      { name: 'my-store' }
    ),
    { name: 'MyStore' }
  )
);
```

---

## Option 2: Redux Toolkit (Enterprise-Level)

Redux Toolkit (RTK) is the modern, official way to use Redux:

```bash
npm install @reduxjs/toolkit react-redux
```

### Setting Up the Store

```jsx
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});

// TypeScript types (if using TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```jsx
// main.jsx — Provide store to app
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### Creating a Slice

A **slice** contains: state, reducers (sync), and actions — all in one place.

```jsx
// store/slices/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    step: 1,
  },
  reducers: {
    // RTK uses Immer — you CAN mutate directly here!
    increment: (state) => {
      state.value += state.step;  // Looks like mutation but is safe!
    },
    decrement: (state) => {
      state.value -= state.step;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

// Export actions and reducer
export const { increment, decrement, incrementByAmount, setStep, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

### Using Redux in Components

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, setStep } from './store/slices/counterSlice';

function Counter() {
  // Select state from store
  const count = useSelector(state => state.counter.value);
  const step = useSelector(state => state.counter.step);
  
  // Get dispatch function
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <p>Step: {step}</p>
      <button onClick={() => dispatch(increment())}>+{step}</button>
      <button onClick={() => dispatch(decrement())}>-{step}</button>
      <button onClick={() => dispatch(incrementByAmount(10))}>+10</button>
      <button onClick={() => dispatch(setStep(5))}>Set Step: 5</button>
    </div>
  );
}
```

### Async Actions with createAsyncThunk

```jsx
// store/slices/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create async action
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',  // Action type name
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUsers: (state) => {
      state.list = [];
    },
  },
  // Handle async actions with extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
```

```jsx
// UserList.jsx — using async thunk
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from './store/slices/usersSlice';

function UserList() {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());  // Dispatch the async action
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

---

## RTK Query — Data Fetching Made Simple

RTK Query is a powerful data fetching/caching tool built into Redux Toolkit:

```jsx
// store/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Auto-generated hooks!
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} = api;
```

```jsx
// Using RTK Query hooks — so clean!
function UserList() {
  const { data: users, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return users.map(user => <p key={user.id}>{user.name}</p>);
}

function CreateUserForm() {
  const [createUser, { isLoading }] = useCreateUserMutation();

  async function handleSubmit(formData) {
    await createUser(formData);  // Auto invalidates cache!
  }
}
```

---

## Choosing a State Management Solution

```
Small app / Simple state
    → useState + useContext

Medium app / Moderate shared state
    → Zustand (simple, minimal)

Large app / Complex state / Team project
    → Redux Toolkit (powerful, standardized)

Data fetching / Caching
    → TanStack Query (React Query) or RTK Query
```

---

## Summary

| Library | Best For | Learning Curve | Bundle Size |
|---|---|---|---|
| Context + useState | Simple global state | Easy | 0 (built-in) |
| **Zustand** | Most apps | Very Easy | ~1kb |
| Redux Toolkit | Large/enterprise apps | Medium | ~10kb |
| RTK Query | Server state + caching | Medium | Included in RTK |

---

> **Previous:** [13 — React Router ←](./13_react_router.md)
> **Next:** [15 — Performance Optimization →](./15_performance.md)

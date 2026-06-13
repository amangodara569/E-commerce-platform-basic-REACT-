# 24 — Best Practices & Pro Tips

> **References:**
> - [React Best Practices — React Docs](https://react.dev/learn/thinking-in-react)
> - [Clean Code — Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
> - [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

---

## Project Structure Best Practices

### Feature-Based Organization (Recommended for large apps)

```
src/
├── components/          ← Shared, reusable UI components
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Modal.jsx
│   └── layout/
│       ├── Navbar.jsx
│       └── Footer.jsx
│
├── features/            ← Feature-specific code
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── store/
│   │   │   └── authSlice.js
│   │   └── api/
│   │       └── authApi.js
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api/
│   └── cart/
│
├── pages/               ← Route-level components
│   ├── Home.jsx
│   ├── ProductPage.jsx
│   └── Dashboard.jsx
│
├── hooks/               ← Shared custom hooks
│   ├── useLocalStorage.js
│   ├── useWindowSize.js
│   └── useDebounce.js
│
├── contexts/            ← Global contexts
│   ├── ThemeContext.jsx
│   └── CartContext.jsx
│
├── utils/               ← Helper functions
│   ├── formatters.js
│   ├── validators.js
│   └── api.js
│
├── constants/           ← App-wide constants
│   ├── routes.js
│   └── config.js
│
├── types/               ← TypeScript types (if using TS)
│   └── index.ts
│
└── assets/              ← Static files
    ├── images/
    └── fonts/
```

---

## Component Best Practices

### 1. Single Responsibility Principle

```jsx
// ❌ One component doing too much
function UserPage({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  // ... fetching, formatting, rendering all in one component

  return (
    <div>
      {/* 200 lines of JSX */}
    </div>
  );
}

// ✅ Single responsibility — compose smaller focused components
function UserPage({ userId }) {
  return (
    <div>
      <UserProfileHeader userId={userId} />
      <UserPostsList userId={userId} />
      <UserFollowersList userId={userId} />
    </div>
  );
}
```

### 2. Co-locate State with Where It's Used

```jsx
// ❌ Lifting state too high — unnecessary
function App() {
  const [searchQuery, setSearchQuery] = useState('');  // Only used in SearchBar
  return (
    <div>
      <SearchBar query={searchQuery} onChange={setSearchQuery} />
      <OtherContent />
    </div>
  );
}

// ✅ Keep state as close to where it's used as possible
function SearchBar() {
  const [query, setQuery] = useState('');  // Local — doesn't affect siblings
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

function App() {
  return (
    <div>
      <SearchBar />         {/* Self-contained */}
      <OtherContent />      {/* Unaffected by SearchBar state */}
    </div>
  );
}
```

### 3. Avoid Prop Drilling Early

```jsx
// ❌ More than 2-3 levels of prop drilling
<App user={user}>
  <Page user={user}>
    <Section user={user}>
      <Component user={user} />

// ✅ Use Context for deeply shared data
const UserContext = createContext(null);
// Then any component can useContext(UserContext) directly
```

---

## Code Quality Tips

### Naming Conventions

```jsx
// Components — PascalCase
function UserProfileCard() {}
const ProductList = () => {};

// Variables, functions — camelCase
const userName = 'Aman';
function handleSubmit() {}

// Constants — SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Props that are event handlers — prefix "on"
<Button onClick={handleClick} onHover={handleHover} />

// Handler functions — prefix "handle"
function handleClick() {}
function handleFormSubmit() {}

// Boolean props — prefix "is", "has", "can", "should"
const isLoading = true;
const hasError = false;
const canDelete = user.role === 'admin';
<Modal isOpen={isOpen} hasBackdrop={true} />

// Custom hooks — prefix "use"
function useLocalStorage() {}
function useFetch() {}
```

### Constants File

```jsx
// constants/routes.js
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  PRODUCTS: '/products',
  PRODUCT: (id) => `/products/${id}`,
};

// constants/api.js
export const API = {
  BASE_URL: import.meta.env.VITE_API_URL,
  TIMEOUT: 10000,
  ENDPOINTS: {
    USERS: '/users',
    PRODUCTS: '/products',
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
    },
  },
};

// Usage
import { ROUTES } from '../constants/routes';
navigate(ROUTES.DASHBOARD);
navigate(ROUTES.PRODUCT(123));
```

---

## Performance Best Practices

```jsx
// 1. Don't over-memoize — profile first!
// Only use useMemo/useCallback when you have a proven performance issue

// 2. Profile before optimizing
// Use React DevTools Profiler to find actual bottlenecks

// 3. Virtualize long lists (100+ items)
import { FixedSizeList } from 'react-window';

// 4. Lazy load expensive components
const HeavyChart = lazy(() => import('./HeavyChart'));

// 5. Avoid creating objects/functions in JSX
// ❌
<MyComponent style={{ color: 'red' }} onClick={() => doSomething()} />

// ✅
const styles = { color: 'red' };
const handleClick = useCallback(() => doSomething(), []);
<MyComponent style={styles} onClick={handleClick} />

// 6. Use production build for actual performance
npm run build && npm run preview
```

---

## Error Handling Patterns

```jsx
// Always handle three states: loading, error, success
function DataView({ url }) {
  const { data, loading, error } = useFetch(url);

  // Early returns pattern
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data || data.length === 0) return <EmptyState />;

  return <DataList data={data} />;
}

// Global error boundary
function App() {
  return (
    <ErrorBoundary fallback={<AppCrashed />}>
      <Router />
    </ErrorBoundary>
  );
}
```

---

## Custom Hook Patterns

```jsx
// Encapsulate complex logic into custom hooks
// ✅ Before: complex component
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    // ... fetch logic
  }, [query]);

  // ... more logic
}

// ✅ After: simple component + custom hook
function useSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // All the complex logic here
  }, [query]);

  return { results, loading, error };
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useSearch(query);
  // Clean and simple!
}
```

---

## Common Anti-Patterns to Avoid

```jsx
// ❌ 1. State for derived data
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ Just derive it
const fullName = `${firstName} ${lastName}`;

// ❌ 2. Overuse of useEffect
useEffect(() => {
  if (condition) {
    doSomething();
  }
}, [condition]);

// ✅ Use event handler or derive
function handleConditionChange(newCondition) {
  if (newCondition) doSomething();
}

// ❌ 3. Index as key for dynamic lists
list.map((item, index) => <Item key={index} />);

// ✅ Use stable IDs
list.map(item => <Item key={item.id} />);

// ❌ 4. Mutating state directly
state.name = 'New Name';  // DON'T
setState(state);

// ✅ Return new object
setState(prev => ({ ...prev, name: 'New Name' }));

// ❌ 5. useEffect without cleanup
useEffect(() => {
  const timer = setInterval(tick, 1000);
  // Forgot cleanup → memory leak!
}, []);

// ✅ Always clean up subscriptions/timers
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);  // Cleanup!
}, []);

// ❌ 6. Massive single component
function App() {
  return (
    // 500 lines of JSX in one component
  );
}

// ✅ Decompose
function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesList />
      <Testimonials />
      <Footer />
    </>
  );
}
```

---

## Code Splitting Strategy

```jsx
// Split at the route level (highest impact)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

// Split heavy third-party libraries
const MarkdownEditor = lazy(() => import('./components/MarkdownEditor'));
const DataChart = lazy(() => import('./components/DataChart'));

// Don't split small components — overhead not worth it
// ❌ Don't do this for tiny components
const Button = lazy(() => import('./components/Button'));  // Too small!
```

---

## Useful Utility Functions

```jsx
// utils/formatters.js
export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);

export const formatDate = (date, format = 'long') =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: format }).format(new Date(date));

export const formatNumber = (num) =>
  new Intl.NumberFormat('en-IN').format(num);

export const truncate = (str, length = 100) =>
  str.length > length ? `${str.substring(0, length)}...` : str;

export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// utils/validators.js
export const isEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
export const isPhone = (phone) => /^\+?[\d\s-]{10,}$/.test(phone);
export const isURL = (url) => {
  try { new URL(url); return true; }
  catch { return false; }
};

// utils/storage.js
export const storage = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { console.error('Storage error'); }
  },
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};
```

---

## Security Best Practices

```jsx
// 1. Never use dangerouslySetInnerHTML with user input
// ❌ XSS vulnerability
const userInput = '<script>alert("hacked")</script>';
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Sanitize if you must use it
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// 2. Don't expose sensitive data in frontend
// ❌ Never do this
const API_SECRET = 'my-secret-key';  // Visible in browser!
const DB_PASSWORD = 'password123';    // NEVER in frontend code!

// ✅ Use environment variables and backend
// Keep secrets on the server side

// 3. Validate on the server, not just the client
// Frontend validation = UX improvement
// Server validation = actual security

// 4. HTTPS everywhere in production
// All API calls should use HTTPS

// 5. Content Security Policy headers
// Set on your server/CDN to prevent XSS
```

---

## React 18+ Features to Know

```jsx
// 1. Automatic Batching — all state updates are batched
// Even in setTimeout, Promises, etc.
setTimeout(() => {
  setA(1);
  setB(2);  // React 18: Only ONE re-render
}, 0);

// 2. Concurrent Features
// useTransition, useDeferredValue (see hooks chapter)

// 3. Suspense improvements — works with data fetching
<Suspense fallback={<Skeleton />}>
  <DataComponent />
</Suspense>

// 4. new root API
// React 18 uses createRoot instead of render
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// 5. Strict Mode double invocation
// React.StrictMode runs effects twice in dev to detect side effects
```

---

## The React Mental Model

```
Data Flow:
  State/Props → Render → UI

When state changes:
  New State → Re-render → New UI (only changed parts update via VDOM diff)

Think declaratively:
  Not: "When user clicks, change the DOM"
  But: "The UI is a function of state. Change state, UI follows."

Component design:
  1. Identify pieces of UI → components
  2. Identify what changes → state
  3. Identify who owns state → lift up as needed
  4. Identify data flow → props down, events up
```

---

## Resources for Continued Learning

### Official
- [react.dev](https://react.dev) — Official React docs (excellent!)
- [Next.js Docs](https://nextjs.org/docs)

### Courses
- [Epic React — Kent C. Dodds](https://epicreact.dev/)
- [React — The Complete Guide (Udemy)](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)

### Practice
- [Frontend Mentor](https://www.frontendmentor.io/) — Build real projects
- [LeetCode Frontend](https://leetcode.com/problemset/javascript/) — JS challenges
- Build your own projects! Nothing beats practice.

### Communities
- [Reactiflux Discord](https://www.reactiflux.com/)
- [React Reddit](https://reddit.com/r/reactjs)
- [Dev.to React Tag](https://dev.to/t/react)

---

> **Previous:** [23 — Accessibility ←](./23_accessibility.md)
> **Back to Start:** [00 — Introduction →](./00_introduction.md)

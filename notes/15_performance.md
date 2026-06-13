# 15 — Performance Optimization

> **References:**
> - [React Performance — React Docs](https://react.dev/learn/render-and-commit)
> - [React.memo](https://react.dev/reference/react/memo)
> - [React Profiler](https://react.dev/reference/react/Profiler)
> - [Web Vitals](https://web.dev/vitals/)

---

## Understanding React Rendering

React re-renders a component when:
1. Its **state** changes
2. Its **props** change
3. Its **parent** re-renders (even if props didn't change!)

```
App re-renders
   ↓
   Navbar re-renders (even if nothing changed!)
   ↓
   UserMenu re-renders (even if nothing changed!)
```

This is fine for small apps but becomes a performance issue for large ones.

---

## React.memo — Prevent Unnecessary Re-renders

`memo()` wraps a component and **skips re-rendering if props haven't changed**:

```jsx
import { memo } from 'react';

// Without memo — re-renders whenever PARENT re-renders
function ExpensiveCard({ title, description }) {
  console.log('ExpensiveCard rendered!');
  // Imagine 200ms of computation here...
  return <div className="card"><h2>{title}</h2><p>{description}</p></div>;
}

// With memo — only re-renders when props ACTUALLY change
const ExpensiveCard = memo(function ExpensiveCard({ title, description }) {
  console.log('ExpensiveCard rendered!');
  return <div className="card"><h2>{title}</h2><p>{description}</p></div>;
});

// Parent
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {/* With memo: Card doesn't re-render when count changes */}
      <ExpensiveCard title="Hello" description="World" />
    </div>
  );
}
```

### memo with Custom Comparison

```jsx
// By default, memo does shallow comparison
// Provide custom comparison for complex props
const UserCard = memo(
  function UserCard({ user, onAction }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are EQUAL (skip re-render)
    // Return false if props changed (do re-render)
    return prevProps.user.id === nextProps.user.id
      && prevProps.user.name === nextProps.user.name;
  }
);
```

### When memo Doesn't Help

```jsx
// ❌ memo is useless here — new function created every render
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <MemoizedChild
      onClick={() => console.log('clicked')}  // New function every render!
    />
  );
}

// ✅ Combine with useCallback
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);  // Stable function reference

  return <MemoizedChild onClick={handleClick} />;
}
```

---

## Code Splitting & Lazy Loading

Split your app into smaller chunks that load only when needed:

```jsx
import { lazy, Suspense } from 'react';

// ❌ Without code splitting — entire app loads upfront
import Dashboard from './pages/Dashboard';  // Always bundled
import Reports from './pages/Reports';      // Always bundled

// ✅ With lazy loading — components load on demand
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports'));
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}
```

### Named Exports with lazy

```jsx
// Named export lazy loading
const { default: Modal } = await import('./Modal');

// Or with re-export
// modals.js
export { default as AlertModal } from './AlertModal';
export { default as ConfirmModal } from './ConfirmModal';

// Usage
const AlertModal = lazy(() =>
  import('./modals').then(m => ({ default: m.AlertModal }))
);
```

---

## React.Suspense

`Suspense` shows a fallback while a lazy component is loading:

```jsx
// Simple loading fallback
<Suspense fallback={<p>Loading...</p>}>
  <LazyComponent />
</Suspense>

// Better loading UI
<Suspense fallback={
  <div className="skeleton-loader">
    <div className="skeleton-title" />
    <div className="skeleton-text" />
    <div className="skeleton-text" />
  </div>
}>
  <UserProfile />
</Suspense>

// Nested Suspense boundaries
function App() {
  return (
    <Suspense fallback={<AppShell />}>
      <Navbar />
      <Suspense fallback={<ContentSkeleton />}>
        <MainContent />
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
    </Suspense>
  );
}
```

---

## Virtualization — Rendering Large Lists

Never render 10,000 items. Only render what's visible:

```bash
npm install react-window
```

```jsx
import { FixedSizeList, VariableSizeList } from 'react-window';

// FixedSizeList — all items same height
function BigList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="list-item">
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}           // Container height
      width="100%"           // Container width
      itemCount={items.length}  // Total items
      itemSize={60}          // Height of each item
    >
      {Row}
    </FixedSizeList>
  );
}

// VariableSizeList — items have different heights
function DynamicList({ items, getItemHeight }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].content}</div>
  );

  return (
    <VariableSizeList
      height={600}
      width="100%"
      itemCount={items.length}
      itemSize={index => getItemHeight(items[index])}
    >
      {Row}
    </VariableSizeList>
  );
}
```

---

## Image Optimization

```jsx
// Lazy loading images with native browser feature
function ProductImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"    // Native lazy loading
      decoding="async"  // Async decoding
      width="300"       // Specify dimensions to prevent layout shift
      height="200"
    />
  );
}

// Progressive loading with blur placeholder
function ProgressiveImage({ src, placeholder, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Blurry placeholder */}
      <img
        src={placeholder}
        alt={alt}
        style={{
          position: 'absolute',
          filter: 'blur(20px)',
          opacity: loaded ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      />
      {/* Full image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
      />
    </div>
  );
}
```

---

## Profiling Performance

### React DevTools Profiler

1. Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/)
2. Open DevTools → Profiler tab
3. Click record, interact with app, click stop
4. Analyze which components take the most time

### React.Profiler Component

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id,           // Component identifier
  phase,        // 'mount' or 'update'
  actualDuration,  // Time spent rendering
  baseDuration,    // Estimated time without memoization
  startTime,
  commitTime,
) {
  console.log(`${id} (${phase}): ${actualDuration.toFixed(2)}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Header />
      <Profiler id="Content" onRender={onRenderCallback}>
        <HeavyContent />
      </Profiler>
      <Footer />
    </Profiler>
  );
}
```

---

## Avoiding Common Performance Mistakes

### Mistake 1: Defining Components Inside Components

```jsx
// ❌ ChildComponent recreated on every Parent render!
function Parent() {
  function ChildComponent() {  // New component definition each render
    return <div>Child</div>;
  }
  return <ChildComponent />;
}

// ✅ Define outside
function ChildComponent() {
  return <div>Child</div>;
}
function Parent() {
  return <ChildComponent />;
}
```

### Mistake 2: Unnecessary State

```jsx
// ❌ Storing derived data in state
function Cart({ items }) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0));
  }, [items]);

  return <p>Total: {total}</p>;
}

// ✅ Just compute it
function Cart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <p>Total: {total}</p>;
}
```

### Mistake 3: Inline Object/Array in JSX

```jsx
// ❌ New style object on every render — triggers child re-render
<MyComponent style={{ color: 'red', fontSize: 16 }} />

// ✅ Move outside or use useMemo
const styles = { color: 'red', fontSize: 16 };
<MyComponent style={styles} />
```

### Mistake 4: Overusing useEffect

```jsx
// ❌ Don't use useEffect for data transformation
useEffect(() => {
  setFilteredList(list.filter(item => item.active));
}, [list]);

// ✅ Just derive during render
const filteredList = list.filter(item => item.active);
```

---

## Bundle Optimization

```js
// vite.config.js — Code splitting configuration
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', 'framer-motion'],
        },
      },
    },
    // Analyze bundle size
    chunkSizeWarningLimit: 1000,
  },
};
```

```bash
# Analyze bundle with rollup-plugin-visualizer
npm install --save-dev rollup-plugin-visualizer
npx vite build --mode analyze
```

---

## Performance Checklist

```
Before optimizing, measure first! (React DevTools Profiler)

✅ Lazy load routes with React.lazy()
✅ Use React.memo() for expensive components
✅ Use useCallback() for stable function references
✅ Use useMemo() for expensive computations
✅ Virtualize large lists (react-window)
✅ Lazy load images (loading="lazy")
✅ Avoid defining components inside components
✅ Avoid unnecessary state (derive from existing state)
✅ Avoid inline objects/arrays in JSX props
✅ Use production build for performance testing
✅ Split contexts to prevent unnecessary re-renders
```

---

## Summary

| Technique | What It Does | When to Use |
|---|---|---|
| `React.memo` | Skip re-render if props unchanged | Pure, expensive components |
| `useCallback` | Stable function references | Pass functions to memoized children |
| `useMemo` | Cache expensive calculations | Heavy computations |
| `React.lazy` | Load component on demand | Large, rarely-used components |
| `Suspense` | Show fallback while loading | Lazy components, data fetching |
| Virtualization | Only render visible items | Lists with 100+ items |

---

> **Previous:** [14 — State Management ←](./14_state_management.md)
> **Next:** [16 — Error Handling →](./16_error_handling.md)

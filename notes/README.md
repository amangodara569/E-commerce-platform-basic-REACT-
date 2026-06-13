# ⚛️ React — Complete Notes

> A comprehensive guide to learning React from **Zero to Advanced**.
> Every topic is covered with simple explanations, code examples, usage patterns, and web references.

---

## 📚 Table of Contents

### 🟢 Fundamentals (Start Here)

| # | File | Topics Covered |
|---|---|---|
| 00 | [Introduction](./00_introduction.md) | What is React, Virtual DOM, Why React, Core Concepts |
| 01 | [Setup & Tooling](./01_setup_and_tooling.md) | Vite, CRA, Project Structure, npm Scripts, VS Code Extensions |
| 02 | [JSX](./02_jsx.md) | JSX Syntax, Expressions, Rules, Fragments, Inline Styles, Comments |
| 03 | [Components](./03_components.md) | Functional vs Class, Export/Import, Composing, File Organization |
| 04 | [Props](./04_props.md) | Passing Props, Types, children, Default Props, Spreading, PropTypes |
| 05 | [State & useState](./05_state.md) | useState, Functional Updates, Objects, Arrays, Lifting State, Derived State |

### 🟡 Core Concepts

| # | File | Topics Covered |
|---|---|---|
| 06 | [useEffect & Lifecycle](./06_useEffect.md) | Mount/Update/Unmount, Dependency Array, Patterns, Cleanup, useLayoutEffect |
| 07 | [Event Handling](./07_events.md) | Event Types, Event Object, Propagation, Bubbling, preventDefault |
| 08 | [Conditional Rendering](./08_conditional_rendering.md) | if/else, Ternary, &&, Nullish Coalescing, Return null |
| 09 | [Lists & Keys](./09_lists_and_keys.md) | Array.map(), key prop, Filtering, Sorting, Virtualization |
| 10 | [Forms](./10_forms.md) | Controlled, Uncontrolled, Validation, React Hook Form, Input Types |

### 🟠 Hooks & State Management

| # | File | Topics Covered |
|---|---|---|
| 11 | [Hooks Deep Dive](./11_hooks.md) | useRef, useReducer, useCallback, useMemo, useId, useTransition, Custom Hooks |
| 12 | [Context API](./12_context_api.md) | createContext, Provider, useContext, Multiple Contexts, Performance |
| 13 | [React Router v6](./13_react_router.md) | Routes, Link, NavLink, Params, useNavigate, Nested Routes, Protected Routes |
| 14 | [State Management](./14_state_management.md) | Zustand, Redux Toolkit, RTK Query, When to Use What |

### 🔴 Advanced Topics

| # | File | Topics Covered |
|---|---|---|
| 15 | [Performance Optimization](./15_performance.md) | React.memo, Code Splitting, Suspense, Virtualization, Profiling |
| 16 | [Error Handling](./16_error_handling.md) | Error Boundaries, Async Errors, react-error-boundary, Global Handling |
| 17 | [API Integration](./17_api_integration.md) | Fetch, Axios, TanStack Query (React Query), Environment Variables |
| 18 | [Advanced Patterns](./18_advanced_patterns.md) | HOC, Render Props, Compound Components, Control Props, Headless |
| 19 | [TypeScript with React](./19_typescript.md) | Typing Props, State, Context, Events, Generics, Utility Types |

### 🔵 Ecosystem & Production

| # | File | Topics Covered |
|---|---|---|
| 20 | [Testing](./20_testing.md) | Vitest, RTL, User Events, Mocking, MSW, Custom Hook Testing |
| 21 | [Next.js Basics](./21_nextjs.md) | App Router, Layouts, SSR/SSG/ISR, API Routes, Metadata, Images |
| 22 | [Animations](./22_animations.md) | CSS Transitions, Framer Motion, Page Transitions, Scroll Animations |
| 23 | [Accessibility](./23_accessibility.md) | ARIA, Semantic HTML, Keyboard Nav, Focus Management, Screen Readers |
| 24 | [Best Practices](./24_best_practices.md) | Project Structure, Naming, Anti-patterns, Security, React 18 Features |

---

## 🚀 Learning Path

### For Beginners
```
00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10
Introduction → Setup → JSX → Components → Props → State → Effects → Events → Conditional → Lists → Forms
```

### For Intermediate Developers
```
11 → 12 → 13 → 14 → 15 → 16 → 17
Hooks → Context → Router → State Mgmt → Performance → Errors → API
```

### For Advanced Developers
```
18 → 19 → 20 → 21 → 22 → 23 → 24
Patterns → TypeScript → Testing → Next.js → Animations → a11y → Best Practices
```

---

## 🛠️ Quick Reference

### Essential Hooks Cheatsheet

```jsx
// State
const [value, setValue] = useState(initial);

// Side effects
useEffect(() => { /* effect */ return cleanup; }, [deps]);

// DOM access / mutable values
const ref = useRef(null);

// Expensive computation
const computed = useMemo(() => compute(a, b), [a, b]);

// Stable callback reference
const fn = useCallback(() => {}, [deps]);

// Complex state
const [state, dispatch] = useReducer(reducer, initialState);

// Context
const value = useContext(MyContext);

// Unique IDs
const id = useId();
```

### Common Patterns Cheatsheet

```jsx
// Fetch data on mount
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
}, []);

// Debounce input
useEffect(() => {
  const timer = setTimeout(() => search(query), 500);
  return () => clearTimeout(timer);
}, [query]);

// Event listener
useEffect(() => {
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);

// Update array item
setItems(prev => prev.map(item =>
  item.id === id ? { ...item, ...update } : item
));

// Remove array item
setItems(prev => prev.filter(item => item.id !== id));

// Add to array
setItems(prev => [...prev, newItem]);
```

---

## 📌 Key Rules to Remember

1. **Component names** must start with a capital letter
2. **Never mutate** state directly — always return new objects/arrays
3. **useEffect cleanup** — always clean up timers, subscriptions, and listeners
4. **Keys in lists** — use stable, unique IDs (not array index for dynamic lists)
5. **Call hooks** only at the top level, never inside loops or conditions
6. **Forms** — always call `e.preventDefault()` on submit
7. **Context** — don't overuse it; use for truly global data (auth, theme)
8. **Memoization** — measure first, then optimize. Don't premature-optimize!

---

*Happy coding! 🎉 Remember: the best way to learn React is to build projects.*

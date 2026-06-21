# 00 — Introduction to React

> **References:**
> - [Official React Docs](https://react.dev/)
> - [Why React? — React Blog](https://react.dev/blog/2023/03/16/introducing-react-dev)
> - [History of React — Medium](https://medium.com/@mattburgess/the-history-of-react-js-1-0-0-the-beginning-3e6c3a1e5f8b)

---

## 📚 Notes Index — Find Any Topic Fast

> Click a file name to open it. Key topics listed under each file.

---

### [00 — Introduction](./00_introduction.md)
- What is React, Why React
- Virtual DOM & Reconciliation
- React vs Vue vs Angular
- React's Core Concepts Overview
- React Philosophy (Declarative, Component-Based)

---

### [01 — Setup & Tooling](./01_setup_and_tooling.md)
- Create project with **Vite** (recommended)
- Create React App (legacy)
- Project folder structure
- Understanding key files (`main.jsx`, `App.jsx`, `index.html`)
- npm scripts (`dev`, `build`, `preview`)
- Vite config customization
- Recommended VS Code extensions

---

### [02 — JSX](./02_jsx.md)
- What is JSX, what it compiles to
- JSX Rules (single root, className, self-closing tags)
- JSX vs HTML differences
- Embedding JavaScript in JSX (`{}`)
- Inline styles in JSX
- JSX Fragments (`<> </>`)
- Comments in JSX

---

### [03 — Components](./03_components.md)
- What is a Component
- Functional Components
- Class Components (legacy)
- Types of Components
- Importing & Exporting components
- Composing components
- Component best practices & file organization

---

### [04 — Props](./04_props.md)
- What are Props, passing & receiving
- Types of props (string, number, boolean, object, function, children)
- Default Props
- The `children` prop
- Spreading Props
- PropTypes — runtime type checking
- Prop Drilling (problem)
- Real-world card component example

---

### [05 — State](./05_state.md)
- What is State, why not just use a variable
- `useState` Hook
- Multiple state variables
- Updating objects in state
- Updating arrays in state
- Initial state values
- Derived / computed state
- State lifting (sharing state between components)
- State batching (React 18+)

---

### [06 — useEffect & Component Lifecycle](./06_useEffect.md)
- Component Lifecycle (mount, update, unmount)
- `useEffect` hook syntax
- Dependency array (`[]`, `[dep]`, no array)
- Cleanup function (why it matters)
- Common patterns: fetch on mount, fetch on dep change, timers, event listeners, WebSockets
- useEffect execution order
- Common mistakes (missing deps, infinite loops, async useEffect)
- `useLayoutEffect`
- When NOT to use useEffect

---

### [07 — Events](./07_events.md)
- Basic event handling (`onClick`, `onChange`, `onSubmit`)
- The Event object (`e.target`, `e.preventDefault`)
- Common event types (mouse, keyboard, form, focus)
- Passing arguments to event handlers
- Event propagation & `e.stopPropagation()`
- Event handler naming conventions

---

### [08 — Conditional Rendering](./08_conditional_rendering.md)
- What is conditional rendering
- Method 1: `if/else`
- Method 2: Ternary operator `? :`
- Method 3: Logical AND `&&`
- Method 4: Nullish coalescing `??`
- Method 5: Return `null` (render nothing)
- Conditional `className`

---

### [09 — Lists & Keys](./09_lists_and_keys.md)
- Rendering lists with `.map()`
- Rendering lists of objects
- The `key` prop — why it's critical
- Key rules & best practices
- Extracting list item components
- Nested lists
- Filtering & sorting lists
- Generating unique IDs for new items
- Complete interactive Todo app example

---

### [10 — Forms](./10_forms.md)
- Controlled vs Uncontrolled components
- Controlled components (value + onChange)
- Basic form with multiple fields
- Different input types (text, checkbox, radio, select, textarea)
- Form validation
- Form reset
- Uncontrolled components with `useRef`
- Form accessibility
- React Hook Form library (recommended for complex forms)

---

### [11 — Hooks](./11_hooks.md)
- What are Hooks & Rules of Hooks
- `useState`, `useEffect` (recap)
- `useRef` — DOM refs & persistent values
- `useMemo` — memoize expensive calculations
- `useCallback` — memoize functions
- `useReducer` — complex state logic
- `useId` — generate unique IDs
- `useTransition` — mark non-urgent updates
- `useDeferredValue` — defer rendering
- Custom Hooks (how to build your own)
- Custom Hook patterns

---

### [12 — Context API](./12_context_api.md)
- The problem: Prop Drilling
- Creating and using Context (`createContext`, `useContext`)
- Complete Context pattern with state
- Multiple Contexts
- Theme Context — real-world example
- Shopping Cart Context — full example
- Context performance (avoiding re-renders)
- Context vs Props vs State Management

---

### [13 — React Router](./13_react_router.md)
- What is React Router, basic setup (v6)
- `<Link>` and `<NavLink>`
- Route parameters (`useParams`)
- Query parameters (`useSearchParams`)
- Nested routes
- Programmatic navigation (`useNavigate`)
- `useLocation` hook
- Lazy loading routes (code splitting)
- Protected routes (authentication)
- Complete routing example

---

### [14 — State Management](./14_state_management.md)
- Why external state management
- Option 1: **Zustand** (simple & modern ✅ recommended)
- Zustand middleware (persist, devtools)
- Option 2: **Redux Toolkit** (enterprise-level)
- RTK Query — data fetching made simple
- Choosing the right solution

---

### [15 — Performance](./15_performance.md)
- Understanding React rendering
- `React.memo` — prevent unnecessary re-renders
- `useMemo`, `useCallback` in depth
- Code splitting & lazy loading (`React.lazy`, `Suspense`)
- Virtualization — rendering large lists
- Bundle optimization
- Image optimization
- Profiling performance (React DevTools)
- Common performance mistakes to avoid
- Performance checklist

---

### [16 — Error Handling](./16_error_handling.md)
- Types of errors in React
- Error Boundaries (class-based)
- `react-error-boundary` library (recommended)
- Strategic error boundaries
- Handling async errors (API calls)
- Global error handling
- Custom error handler hook
- Error reporting services

---

### [17 — API Integration](./17_api_integration.md)
- `fetch()` — GET, POST, PUT, DELETE
- Axios — basic usage, axios instance, interceptors
- TanStack Query (React Query) — `useQuery`, `useMutation`
- Infinite queries (load more / pagination)
- Environment variables (`VITE_API_URL`)
- Custom `useFetch` hook

---

### [18 — Advanced Patterns](./18_advanced_patterns.md)
- Higher-Order Components (HOC)
- Render Props Pattern
- Compound Components
- Control Props Pattern
- Provider Pattern
- Slots Pattern (flexible composition)
- Headless Components

---

### [19 — TypeScript with React](./19_typescript.md)
- Why TypeScript with React
- Setting up Vite + TypeScript
- Basic TypeScript types
- Typing component props
- Typing `useState`, `useEffect`, `useRef`, `useCallback`
- Typing `useReducer`
- Typing event handlers
- Typing Context
- Generic components
- Utility types
- Practical example: Typed API hook

---

### [20 — Testing](./20_testing.md)
- Testing philosophy
- Testing stack (Jest, React Testing Library, MSW)
- Writing your first test
- Querying elements
- Testing user interactions
- Testing async components
- Testing Context
- Testing custom hooks
- Mocking with MSW (Mock Service Worker)
- Jest DOM matchers
- Running tests
- Common testing mistakes

---

### [21 — Next.js](./21_nextjs.md)
- What is Next.js
- App Router vs Pages Router
- App Router file conventions
- Creating pages
- Layouts
- Navigation
- Data fetching (SSR, SSG, ISR)
- Rendering strategies
- API routes
- Middleware
- Image optimization
- Metadata & SEO
- Code splitting strategy

---

### [22 — Animations](./22_animations.md)
- Animation options in React
- CSS Transitions (simplest)
- CSS Keyframes
- State-based CSS animations
- Framer Motion (library)
- Loading skeleton animations
- Number counter animation
- Notification toast animations

---

### [23 — Accessibility (a11y)](./23_accessibility.md)
- What is Accessibility & why it matters
- Semantic HTML first
- ARIA attributes & roles
- Keyboard navigation
- Color and contrast
- Images & alt text
- Form accessibility
- Skip navigation links
- Screen reader only text
- Accessible component examples
- Testing accessibility
- Accessibility checklist

---

### [24 — Best Practices](./24_best_practices.md)
- Project structure best practices
- Component best practices
- Performance best practices
- Code quality tips
- Security best practices
- Common anti-patterns to avoid
- React 18+ features to know

---

### [25 — Using APIs in React (Practical)](./25_api_in_react.md)
- Environment variables (`.env`, `VITE_API_URL`)
- `fetch()` — GET, POST, PUT, PATCH, DELETE with examples
- Sending auth token (JWT) in headers
- Axios install & basic usage
- Reusable axios instance (`src/utils/api.js`) with interceptors
- Core pattern: `useEffect` + `useState` (loading / error / data)
- Fetch on user action (button / form submit)
- Custom `useFetch` hook
- Understanding data flow step-by-step
- Accessing nested data with optional chaining `?.`
- Dependent requests (fetch B after A)
- Parallel requests with `Promise.all`
- Full CRUD example (Products page)
- Common errors and fixes table

---

## What is React?

React is a **JavaScript library** (not a framework) built by **Meta (Facebook)** for building **user interfaces (UI)**. It focuses specifically on the **View layer** of an application.

- First released: **May 2013**
- Current stable version: **React 18+**
- License: MIT

Think of React as a tool that helps you build complex UIs by breaking them into small, reusable pieces called **components**.

---

## Why React?

### Problems React Solves
Without React (plain HTML + JS), updating the UI is painful:
```html
<!-- Traditional DOM manipulation -->
<div id="counter">0</div>
<script>
  let count = 0;
  document.getElementById('counter').innerText = count; // Manual update every time!
</script>
```

With React, the UI **automatically updates** when data changes. You describe *what* the UI should look like, React figures out *how* to update the DOM efficiently.

### Key Benefits

| Feature | Explanation |
|---|---|
| **Component-Based** | Build encapsulated UI pieces that manage their own state |
| **Declarative** | Describe what you want; React handles the DOM updates |
| **Virtual DOM** | React uses a lightweight copy of the DOM for fast diffing |
| **One-way Data Flow** | Data flows top-down, making apps predictable |
| **Huge Ecosystem** | Massive community, libraries, and tooling |
| **React Native** | Use the same concepts to build mobile apps |

---

## React vs. Other Frameworks

| | React | Vue | Angular |
|---|---|---|---|
| Type | Library | Framework | Full Framework |
| Learning Curve | Medium | Easy | Hard |
| Data Binding | One-way | Two-way | Two-way |
| Language | JSX (JS) | Vue SFC | TypeScript |
| Maintained By | Meta | Community | Google |

---

## The Virtual DOM — The Magic Behind React

The **Virtual DOM** is a lightweight JavaScript object that mirrors the real DOM.

### How it works (step by step):

```
1. You change state/data
        ↓
2. React creates a NEW Virtual DOM tree
        ↓
3. React DIFFS new VDOM vs. old VDOM (called "Reconciliation")
        ↓
4. Only the changed parts are updated in the REAL DOM
```

This is much faster than re-rendering the entire page.

```js
// React internally does something like this:
const oldVDOM = { type: 'div', children: ['Hello'] };
const newVDOM = { type: 'div', children: ['Hello World'] };

// React finds the difference → only updates the text node
```

---

## React's Core Concepts (Overview)

You'll learn all of these in detail in the upcoming files:

```
React
├── Components        → Building blocks of UI
├── JSX               → HTML-like syntax in JS
├── Props             → Passing data between components
├── State             → Component's internal data
├── Hooks             → Special functions for state/lifecycle
├── Events            → User interactions
├── Context           → Global state sharing
└── Router            → Navigation between pages
```

---

## A Simple React Program

```jsx
// The simplest React component possible
function App() {
  return <h1>Hello, React! 🚀</h1>;
}

export default App;
```

This one function renders a heading on the screen. That's a React component!

---

## React's Philosophy

React follows three core ideas:

1. **Declarative**: Tell React *what* to render, not *how* to render it.
2. **Component-Based**: Everything is a component. Pages, buttons, headers — all components.
3. **Learn Once, Write Anywhere**: React concepts apply to React Native (mobile), React DOM (web), React Three Fiber (3D), etc.

---

## Summary

- React is a **UI library** made by Meta.
- It uses a **Virtual DOM** for fast updates.
- You build UIs using **components** — reusable JS functions.
- React is **declarative** — describe the UI, React handles updates.
- It has a massive ecosystem and is the most popular frontend library in the world.

---

> **Next:** [01 — Setup & Tooling →](./01_setup_and_tooling.md)

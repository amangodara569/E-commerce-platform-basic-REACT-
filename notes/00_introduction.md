# 00 — Introduction to React

> **References:**
> - [Official React Docs](https://react.dev/)
> - [Why React? — React Blog](https://react.dev/blog/2023/03/16/introducing-react-dev)
> - [History of React — Medium](https://medium.com/@mattburgess/the-history-of-react-js-1-0-0-the-beginning-3e6c3a1e5f8b)

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

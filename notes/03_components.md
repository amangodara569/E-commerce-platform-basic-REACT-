# 03 — Components

> **References:**
> - [Your First Component — React Docs](https://react.dev/learn/your-first-component)
> - [Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)
> - [Thinking in React](https://react.dev/learn/thinking-in-react)

---

## What is a Component?

A **component** is an independent, reusable piece of UI. Think of it like a custom HTML element that has its own logic and appearance.

```
Page
├── Navbar
│   ├── Logo
│   ├── NavLinks
│   └── UserMenu
├── Hero
│   ├── Heading
│   └── Button
└── Footer
```

Everything in a React app is a component!

---

## Types of Components

React has two types of components:

1. **Functional Components** — Modern, preferred way (use this!)
2. **Class Components** — Old way, still works but not recommended

---

## Functional Components

A functional component is just a **JavaScript function** that returns JSX.

### Basic Functional Component

```jsx
// Function declaration style
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Arrow function style (also very common)
const Welcome = () => {
  return <h1>Hello, World!</h1>;
};

// Arrow function with implicit return (for simple JSX)
const Welcome = () => <h1>Hello, World!</h1>;

export default Welcome;
```

### Rules for Functional Components

1. **Name must start with a capital letter** — `MyComponent`, not `myComponent`
2. **Must return JSX** (or `null` to render nothing)
3. **One component per file** (best practice)

```jsx
// ❌ Lowercase — React treats this as a DOM element
function myComponent() { ... }  // Wrong!

// ✅ PascalCase
function MyComponent() { ... }  // Correct!
```

---

## Class Components (Legacy)

Class components are the old way. You'll see them in older codebases.

```jsx
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default Welcome;
```

**Why avoid class components?**
- More verbose (more code)
- Harder to understand for beginners
- `this` keyword causes confusion
- Hooks (modern React) only work in functional components

> 📌 **Rule:** Always use functional components for new code.

---

## Importing and Exporting Components

### Default Export (one per file)

```jsx
// Button.jsx
function Button() {
  return <button>Click me</button>;
}

export default Button;  // Default export

// App.jsx
import Button from './Button';  // Can name it anything
import MyButton from './Button'; // Also valid
```

### Named Export (multiple per file)

```jsx
// icons.jsx
export function IconHome() { return <span>🏠</span>; }
export function IconUser() { return <span>👤</span>; }
export function IconSearch() { return <span>🔍</span>; }

// App.jsx
import { IconHome, IconUser } from './icons';  // Must use exact name
```

### Mixed Exports

```jsx
// components.jsx
export function Header() { ... }   // Named export
export function Footer() { ... }   // Named export

function App() { ... }
export default App;                // Default export

// Usage
import App, { Header, Footer } from './components';
```

---

## Composing Components

You build complex UIs by nesting components inside each other:

```jsx
// Small, focused components
function Avatar({ src, alt }) {
  return <img src={src} alt={alt} className="avatar" />;
}

function UserInfo({ user }) {
  return (
    <div className="user-info">
      <Avatar src={user.photo} alt={user.name} />
      <div>
        <h3>{user.name}</h3>
        <p>{user.bio}</p>
      </div>
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div className="card">
      <UserInfo user={user} />
      <button>Follow</button>
    </div>
  );
}

// The main page composes everything
function App() {
  const user = {
    name: "Aman Godara",
    bio: "React Developer",
    photo: "https://github.com/aman.png"
  };

  return (
    <div className="app">
      <h1>User Directory</h1>
      <UserCard user={user} />
    </div>
  );
}
```

---

## Component File Organization

Best practice: **one component per file**, named after the component.

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   └── Modal.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   └── Profile.jsx
├── App.jsx
└── main.jsx
```

---

## Returning Null (Render Nothing)

A component can return `null` to render nothing:

```jsx
function Alert({ message, show }) {
  // Don't render if show is false
  if (!show) return null;

  return (
    <div className="alert">
      {message}
    </div>
  );
}

// Usage
<Alert message="Success!" show={true} />   // Renders
<Alert message="Success!" show={false} />  // Renders nothing
```

---

## Component Best Practices

### 1. Keep Components Small and Focused

```jsx
// ❌ BAD — One giant component doing everything
function ProductPage() {
  return (
    <div>
      {/* 200 lines of JSX */}
    </div>
  );
}

// ✅ GOOD — Break into smaller pieces
function ProductPage() {
  return (
    <div>
      <ProductHeader />
      <ProductImages />
      <ProductDetails />
      <ProductReviews />
      <RelatedProducts />
    </div>
  );
}
```

### 2. Pure Components

Components should be **pure** — given the same inputs, always return the same output:

```jsx
// ✅ Pure — predictable
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// ❌ Impure — reads external mutable data
let count = 0;
function Counter() {
  count++;  // Mutating external variable!
  return <p>Count: {count}</p>;
}
```

### 3. Name Components Clearly

```jsx
// ❌ Vague names
function Component1() { ... }
function Thing() { ... }

// ✅ Descriptive names
function ProductCard() { ... }
function UserProfileHeader() { ... }
function NavigationDropdown() { ... }
```

---

## Real-World Example: Building a Card Component

```jsx
// Card.jsx
function Card({ title, description, imageUrl, tags }) {
  return (
    <article className="card">
      <img src={imageUrl} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
        <div className="card-tags">
          {tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default Card;

// App.jsx — Using the Card component
import Card from './components/Card';

function App() {
  return (
    <div className="grid">
      <Card
        title="React Basics"
        description="Learn React from scratch"
        imageUrl="/react.png"
        tags={['React', 'JavaScript', 'Frontend']}
      />
      <Card
        title="Node.js Guide"
        description="Backend development with Node"
        imageUrl="/node.png"
        tags={['Node', 'Backend', 'API']}
      />
    </div>
  );
}
```

---

## Summary

| Concept | Key Point |
|---|---|
| Functional Component | A function that returns JSX |
| Class Component | Old way, avoid in new code |
| PascalCase | Component names MUST start with capital letter |
| Default Export | One per file, any import name |
| Named Export | Multiple per file, import with exact name |
| Composing | Nest components inside each other |
| Pure | Same input → always same output |

---

> **Previous:** [02 — JSX ←](./02_jsx.md)
> **Next:** [04 — Props →](./04_props.md)

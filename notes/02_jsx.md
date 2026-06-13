# 02 — JSX (JavaScript XML)

> **References:**
> - [JSX in Depth — React Docs](https://react.dev/learn/writing-markup-with-jsx)
> - [JSX Transform — React Blog](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
> - [Babel JSX Playground](https://babeljs.io/repl)

---

## What is JSX?

**JSX** is a syntax extension for JavaScript that looks like HTML but is actually JavaScript under the hood. It lets you write UI structure directly inside JS files.

```jsx
// This is JSX
const element = <h1>Hello, World!</h1>;

// This is what JSX compiles to (plain JS)
const element = React.createElement('h1', null, 'Hello, World!');
```

> JSX is **not** HTML. It's a special syntax that Babel/Vite converts into `React.createElement()` calls.

---

## JSX vs HTML — Key Differences

| HTML | JSX | Reason |
|---|---|---|
| `class="..."` | `className="..."` | `class` is a reserved JS keyword |
| `for="..."` | `htmlFor="..."` | `for` is a reserved JS keyword |
| `onclick="..."` | `onClick={...}` | Events use camelCase |
| `<br>` | `<br />` | All tags must be self-closed |
| `<img>` | `<img />` | Must be self-closed |
| `style="color:red"` | `style={{ color: 'red' }}` | Styles use JS objects |

```jsx
// HTML ❌
<div class="box" onclick="handleClick()">
  <input type="text">
  <br>
</div>

// JSX ✅
<div className="box" onClick={handleClick}>
  <input type="text" />
  <br />
</div>
```

---

## Embedding JavaScript in JSX

Use **curly braces `{}`** to embed any JavaScript expression inside JSX:

```jsx
function Greeting() {
  const name = "Aman";
  const age = 21;
  const isAdmin = true;

  return (
    <div>
      {/* String */}
      <h1>Hello, {name}!</h1>

      {/* Math expression */}
      <p>You will be {age + 1} next year</p>

      {/* Ternary (condition ? true : false) */}
      <p>Role: {isAdmin ? 'Administrator' : 'User'}</p>

      {/* Function call */}
      <p>Uppercase: {name.toUpperCase()}</p>
    </div>
  );
}
```

### What can go inside `{}`?
✅ Variables, strings, numbers
✅ Math expressions: `{2 + 2}`
✅ Function calls: `{getName()}`
✅ Ternary operators: `{a ? b : c}`
✅ Array methods: `{items.map(...)}`
❌ Statements like `if`, `for`, `while` (use ternary or move logic outside)

---

## JSX Rules

### Rule 1: Return a Single Root Element

A component can only return ONE parent element. Use a `<div>` or `<>` (Fragment).

```jsx
// ❌ ERROR — Multiple root elements
function Bad() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  );
}

// ✅ Wrap in a div
function Good() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  );
}

// ✅ Or use Fragment (doesn't add extra DOM element)
function Better() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}
```

### Rule 2: All Tags Must Be Closed

```jsx
// ❌ HTML allows this, JSX doesn't
<input type="text">
<br>
<img src="photo.jpg">

// ✅ Self-close everything
<input type="text" />
<br />
<img src="photo.jpg" />
```

### Rule 3: camelCase for Attributes

```jsx
// ❌
<div tabindex="1" background-color="red">

// ✅
<div tabIndex="1">  {/* tabIndex not tabindex */}
```

> Exception: `aria-*` and `data-*` attributes stay hyphenated.

---

## JSX Fragments

Fragments let you group elements **without adding an extra DOM node**:

```jsx
import { Fragment } from 'react';

// Method 1: Short syntax (most common)
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}

// Method 2: Explicit Fragment (needed when you need a key prop)
function List({ items }) {
  return items.map(item => (
    <Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.definition}</dd>
    </Fragment>
  ));
}
```

---

## Inline Styles in JSX

Inline styles use **JavaScript objects** with camelCase property names:

```jsx
// ❌ String (HTML way)
<div style="color: red; font-size: 16px">

// ✅ Object (JSX way)
<div style={{ color: 'red', fontSize: '16px', marginTop: '20px' }}>

// ✅ Separate style object (cleaner)
const styles = {
  container: {
    color: 'red',
    fontSize: '16px',
    padding: '20px',
    backgroundColor: '#f0f0f0',
  }
};

function Card() {
  return <div style={styles.container}>Styled Content</div>;
}
```

---

## JSX Expressions — Practical Examples

### Rendering Variables

```jsx
function UserProfile() {
  const user = {
    name: "Aman",
    avatar: "https://github.com/aman.png",
    followers: 1200,
  };

  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>Followers: {user.followers.toLocaleString()}</p>
    </div>
  );
}
```

### Conditional Rendering in JSX

```jsx
function Status({ isOnline }) {
  return (
    <div>
      {/* Ternary operator */}
      {isOnline ? <span>🟢 Online</span> : <span>🔴 Offline</span>}

      {/* Short-circuit (&&) — only renders if true */}
      {isOnline && <p>Available for chat</p>}
    </div>
  );
}
```

### Rendering Lists in JSX

```jsx
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Cherry'];

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

---

## What JSX Compiles To

This helps you understand what's happening under the hood:

```jsx
// What you write (JSX):
function Button({ text, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      {text}
    </button>
  );
}

// What Babel compiles it to:
function Button({ text, onClick }) {
  return React.createElement(
    'button',
    { className: 'btn', onClick: onClick },
    text
  );
}
```

You can test any JSX in the [Babel REPL](https://babeljs.io/repl) to see the compiled output.

---

## JSX with Expressions — Common Patterns

```jsx
function Dashboard({ user, isLoading, error, items }) {
  return (
    <div className="dashboard">
      {/* Conditional rendering */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error.message}</p>}
      
      {/* Ternary */}
      {user ? (
        <h1>Welcome back, {user.name}!</h1>
      ) : (
        <h1>Please log in</h1>
      )}

      {/* List rendering */}
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      {/* Computed class names */}
      <div className={`card ${user?.isPremium ? 'premium' : 'free'}`}>
        Plan: {user?.isPremium ? 'Premium' : 'Free'}
      </div>
    </div>
  );
}
```

---

## Comments in JSX

```jsx
function App() {
  return (
    <div>
      {/* This is a JSX comment — use curly braces! */}
      <h1>Hello</h1>
      
      {/* 
        Multi-line comments
        also work like this
      */}
      
      {/* ❌ // Single line JS comments don't work inside JSX return */}
    </div>
  );
}
```

---

## Summary

| Concept | Key Point |
|---|---|
| JSX is JS | Compiles to `React.createElement()` calls |
| `className` | Use instead of `class` |
| Self-closing | All tags must be closed (`<br />`) |
| `{}` curly braces | Embed any JS expression |
| Single root | Wrap in `<div>` or `<>` Fragment |
| Inline styles | Use JS objects with camelCase |
| Comments | Use `{/* comment */}` |

---

> **Previous:** [01 — Setup & Tooling ←](./01_setup_and_tooling.md)
> **Next:** [03 — Components →](./03_components.md)

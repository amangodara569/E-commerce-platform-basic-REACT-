# 23 — Accessibility (a11y) in React

> **References:**
> - [React Accessibility Docs](https://react.dev/learn/accessibility)
> - [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
> - [WebAIM](https://webaim.org/)
> - [axe DevTools](https://www.deque.com/axe/)

---

## What is Accessibility?

**Accessibility (a11y)** means building websites that everyone can use — including people with:
- Visual impairments (using screen readers)
- Motor disabilities (using keyboard only)
- Hearing impairments
- Cognitive disabilities

In many countries, accessibility is also a **legal requirement**.

---

## Semantic HTML First

Use the right HTML elements — they're accessible by default:

```jsx
// ❌ No semantics
<div onClick={handleClick}>Submit</div>
<span onClick={handleNav}>Home</span>

// ✅ Semantic HTML
<button onClick={handleClick}>Submit</button>
<a href="/">Home</a>

// ❌ Generic containers for everything
<div className="header"><div className="nav"><div className="main">

// ✅ Semantic elements
<header><nav><main><section><article><aside><footer>
```

```jsx
// ✅ Full page structure
function PageLayout({ children }) {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>
      <main id="main-content">
        {children}
      </main>
      <footer>
        <p>© 2024 My App</p>
      </footer>
    </>
  );
}
```

---

## ARIA (Accessible Rich Internet Applications)

ARIA attributes provide extra context to screen readers when HTML semantics aren't enough:

```jsx
// aria-label — describes element when there's no visible text
<button aria-label="Close dialog">✕</button>
<button aria-label="Search">🔍</button>

// aria-labelledby — points to another element that serves as label
<h2 id="modal-title">Confirm Deletion</h2>
<dialog aria-labelledby="modal-title">...</dialog>

// aria-describedby — additional description
<input aria-describedby="password-hint" type="password" />
<p id="password-hint">Must be at least 8 characters</p>

// aria-expanded — toggle state
<button
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
>
  Menu
</button>
<ul id="dropdown-menu" hidden={!isOpen}>...</ul>

// aria-live — announce dynamic content changes
<div aria-live="polite">
  {status && <p>{status}</p>}
</div>

// aria-busy — loading state
<div aria-busy={isLoading} aria-label="User list">
  {isLoading ? <Spinner /> : <UserList />}
</div>

// role — override or add semantics
<div role="alert">Error: Network failure</div>
<div role="status">Saved successfully</div>
<div role="dialog" aria-modal="true">...</div>
```

---

## Form Accessibility

```jsx
// ❌ Poor accessibility
function BadForm() {
  return (
    <form>
      <p>Username</p>
      <input type="text" />
      <p>Email</p>
      <input type="text" />
    </form>
  );
}

// ✅ Accessible form
function GoodForm() {
  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="field">
        {/* htmlFor connects label to input */}
        <label htmlFor="username">
          Username <span aria-hidden="true">*</span>
        </label>
        <input
          id="username"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'username-error' : undefined}
          autoComplete="username"
        />
        {errors.username && (
          <p id="username-error" role="alert" className="error">
            {errors.username}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-describedby="email-hint"
        />
        <p id="email-hint" className="hint">
          We'll never share your email
        </p>
      </div>

      <button type="submit">
        Submit Form
      </button>
    </form>
  );
}
```

---

## Keyboard Navigation

All interactive elements must be keyboard accessible:

```jsx
// ❌ Div click handlers are not keyboard accessible
<div onClick={handleSelect}>Option 1</div>

// ✅ Use button or add keyboard support
<button onClick={handleSelect}>Option 1</button>

// ✅ Or add keyboard handler to div (not ideal, use button)
<div
  role="option"
  tabIndex={0}
  onClick={handleSelect}
  onKeyDown={e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
  }}
>
  Option 1
</div>
```

### Managing Focus

```jsx
// Focus management for modals
function Modal({ isOpen, onClose, children }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Trap focus inside modal
  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab') {
      // Get all focusable elements in modal
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();  // Tab backwards from first → go to last
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();  // Tab forwards from last → go to first
      }
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={handleKeyDown}
    >
      <button ref={closeButtonRef} onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  );
}
```

---

## Skip Navigation Links

Help keyboard users skip repetitive navigation:

```jsx
function Layout({ children }) {
  return (
    <>
      {/* Skip link — only visible on focus */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;  /* Visible when focused */
}
```

---

## Images and Alt Text

```jsx
// ✅ Descriptive alt text for informational images
<img src="chart.png" alt="Bar chart showing sales increased 40% in Q4 2024" />

// ✅ Empty alt for decorative images (screen reader skips)
<img src="decoration.svg" alt="" />

// ✅ Icon button with aria-label
<button aria-label="Delete item">
  <img src="trash.svg" alt="" />  {/* Empty alt — label on button is enough */}
</button>

// ✅ SVG icons
<button aria-label="Add to favorites">
  <svg aria-hidden="true" focusable="false">
    <use href="#heart-icon" />
  </svg>
</button>
```

---

## Color and Contrast

```css
/* ✅ Sufficient contrast ratios */
/* Normal text: 4.5:1 minimum */
/* Large text (18px+ or 14px bold+): 3:1 minimum */

/* ❌ Light gray on white - poor contrast */
.bad { color: #aaa; background: #fff; }

/* ✅ Dark gray on white - good contrast */
.good { color: #333; background: #fff; }

/* ❌ Color as the ONLY indicator */
.error { color: red; }

/* ✅ Color + icon/text */
.error { color: red; }
.error::before { content: "⚠ Error: "; }
```

---

## Accessible Components Examples

### Accessible Toggle

```jsx
function Toggle({ label, checked, onChange }) {
  const id = useId();

  return (
    <div className="toggle-wrapper">
      <span id={`${id}-label`}>{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={() => onChange(!checked)}
        className={`toggle ${checked ? 'on' : 'off'}`}
      >
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}
```

### Accessible Dropdown Menu

```jsx
function Dropdown({ trigger, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const menuRef = useRef(null);
  const menuId = useId();

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, items.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && activeIndex >= 0) {
      items[activeIndex].action();
      setIsOpen(false);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div className="dropdown">
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen(o => !o)}
      >
        {trigger}
      </button>

      {isOpen && (
        <ul
          id={menuId}
          role="menu"
          ref={menuRef}
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => (
            <li key={item.id} role="none">
              <button
                role="menuitem"
                tabIndex={activeIndex === index ? 0 : -1}
                onClick={() => { item.action(); setIsOpen(false); }}
                className={activeIndex === index ? 'active' : ''}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Screen Reader Only Text

```css
/* Visually hidden but readable by screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```jsx
function LoadingButton({ isLoading, children }) {
  return (
    <button disabled={isLoading}>
      {isLoading ? (
        <>
          <Spinner aria-hidden="true" />
          <span className="sr-only">Loading, please wait...</span>
        </>
      ) : children}
    </button>
  );
}
```

---

## Testing Accessibility

```bash
# Install axe-core for automated testing
npm install --save-dev @axe-core/react

# or use the browser extension
# Chrome: "axe DevTools" extension
# Firefox: "axe - Web Accessibility Testing" extension
```

```jsx
// Development-only accessibility checking
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react');
  axe(React, ReactDOM, 1000);  // Log violations to console after 1 second
}
```

```jsx
// Unit testing accessibility
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Form has no accessibility violations', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Accessibility Checklist

```
✅ Images have alt text (descriptive or empty for decorative)
✅ All form inputs have labels (htmlFor + id)
✅ Color is not the only visual indicator
✅ Sufficient color contrast (4.5:1 for text)
✅ All interactive elements are keyboard accessible
✅ Focus indicators are visible
✅ Page has a logical heading hierarchy (h1 → h2 → h3)
✅ Error messages are associated with inputs (aria-describedby)
✅ Dynamic content changes are announced (aria-live)
✅ Modals trap focus and close on Escape
✅ Skip navigation link exists
✅ Page has a main landmark (<main>)
✅ Language is declared (<html lang="en">)
```

---

> **Previous:** [22 — Animations ←](./22_animations.md)
> **Next:** [24 — Best Practices & Tips →](./24_best_practices.md)

# 07 — Event Handling

> **References:**
> - [Responding to Events — React Docs](https://react.dev/learn/responding-to-events)
> - [SyntheticEvent API](https://react.dev/reference/react-dom/components/common#react-event-object)

---

## Events in React

React handles events similarly to HTML, but with these key differences:

| HTML | React |
|---|---|
| `onclick` | `onClick` |
| `onchange` | `onChange` |
| `onsubmit` | `onSubmit` |
| String: `"handleClick()"` | Function reference: `{handleClick}` |

```jsx
// HTML way ❌
<button onclick="handleClick()">Click</button>

// React way ✅ — pass a function reference, not a string
<button onClick={handleClick}>Click</button>
```

---

## Basic Event Handling

```jsx
function Button() {
  // Method 1: Separate function (recommended for complex logic)
  function handleClick() {
    console.log('Button clicked!');
  }

  // Method 2: Arrow function (good for simple operations)
  const handleHover = () => console.log('Hovered!');

  return (
    <div>
      <button onClick={handleClick}>Click Me</button>
      <button onMouseEnter={handleHover}>Hover Me</button>

      {/* Method 3: Inline (avoid if complex) */}
      <button onClick={() => console.log('Inline!')}>Inline</button>
    </div>
  );
}
```

---

## The Event Object

React creates a **SyntheticEvent** — a cross-browser wrapper around the native event.

```jsx
function InputField() {
  function handleChange(event) {
    // event is the SyntheticEvent object
    console.log(event.type);          // "change"
    console.log(event.target);        // The DOM input element
    console.log(event.target.value);  // The input's current value
    console.log(event.target.name);   // The input's name attribute
  }

  return <input type="text" onChange={handleChange} />;
}
```

### Common Event Object Properties

```jsx
function EventDemo() {
  // Mouse event
  function handleClick(e) {
    console.log(e.clientX, e.clientY);  // Mouse position
    console.log(e.button);              // Which mouse button (0=left)
    console.log(e.shiftKey);            // Was Shift held?
    console.log(e.ctrlKey);             // Was Ctrl held?
  }

  // Keyboard event
  function handleKeyDown(e) {
    console.log(e.key);       // "Enter", "a", "Backspace", etc.
    console.log(e.code);      // "KeyA", "Enter", etc.
    console.log(e.keyCode);   // Numeric code (deprecated but still used)
    console.log(e.ctrlKey);   // Was Ctrl held?
    
    if (e.key === 'Enter') {
      console.log('Enter pressed!');
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  // Form submit event
  function handleSubmit(e) {
    e.preventDefault();  // Prevent page reload!
    // Process form data
  }

  return (
    <div>
      <div onClick={handleClick}>Click Area</div>
      <input onKeyDown={handleKeyDown} />
      <form onSubmit={handleSubmit}>...</form>
    </div>
  );
}
```

---

## Common Event Types

### Mouse Events

```jsx
function MouseEvents() {
  return (
    <div
      onClick={() => console.log('Clicked')}
      onDoubleClick={() => console.log('Double Clicked')}
      onMouseEnter={() => console.log('Mouse Entered')}
      onMouseLeave={() => console.log('Mouse Left')}
      onMouseMove={e => console.log(e.clientX, e.clientY)}
      onMouseDown={() => console.log('Mouse Down')}
      onMouseUp={() => console.log('Mouse Up')}
      onContextMenu={e => { e.preventDefault(); console.log('Right Click'); }}
    >
      Hover or click me
    </div>
  );
}
```

### Keyboard Events

```jsx
function KeyboardEvents() {
  function handleKey(e) {
    // onKeyDown fires on key press (most common)
    // onKeyUp fires on key release
    // onKeyPress is deprecated, use onKeyDown
    console.log(`Key: ${e.key}`);
  }

  return (
    <input
      onKeyDown={handleKey}
      onKeyUp={handleKey}
    />
  );
}
```

### Form Events

```jsx
function FormEvents() {
  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        onChange={e => console.log('Value:', e.target.value)}
        onFocus={() => console.log('Focused')}
        onBlur={() => console.log('Blurred (lost focus)')}
      />
      <select onChange={e => console.log('Selected:', e.target.value)}>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </select>
    </form>
  );
}
```

---

## Passing Arguments to Event Handlers

```jsx
function ItemList() {
  const items = ['Apple', 'Banana', 'Cherry'];

  // ✅ Use arrow function to pass arguments
  function handleDelete(itemName) {
    console.log(`Deleting: ${itemName}`);
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item}>
          {item}
          {/* Arrow function to pass the item */}
          <button onClick={() => handleDelete(item)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

```jsx
// Multiple arguments including event
function Button({ id, name }) {
  function handleClick(e, id, name) {
    e.stopPropagation();
    console.log(`Clicked item ${id}: ${name}`);
  }

  return (
    <button onClick={(e) => handleClick(e, id, name)}>
      {name}
    </button>
  );
}
```

---

## Event Propagation

Events **bubble up** through the component tree (child → parent).

```jsx
function PropagationExample() {
  return (
    <div onClick={() => console.log('Outer div clicked')}>
      <button onClick={() => console.log('Button clicked')}>
        Click Me
      </button>
    </div>
  );
  // Clicking button logs: "Button clicked" then "Outer div clicked"
  // (event bubbles up to parent)
}
```

### Stopping Propagation

```jsx
function StopPropagation() {
  function handleButtonClick(e) {
    e.stopPropagation();  // Stop event from reaching parent
    console.log('Button clicked (stopped propagation)');
  }

  return (
    <div onClick={() => console.log('Div never fires')}>
      <button onClick={handleButtonClick}>Click Me</button>
    </div>
  );
}
```

### Preventing Default Behavior

```jsx
function FormExample() {
  function handleSubmit(e) {
    e.preventDefault();  // Prevents page from reloading
    console.log('Form submitted!');
  }

  function handleLinkClick(e) {
    e.preventDefault();  // Prevents navigation
    console.log('Link clicked but not navigated');
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">Submit</button>
      </form>
      <a href="/other-page" onClick={handleLinkClick}>
        Custom link behavior
      </a>
    </div>
  );
}
```

---

## Practical Examples

### Interactive Counter with Keyboard

```jsx
function KeyboardCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function handleKeyPress(e) {
      if (e.key === 'ArrowUp') setCount(c => c + 1);
      if (e.key === 'ArrowDown') setCount(c => c - 1);
      if (e.key === 'r') setCount(0);
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Use ↑ / ↓ arrows or 'r' to reset</p>
    </div>
  );
}
```

### Drag and Drop Example

```jsx
function DragDrop() {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);

  function handleDrop(e) {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    setDroppedFile(file);
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${isDraggingOver ? 'blue' : 'gray'}`,
        padding: '40px',
        textAlign: 'center',
        backgroundColor: isDraggingOver ? '#e8f0ff' : 'white'
      }}
    >
      {droppedFile
        ? <p>Dropped: {droppedFile.name}</p>
        : <p>Drag a file here</p>
      }
    </div>
  );
}
```

### Search with Debounce

```jsx
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  // Debounce: Only search after user stops typing for 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timer);  // Cancel if user keeps typing
  }, [query]);

  return (
    <input
      type="search"
      value={query}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
}
```

---

## Event Handler Naming Conventions

```jsx
// Props that are event handlers → prefix with "on"
// Handler functions → prefix with "handle"

function Form({ onSubmit, onChange }) {  // Props: "on..."
  function handleSubmit(e) {             // Functions: "handle..."
    e.preventDefault();
    onSubmit(formData);
  }

  function handleChange(e) {
    onChange(e.target.value);
  }

  return <form onSubmit={handleSubmit}>...</form>;
}

// Usage
<Form
  onSubmit={handleFormSubmit}   // ← "on" + event name
  onChange={handleFormChange}
/>
```

---

## Summary

| Event | Handler Prop | Common Use |
|---|---|---|
| Mouse click | `onClick` | Buttons, links, toggles |
| Input change | `onChange` | Text inputs, selects |
| Form submit | `onSubmit` | Forms |
| Key press | `onKeyDown` | Shortcuts, search |
| Focus | `onFocus` / `onBlur` | Input validation |
| Mouse enter | `onMouseEnter` / `onMouseLeave` | Tooltips, hover effects |
| Drag | `onDrop`, `onDragOver` | File upload |

- Always call `e.preventDefault()` on form submits
- Use `e.stopPropagation()` to prevent event bubbling
- Naming: props use `on...`, handler functions use `handle...`

---

> **Previous:** [06 — useEffect ←](./06_useEffect.md)
> **Next:** [08 — Conditional Rendering →](./08_conditional_rendering.md)

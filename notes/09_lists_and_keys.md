# 09 — Lists & Keys

> **References:**
> - [Rendering Lists — React Docs](https://react.dev/learn/rendering-lists)
> - [Why Keys Are Important](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)

---

## Rendering Lists in React

To render a list, use JavaScript's `Array.map()` method to transform array items into JSX:

```jsx
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Cherry', 'Mango'];

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

## The `key` Prop — Why It's Critical

The `key` prop tells React which list item is which. Without it, React can't efficiently update lists.

```jsx
// ❌ Missing key — React warning + potential bugs
{items.map(item => <li>{item.name}</li>)}

// ✅ With key
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

### What React Does With Keys

```
List: [A(key=1), B(key=2), C(key=3)]

After update: [A(key=1), X(key=4), B(key=2), C(key=3)]
                              ↑ NEW item inserted

Without keys: React re-renders everything (slow & buggy)
With keys:    React only inserts X at the right position (fast!)
```

---

## Key Rules and Best Practices

### Rule 1: Keys Must Be Unique Among Siblings

```jsx
// ✅ Unique IDs — BEST choice for keys
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ✅ Unique string identifiers
{countries.map(country => (
  <li key={country.code}>{country.name}</li>
))}
```

### Rule 2: Don't Use Array Index as Key (Usually)

```jsx
// ❌ Index as key — causes bugs when list is reordered or filtered
{items.map((item, index) => (
  <li key={index}>{item}</li>
))}

// ✅ Use stable IDs instead
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

**When is index okay?**
- Static list that never changes order
- List items have no unique identifier
- List is never filtered or reordered

### Rule 3: Keys Don't Get Passed as Props

```jsx
function Item({ id, name, key }) {
  // key is NOT accessible as props.key!
  // If you need the id, pass it explicitly
  console.log(id);  // ✅ Works
  console.log(key); // ❌ undefined — key is special to React
}

<Item key={item.id} id={item.id} name={item.name} />
//    ^^^           ^^^
//    React uses    Component can access this
```

---

## Rendering Lists of Objects

```jsx
function UserList() {
  const users = [
    { id: 1, name: 'Aman', role: 'Admin', avatar: '👨‍💻' },
    { id: 2, name: 'Rahul', role: 'Developer', avatar: '👨‍🔧' },
    { id: 3, name: 'Priya', role: 'Designer', avatar: '👩‍🎨' },
  ];

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <span className="avatar">{user.avatar}</span>
          <div>
            <h3>{user.name}</h3>
            <p>{user.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Extracting List Item Components

For complex list items, extract them into a separate component:

```jsx
// ✅ Clean — extract to a component
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
        // Key goes on the outer element in the map, not inside ProductCard
      ))}
    </div>
  );
}
```

---

## Filtering and Sorting Lists

```jsx
function FilteredList() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const products = [
    { id: 1, name: 'Apple', category: 'fruit', price: 50 },
    { id: 2, name: 'Milk', category: 'dairy', price: 30 },
    { id: 3, name: 'Banana', category: 'fruit', price: 20 },
    { id: 4, name: 'Cheese', category: 'dairy', price: 100 },
  ];

  // Filter first
  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  // Then sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    return 0;
  });

  return (
    <div>
      {/* Controls */}
      <div className="controls">
        <select onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="fruit">Fruits</option>
          <option value="dairy">Dairy</option>
        </select>
        <select onChange={e => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ul>
          {sorted.map(product => (
            <li key={product.id}>
              {product.name} — ₹{product.price}
            </li>
          ))}
        </ul>
      )}

      <p>Showing {sorted.length} of {products.length} items</p>
    </div>
  );
}
```

---

## Nested Lists

```jsx
function CategoryList() {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      items: ['Phone', 'Laptop', 'Tablet'],
    },
    {
      id: 2,
      name: 'Clothing',
      items: ['Shirt', 'Jeans', 'Shoes'],
    },
  ];

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          {/* Nested list — keys only need to be unique among siblings */}
          <ul>
            {category.items.map((item, index) => (
              <li key={`${category.id}-${index}`}>{item}</li>
              // Combine parent ID + index for unique key
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

---

## Virtual Lists for Performance

For very large lists (1000+ items), use virtualization to only render visible items:

```bash
npm install react-window
# or
npm install @tanstack/react-virtual
```

```jsx
import { FixedSizeList } from 'react-window';

function BigList({ items }) {
  const Row = ({ index, style }) => (
    // style is crucial — it positions each row
    <div style={style} className="row">
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={500}        // Visible area height
      itemCount={items.length}
      itemSize={50}       // Height of each row
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
// Only renders ~10 items at a time instead of all 10,000!
```

---

## Generating Unique IDs for New Items

```jsx
// Option 1: crypto.randomUUID() — built into modern browsers
const id = crypto.randomUUID(); // "a1b2c3d4-e5f6-..."

// Option 2: Date.now() — simple but not truly unique
const id = Date.now(); // 1718284800000

// Option 3: nanoid library — best for production
import { nanoid } from 'nanoid';
const id = nanoid(); // "V1StGXR8_Z5jdHi6B-myT"

// Option 4: UUID library
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4(); // "550e8400-e29b-41d4-a716-446655440000"

// Usage in addTodo
function addTodo(text) {
  setTodos(prev => [
    ...prev,
    { id: crypto.randomUUID(), text, done: false }
  ]);
}
```

---

## Complete List Example: Interactive Todo App

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: true },
    { id: 2, text: 'Build a project', done: false },
    { id: 3, text: 'Deploy to production', done: false },
  ]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'done'

  function addTodo() {
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }]);
    setInput('');
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }

  const filtered = todos.filter(todo => {
    if (filter === 'active') return !todo.done;
    if (filter === 'done') return todo.done;
    return true;
  });

  return (
    <div className="todo-app">
      <h1>Todo List ({todos.filter(t => !t.done).length} left)</h1>

      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="filters">
        {['all', 'active', 'done'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? 'active' : ''}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filtered.length === 0 && <p>No todos here!</p>}
        {filtered.map(todo => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Summary

| Concept | Key Point |
|---|---|
| Rendering lists | Use `Array.map()` to return JSX |
| `key` prop | Required, must be unique among siblings |
| Best key | Use stable, unique ID from data |
| Index as key | Only OK for static, unchanging lists |
| Filtering | `array.filter()` before `.map()` |
| Sorting | `[...array].sort()` — spread first to avoid mutation |
| Large lists | Use `react-window` for virtualization |

---

> **Previous:** [08 — Conditional Rendering ←](./08_conditional_rendering.md)
> **Next:** [10 — Forms →](./10_forms.md)

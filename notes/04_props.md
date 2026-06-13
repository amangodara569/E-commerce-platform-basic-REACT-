# 04 — Props (Properties)

> **References:**
> - [Passing Props to a Component — React Docs](https://react.dev/learn/passing-props-to-a-component)
> - [PropTypes — npm](https://www.npmjs.com/package/prop-types)

---

## What are Props?

**Props** (short for Properties) are the way you pass data **from a parent component to a child component**. They work like function arguments.

```jsx
// Parent passes data → Child receives via props
<UserCard name="Aman" age={21} isAdmin={true} />
//         ↑ These are props
```

**Key rules about props:**
- Props flow **one direction** — parent → child (one-way data flow)
- Props are **read-only** — a child cannot modify its own props
- Props can be **any JavaScript value** — strings, numbers, arrays, objects, functions, JSX

---

## Passing and Receiving Props

### Basic Props

```jsx
// Parent Component
function App() {
  return (
    <div>
      <Greeting name="Aman" city="Delhi" />
      <Greeting name="Rahul" city="Mumbai" />
    </div>
  );
}

// Child Component — receives props as a parameter
function Greeting(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>From {props.city}</p>
    </div>
  );
}
```

### Destructuring Props (Recommended)

```jsx
// ✅ Cleaner — destructure props directly
function Greeting({ name, city }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>From {city}</p>
    </div>
  );
}
```

---

## Types of Props

### String Props

```jsx
<Button label="Submit" />
<Input placeholder="Enter your email" type="email" />
```

### Number Props (use `{}`)

```jsx
<Progress value={75} max={100} />
<Rating stars={4} />
```

### Boolean Props

```jsx
{/* Shorthand — just the name means true */}
<Button disabled />           // disabled={true}
<Input required />            // required={true}
<Toggle isOn={false} />      // explicit false needs {}
```

### Array Props

```jsx
<TagList tags={['React', 'JavaScript', 'CSS']} />
<DropDown options={['Option 1', 'Option 2', 'Option 3']} />
```

### Object Props

```jsx
const user = { name: 'Aman', role: 'admin', avatar: '/img.png' };
<UserProfile user={user} />

// Or inline
<UserProfile user={{ name: 'Aman', role: 'admin' }} />
```

### Function Props (Event Handlers)

```jsx
function App() {
  function handleClick() {
    console.log('Button clicked!');
  }

  return <Button onClick={handleClick} />;
}

function Button({ onClick, label }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### JSX as Props (children)

```jsx
<Card>
  <h2>Card Title</h2>
  <p>Card content here</p>
</Card>
```

---

## The `children` Prop

The special `children` prop contains everything between a component's opening and closing tags:

```jsx
// Card component that renders whatever is passed inside it
function Card({ children, title }) {
  return (
    <div className="card">
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Usage — children = everything between the tags
function App() {
  return (
    <Card title="My Card">
      <p>This is the card content</p>
      <button>Click Me</button>
      <img src="photo.jpg" alt="Photo" />
    </Card>
  );
}
```

### More `children` examples

```jsx
// Layout component
function PageLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// Button with custom content
function IconButton({ children, onClick }) {
  return (
    <button onClick={onClick} className="icon-btn">
      {children}
    </button>
  );
}

// Usage
<IconButton onClick={handleSave}>
  💾 Save Changes
</IconButton>
```

---

## Default Props

Provide fallback values for props that might not be passed:

```jsx
// Method 1: Default parameter values (Recommended)
function Button({ label = 'Click Me', color = 'blue', disabled = false }) {
  return (
    <button
      style={{ backgroundColor: color }}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

// If no props are passed, defaults are used
<Button />                    // Shows "Click Me" in blue
<Button label="Submit" />    // Shows "Submit" in blue
<Button label="Go" color="green" />  // Shows "Go" in green
```

```jsx
// Method 2: defaultProps (older way, still works)
function Button({ label, color }) {
  return <button style={{ backgroundColor: color }}>{label}</button>;
}

Button.defaultProps = {
  label: 'Click Me',
  color: 'blue',
};
```

---

## Prop Drilling

When you need to pass props through multiple layers of components:

```jsx
// App → Page → Section → Component → FinalChild
// Having to pass the same prop through every level is called "prop drilling"

function App() {
  const user = { name: 'Aman', role: 'admin' };
  return <Page user={user} />;
}

function Page({ user }) {
  return <Section user={user} />;
}

function Section({ user }) {
  return <Profile user={user} />;
}

function Profile({ user }) {
  return <h1>Hello, {user.name}</h1>;
}
```

> ⚠️ **Prop drilling** becomes painful with many levels. Solutions: **Context API** or **State Management** (covered in later chapters).

---

## Spreading Props

You can spread an object as props using the spread operator:

```jsx
function App() {
  const buttonProps = {
    label: 'Submit',
    color: 'green',
    disabled: false,
    onClick: handleSubmit,
  };

  return <Button {...buttonProps} />;
  // Same as: <Button label="Submit" color="green" disabled={false} onClick={handleSubmit} />
}
```

### Use Case: Forwarding Props

```jsx
// FancyButton wraps a regular button and forwards all props
function FancyButton({ children, ...rest }) {
  return (
    <button className="fancy-btn" {...rest}>
      {children}
    </button>
  );
}

// All standard button props work automatically
<FancyButton type="submit" disabled onClick={handleClick}>
  Submit Form
</FancyButton>
```

---

## PropTypes — Runtime Type Checking

`prop-types` validates the types of props at runtime (development only):

```bash
npm install prop-types
```

```jsx
import PropTypes from 'prop-types';

function UserCard({ name, age, email, isAdmin, tags, onDelete }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      {isAdmin && <span className="badge">Admin</span>}
      <ul>
        {tags.map(tag => <li key={tag}>{tag}</li>)}
      </ul>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

// Define expected prop types
UserCard.propTypes = {
  name: PropTypes.string.isRequired,    // Required string
  age: PropTypes.number,                // Optional number
  email: PropTypes.string.isRequired,   // Required string
  isAdmin: PropTypes.bool,              // Optional boolean
  tags: PropTypes.arrayOf(PropTypes.string),  // Array of strings
  onDelete: PropTypes.func.isRequired,  // Required function
};

// Default values
UserCard.defaultProps = {
  age: 18,
  isAdmin: false,
  tags: [],
};
```

### Common PropTypes

```jsx
MyComp.propTypes = {
  name: PropTypes.string,
  count: PropTypes.number,
  isActive: PropTypes.bool,
  handler: PropTypes.func,
  list: PropTypes.array,
  data: PropTypes.object,
  node: PropTypes.node,           // Anything renderable (JSX, string, etc.)
  element: PropTypes.element,     // React element
  oneOf: PropTypes.oneOf(['left', 'right', 'center']),  // Enum
  arrayOfStrings: PropTypes.arrayOf(PropTypes.string),
  objectShape: PropTypes.shape({  // Object with specific shape
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  }),
};
```

> 💡 **Tip:** If using TypeScript, you don't need PropTypes — TypeScript handles type checking at compile time.

---

## Real-World Component with Props

```jsx
// ProductCard.jsx
import PropTypes from 'prop-types';

function ProductCard({
  image,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  onAddToCart,
  onWishlist,
  inStock = true
}) {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <div className={`product-card ${!inStock ? 'out-of-stock' : ''}`}>
      <div className="image-container">
        <img src={image} alt={name} />
        {discount > 0 && <span className="badge">-{discount}%</span>}
        <button className="wishlist-btn" onClick={onWishlist}>❤️</button>
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <div className="pricing">
          <span className="price">₹{price}</span>
          {originalPrice > price && (
            <span className="original-price">₹{originalPrice}</span>
          )}
        </div>

        <div className="rating">
          {'⭐'.repeat(Math.floor(rating))} {rating} ({reviewCount} reviews)
        </div>

        <button
          className="add-to-cart"
          onClick={onAddToCart}
          disabled={!inStock}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  originalPrice: PropTypes.number,
  rating: PropTypes.number,
  reviewCount: PropTypes.number,
  onAddToCart: PropTypes.func.isRequired,
  onWishlist: PropTypes.func,
  inStock: PropTypes.bool,
};

export default ProductCard;
```

---

## Summary

| Concept | Key Point |
|---|---|
| Props | Data passed parent → child |
| Read-only | Child cannot modify its props |
| Destructuring | `function Comp({ name, age })` |
| Default props | `function Comp({ name = 'Default' })` |
| `children` | Content between component tags |
| Spread props | `<Comp {...propsObject} />` |
| PropTypes | Runtime type checking library |

---

> **Previous:** [03 — Components ←](./03_components.md)
> **Next:** [05 — State & useState →](./05_state.md)

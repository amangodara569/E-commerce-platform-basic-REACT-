# 18 — Advanced Patterns

> **References:**
> - [Higher-Order Components — React Docs](https://react.dev/learn/reusing-logic-with-custom-hooks)
> - [Compound Components Pattern](https://kentcdodds.com/blog/compound-components-with-react-hooks)
> - [Render Props — React Docs](https://react.dev/reference/react/cloneElement)

---

## 1. Higher-Order Components (HOC)

A **Higher-Order Component** is a function that takes a component and returns a **new enhanced component**.

```
HOC = Component → Enhanced Component
```

```jsx
// Pattern: withAuthentication HOC
function withAuthentication(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    // Render original component with additional props
    return <WrappedComponent {...props} currentUser={user} />;
  };
}

// Usage
function Dashboard({ currentUser }) {
  return <h1>Welcome, {currentUser.name}!</h1>;
}

export default withAuthentication(Dashboard);
// Now Dashboard is protected automatically
```

```jsx
// HOC: withLoading
function withLoading(WrappedComponent) {
  return function LoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return (
        <div className="loading-wrapper">
          <Spinner />
        </div>
      );
    }
    return <WrappedComponent {...props} />;
  };
}

// HOC: withErrorBoundary
function withErrorBoundary(WrappedComponent, fallback) {
  return function ErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Compose multiple HOCs
const EnhancedDashboard = withAuthentication(
  withLoading(
    withErrorBoundary(Dashboard, <p>Dashboard crashed</p>)
  )
);
```

> 💡 **Modern alternative:** Custom hooks have largely replaced HOCs for code reuse. Use HOCs when you need to wrap components with UI or when working with class components.

---

## 2. Render Props Pattern

Pass a function as a prop that returns JSX. The component calls this function to render content, passing data to the parent.

```jsx
// Mouse tracker using render props
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      style={{ height: '400px', border: '1px solid #ccc' }}
      onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}
    >
      {render(position)}
    </div>
  );
}

// Usage — parent controls what renders with the data
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <p>Mouse at: {x}, {y}</p>
      )}
    />
  );
}

// Same tracker, different output
function AimingGame() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div
          className="cursor"
          style={{ left: x, top: y, position: 'absolute' }}
        />
      )}
    />
  );
}
```

```jsx
// More common: children as a function
function DataFetcher({ url, children }) {
  const { data, loading, error } = useFetch(url);
  return children({ data, loading, error });
}

// Usage
<DataFetcher url="/api/users">
  {({ data: users, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error />;
    return <UserList users={users} />;
  }}
</DataFetcher>
```

> 💡 **Modern alternative:** Custom hooks solve the same problem without the awkward JSX nesting.

---

## 3. Compound Components

Components that work together, sharing state implicitly. Like `<select>` and `<option>` in HTML.

```jsx
// Select component with compound pattern
import { createContext, useContext, useState } from 'react';

const SelectContext = createContext(null);

// Parent component — owns state
function Select({ children, onChange, defaultValue }) {
  const [selected, setSelected] = useState(defaultValue);

  function handleSelect(value, label) {
    setSelected(value);
    onChange?.(value, label);
  }

  return (
    <SelectContext.Provider value={{ selected, handleSelect }}>
      <div className="select-container">{children}</div>
    </SelectContext.Provider>
  );
}

// Child components — consume shared state
function SelectTrigger({ children }) {
  const { selected } = useContext(SelectContext);
  return (
    <button className="select-trigger">
      {selected || children}
    </button>
  );
}

function SelectContent({ children }) {
  return <div className="select-content">{children}</div>;
}

function SelectItem({ value, children }) {
  const { selected, handleSelect } = useContext(SelectContext);
  return (
    <div
      className={`select-item ${selected === value ? 'selected' : ''}`}
      onClick={() => handleSelect(value, children)}
    >
      {children}
    </div>
  );
}

// Attach sub-components to parent
Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Item = SelectItem;

// Usage — clean, readable API
function App() {
  return (
    <Select onChange={value => console.log(value)} defaultValue="react">
      <Select.Trigger>Choose Framework</Select.Trigger>
      <Select.Content>
        <Select.Item value="react">React</Select.Item>
        <Select.Item value="vue">Vue</Select.Item>
        <Select.Item value="angular">Angular</Select.Item>
      </Select.Content>
    </Select>
  );
}
```

### Tab Component — Real-World Compound Component

```jsx
const TabContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list" role="tablist">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabContext);
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      className={`tab ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanels({ children }) {
  return <div className="tab-panels">{children}</div>;
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabContext);
  if (activeTab !== id) return null;
  return <div role="tabpanel" className="tab-panel">{children}</div>;
}

// Compose together
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// Usage
<Tabs defaultTab="about">
  <Tabs.List>
    <Tabs.Tab id="about">About</Tabs.Tab>
    <Tabs.Tab id="skills">Skills</Tabs.Tab>
    <Tabs.Tab id="projects">Projects</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel id="about"><AboutContent /></Tabs.Panel>
    <Tabs.Panel id="skills"><SkillsContent /></Tabs.Panel>
    <Tabs.Panel id="projects"><ProjectsContent /></Tabs.Panel>
  </Tabs.Panels>
</Tabs>
```

---

## 4. Control Props Pattern

Let the parent optionally control a component's state (like HTML's controlled inputs):

```jsx
function Toggle({ isOn: controlledOn, defaultOn = false, onChange }) {
  const [internalOn, setInternalOn] = useState(defaultOn);

  // Use controlled value if provided, otherwise internal
  const isOn = controlledOn !== undefined ? controlledOn : internalOn;

  function handleToggle() {
    const newValue = !isOn;
    if (controlledOn === undefined) {
      setInternalOn(newValue);  // Uncontrolled — manage internally
    }
    onChange?.(newValue);  // Notify parent either way
  }

  return (
    <button
      className={`toggle ${isOn ? 'on' : 'off'}`}
      onClick={handleToggle}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}

// Uncontrolled — manages its own state
<Toggle defaultOn={false} onChange={v => console.log(v)} />

// Controlled — parent controls the state
<Toggle isOn={parentState} onChange={setParentState} />
```

---

## 5. Provider Pattern

Combine Context with a well-designed provider to create clean APIs:

```jsx
// A notification system using provider pattern
const NotificationContext = createContext(null);

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const notify = useCallback({
    success: (message) => addNotification({ type: 'success', message }),
    error: (message) => addNotification({ type: 'error', message }),
    warning: (message) => addNotification({ type: 'warning', message }),
    info: (message) => addNotification({ type: 'info', message }),
  }, []);

  function addNotification({ type, message, duration = 3000 }) {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="notification-container">
        {notifications.map(n => (
          <div key={n.id} className={`notification notification-${n.type}`}>
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotify = () => useContext(NotificationContext).notify;

// Usage — anywhere in the app
function Form() {
  const notify = useNotify();

  async function handleSubmit() {
    try {
      await submitData();
      notify.success('Data saved successfully!');
    } catch (err) {
      notify.error('Failed to save data');
    }
  }
}
```

---

## 6. Slots Pattern (Flexible Composition)

Inspired by web components, allows named content areas:

```jsx
function Modal({ children }) {
  // Extract named slots from children
  const slots = {};
  React.Children.forEach(children, child => {
    if (child?.type?.displayName) {
      slots[child.type.displayName] = child;
    }
  });

  return (
    <div className="modal-overlay">
      <div className="modal">
        {slots.Header && <div className="modal-header">{slots.Header}</div>}
        <div className="modal-body">{slots.Body}</div>
        {slots.Footer && <div className="modal-footer">{slots.Footer}</div>}
      </div>
    </div>
  );
}

// Simpler version with prop-based slots
function Modal({ header, children, footer, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {header && <div className="modal-header">{header}</div>}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

// Usage
<Modal
  header={<h2>Confirm Action</h2>}
  footer={
    <>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onConfirm}>Confirm</button>
    </>
  }
  onClose={onClose}
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

---

## 7. Headless Components

Provide behavior/logic but no UI. Users bring their own styles:

```jsx
// Headless Dropdown — provides behavior, no styles
function Dropdown({ children, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const context = {
    isOpen,
    selectedIndex,
    toggle: () => setIsOpen(o => !o),
    close: () => setIsOpen(false),
    selectItem: (index, value) => {
      setSelectedIndex(index);
      onSelect?.(value);
      setIsOpen(false);
    },
  };

  return (
    <DropdownContext.Provider value={context}>
      {children}
    </DropdownContext.Provider>
  );
}

// Headless libraries:
// - Headless UI (by Tailwind team) → @headlessui/react
// - Radix UI → @radix-ui/react-*
// - React Aria (by Adobe) → react-aria
```

---

## Pattern Comparison

| Pattern | Best For | Modern Alternative |
|---|---|---|
| HOC | Cross-cutting concerns, class components | Custom hooks |
| Render Props | Sharing stateful logic | Custom hooks |
| Compound Components | Related UI components sharing state | Still highly relevant! |
| Control Props | Flexible controlled/uncontrolled | Still highly relevant! |
| Provider | Global state/services | Still highly relevant! |
| Headless | Accessible, unstyled primitives | Use Radix/Headless UI |

---

> **Previous:** [17 — API Integration ←](./17_api_integration.md)
> **Next:** [19 — TypeScript with React →](./19_typescript.md)

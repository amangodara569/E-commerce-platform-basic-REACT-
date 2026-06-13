# 20 — Testing in React

> **References:**
> - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
> - [Vitest Docs](https://vitest.dev/)
> - [Jest Docs](https://jestjs.io/)
> - [Testing Best Practices — Kent C. Dodds](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Testing Philosophy

> **"The more your tests resemble the way your software is used, the more confidence they can give you."**
> — Kent C. Dodds (React Testing Library author)

**Test behavior, not implementation!**
- ❌ Don't test: internal state, component methods, CSS class names
- ✅ Do test: what users see, what happens when they interact, API calls

---

## Testing Stack

| Tool | Purpose |
|---|---|
| **Vitest** | Test runner (fast, works with Vite) |
| **Jest** | Test runner (traditional) |
| **React Testing Library (RTL)** | Renders React components for testing |
| **@testing-library/user-event** | Simulates real user interactions |
| **MSW (Mock Service Worker)** | Mocks API calls |

```bash
# Vite project
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom

# CRA project
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
# (Jest comes with CRA)
```

---

## Setup

```js
// vite.config.js — Configure Vitest
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',           // Simulate browser DOM
    globals: true,                  // Use describe/it/expect without imports
    setupFiles: './src/setupTests.js',
  },
});
```

```js
// src/setupTests.js
import '@testing-library/jest-dom';  // Adds helpful matchers like toBeInTheDocument()
```

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## Writing Your First Test

```jsx
// components/Button.jsx
function Button({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

export default Button;
```

```jsx
// components/Button.test.jsx (or Button.spec.jsx)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button component', () => {
  it('renders with the correct label', () => {
    render(<Button label="Submit" onClick={() => {}} />);

    // Find the button by its text
    const button = screen.getByText('Submit');
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();  // Mock function (jest.fn() in Jest)
    render(<Button label="Click Me" onClick={handleClick} />);

    const button = screen.getByText('Click Me');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Submit" onClick={() => {}} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button label="Submit" onClick={handleClick} disabled={true} />);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

## Querying Elements

RTL provides queries to find elements in the DOM:

```jsx
// Priority order (use these in order of preference):

// 1. getByRole — best for accessibility
screen.getByRole('button', { name: 'Submit' })
screen.getByRole('textbox', { name: 'Email' })
screen.getByRole('heading', { name: 'Login' })
screen.getByRole('checkbox', { name: 'Remember me' })
screen.getByRole('link', { name: 'Home' })

// 2. getByLabelText — for form inputs with labels
screen.getByLabelText('Email Address')

// 3. getByPlaceholderText — if no label available
screen.getByPlaceholderText('Enter your email')

// 4. getByText — for visible text content
screen.getByText('Welcome back!')

// 5. getByTestId — last resort (fragile!)
screen.getByTestId('submit-button')

// Query variants:
// getBy...   — throws error if not found (use in most cases)
// queryBy... — returns null if not found (use for "not in DOM" tests)
// findBy...  — async, waits for element (use for async rendering)
// getAllBy... — returns array of all matches

// Examples:
const submit = screen.getByRole('button', { name: /submit/i });
const error = screen.queryByText('Error');          // Returns null if not found
const userCard = await screen.findByText('Aman');   // Wait for async render
```

---

## Testing User Interactions

```jsx
// Testing a search form
describe('SearchBar', () => {
  it('calls onSearch with typed value', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Search' });

    // Type into input
    await userEvent.type(input, 'React hooks');

    // Click search button
    await userEvent.click(button);

    expect(onSearch).toHaveBeenCalledWith('React hooks');
  });
});
```

```jsx
// Testing a form
describe('LoginForm', () => {
  it('submits with correct credentials', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    // Fill in form
    await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');

    // Submit
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'secret123',
    });
  });

  it('shows error for empty fields', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    // Submit without filling in
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});
```

---

## Testing Async Components

```jsx
// Component that fetches data
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}

// Test with mocked fetch
import { vi } from 'vitest';

describe('UserList', () => {
  it('renders users after fetch', async () => {
    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, name: 'Aman' },
        { id: 2, name: 'Rahul' },
      ]),
    });

    render(<UserList />);

    // Wait for async data to appear
    expect(await screen.findByText('Aman')).toBeInTheDocument();
    expect(screen.getByText('Rahul')).toBeInTheDocument();
  });
});
```

---

## Mocking with MSW (Mock Service Worker)

MSW intercepts network requests at the service worker level — most realistic:

```bash
npm install -D msw
```

```js
// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Aman' },
      { id: 2, name: 'Rahul' },
    ]);
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 3, ...body }, { status: 201 });
  }),

  http.delete('/api/users/:id', ({ params }) => {
    return new HttpResponse(null, { status: 204 });
  }),
];
```

```js
// src/setupTests.js
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());  // Reset between tests
afterAll(() => server.close());
```

```jsx
// Now tests work with real fetch calls!
describe('UserList with MSW', () => {
  it('renders users from API', async () => {
    render(<UserList />);

    // MSW intercepts the /api/users fetch automatically
    expect(await screen.findByText('Aman')).toBeInTheDocument();
    expect(screen.getByText('Rahul')).toBeInTheDocument();
  });
});
```

---

## Testing Custom Hooks

```jsx
// hooks/useCounter.js
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  return {
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
    reset: () => setCount(initial),
  };
}

// hooks/useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with given value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

---

## Testing Context

```jsx
// Test component that uses context
function TestWrapper({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}

// Option 1: Wrap each render
render(<ComponentUsingContext />, { wrapper: TestWrapper });

// Option 2: Custom render function
function renderWithProviders(ui, options = {}) {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// Usage
describe('CartButton', () => {
  it('shows cart count from context', async () => {
    renderWithProviders(<CartButton />);
    expect(screen.getByText('0 items')).toBeInTheDocument();
  });
});
```

---

## Jest DOM Matchers

```jsx
// Common matchers from @testing-library/jest-dom
expect(element).toBeInTheDocument();          // Exists in DOM
expect(element).not.toBeInTheDocument();      // Not in DOM
expect(element).toBeVisible();                // Visible to user
expect(element).toBeDisabled();               // Has disabled attribute
expect(element).toBeEnabled();                // Not disabled
expect(element).toHaveTextContent('Hello');   // Contains text
expect(element).toHaveValue('aman@email.com'); // Input value
expect(element).toHaveAttribute('href', '/');  // Has attribute
expect(element).toHaveFocus();                 // Currently focused
expect(element).toHaveClass('active');         // Has CSS class
expect(element).toBeChecked();                 // Checkbox is checked
```

---

## Common Testing Mistakes

```jsx
// ❌ Testing implementation details
expect(component.state.count).toBe(1);   // Don't access component state!
expect(wrapper.find('.btn-primary')).toExist();  // Don't test CSS classes!

// ✅ Test behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument();

// ❌ Not waiting for async
fireEvent.click(submitButton);
expect(screen.getByText('Success')).toBeInTheDocument();  // Fails! Async!

// ✅ Await async changes
await userEvent.click(submitButton);
expect(await screen.findByText('Success')).toBeInTheDocument();

// ❌ Testing too much in one test
it('does everything', async () => {
  // 50 lines of code...
});

// ✅ One behavior per test
it('shows error when email is empty', async () => { ... });
it('shows error when password is too short', async () => { ... });
it('navigates to dashboard on success', async () => { ... });
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run in watch mode (auto-rerun on file change)
npm test -- --watch

# Run specific file
npm test -- Button.test.jsx

# Run with coverage report
npm test -- --coverage

# Open Vitest UI
npx vitest --ui
```

---

## Summary

| Tool | Purpose |
|---|---|
| Vitest/Jest | Run tests |
| RTL `render()` | Render component into DOM |
| `screen.getBy...` | Find elements (prefer by role/label) |
| `userEvent` | Simulate realistic user interactions |
| `vi.fn()` | Mock functions |
| `findBy...` | Async element queries |
| MSW | Mock API requests |
| `renderHook()` | Test custom hooks |

---

> **Previous:** [19 — TypeScript ←](./19_typescript.md)
> **Next:** [21 — Next.js Basics →](./21_nextjs.md)

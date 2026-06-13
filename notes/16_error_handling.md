# 16 — Error Handling & Error Boundaries

> **References:**
> - [Error Boundaries — React Docs](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
> - [react-error-boundary](https://github.com/bvaughn/react-error-boundary)

---

## Types of Errors in React

| Error Type | Example | Handle With |
|---|---|---|
| **Render errors** | Component throws during render | Error Boundary |
| **Async errors** | Failed API call in useEffect | try/catch + state |
| **Event errors** | Error in onClick handler | try/catch |
| **Promise rejections** | Unhandled promise | .catch() or try/catch |

---

## Error Boundaries

Error Boundaries are class components that catch JavaScript errors in their child tree and display a fallback UI instead of crashing the app.

> ⚠️ Error Boundaries must be **class components** (no functional hook equivalent yet).
> Error Boundaries do NOT catch errors in: event handlers, async code, server-side rendering, or in the error boundary itself.

### Creating an Error Boundary

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Called when an error occurs in a child component
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after the error is caught (for logging)
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Log to error reporting service
    // logErrorToService(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary fallback={<p>Page crashed!</p>}>
      <MainContent />
    </ErrorBoundary>
  );
}
```

---

## react-error-boundary Library (Recommended)

```bash
npm install react-error-boundary
```

```jsx
import { ErrorBoundary } from 'react-error-boundary';

// Fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-container">
      <h2>🚨 Something went wrong!</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.error(error, info)}
      onReset={() => {
        // Reset app state here if needed
        queryClient.clear();
      }}
    >
      <MainContent />
    </ErrorBoundary>
  );
}
```

---

## Strategic Error Boundaries

Place error boundaries at different levels for granular recovery:

```jsx
function App() {
  return (
    <div className="app">
      {/* App-level boundary — catches everything */}
      <ErrorBoundary FallbackComponent={AppErrorFallback}>

        <Navbar />

        {/* Feature-level boundary — only sidebar crashes, not whole app */}
        <ErrorBoundary FallbackComponent={SidebarError}>
          <Sidebar />
        </ErrorBoundary>

        <main>
          {/* Page-level boundary */}
          <ErrorBoundary FallbackComponent={PageError} key={location.pathname}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </ErrorBoundary>
        </main>

      </ErrorBoundary>
    </div>
  );
}
```

---

## Handling Async Errors (API Calls)

Error boundaries don't catch async errors. Handle them manually:

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => setError(null)} />;
  if (!user) return <p>User not found</p>;

  return <UserCard user={user} />;
}
```

---

## Custom Error Handler Hook

```jsx
function useAsyncError() {
  const [error, setError] = useState(null);

  if (error) throw error;  // Re-throw to be caught by Error Boundary

  return setError;
}

// Usage — throws async errors into Error Boundary
function DataComponent() {
  const throwError = useAsyncError();

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .catch(err => throwError(err));  // Now Error Boundary catches it!
  }, []);
}
```

---

## Global Error Handling

```jsx
// main.jsx — Catch unhandled errors globally
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();  // Prevent default browser error
});
```

---

## Error Reporting Services

```jsx
// utils/errorReporting.js
// Using Sentry (most popular error tracking service)
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});

// Error boundary with Sentry
function App() {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error }) => (
        <div>
          <h2>An error occurred</h2>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      )}
      showDialog  // Shows user feedback dialog
    >
      <YourApp />
    </Sentry.ErrorBoundary>
  );
}
```

---

## Best Practices

```jsx
// 1. Always handle loading and error states
function DataComponent() {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  // ✅ Handle all states
  if (state.loading) return <Spinner />;
  if (state.error) return <ErrorDisplay error={state.error} />;
  if (!state.data) return null;
  return <DataDisplay data={state.data} />;
}

// 2. Use key prop to reset Error Boundaries on navigation
function Routes() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary key={pathname}>  {/* Reset when route changes */}
      <PageContent />
    </ErrorBoundary>
  );
}

// 3. Provide meaningful error messages
function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="error-state">
      <span className="error-icon">⚠️</span>
      <h3>Something went wrong</h3>
      <p>{error.message || 'Please try again later'}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          Try Again
        </button>
      )}
    </div>
  );
}
```

---

## Summary

| Scenario | Solution |
|---|---|
| Render errors | Error Boundary (class component or `react-error-boundary`) |
| Async/fetch errors | try/catch in useEffect + error state |
| Event handler errors | try/catch in handler |
| Global unhandled | `window.addEventListener('error')` |
| Production monitoring | Sentry, Datadog, or similar |

---

> **Previous:** [15 — Performance ←](./15_performance.md)
> **Next:** [17 — API Integration →](./17_api_integration.md)

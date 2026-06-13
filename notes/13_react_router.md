# 13 — React Router v6

> **References:**
> - [React Router Docs](https://reactrouter.com/en/main)
> - [React Router v6 Tutorial](https://reactrouter.com/en/main/start/tutorial)

---

## What is React Router?

**React Router** is the standard library for routing in React apps. It enables navigation between pages/views without page reloads (Single Page Application).

```bash
npm install react-router-dom
```

---

## Basic Setup (v6)

```jsx
// main.jsx — Wrap app with BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```jsx
// App.jsx — Define routes
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />  {/* 404 catch-all */}
      </Routes>
    </div>
  );
}
```

---

## Navigation with `<Link>` and `<NavLink>`

```jsx
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      {/* Link — basic navigation */}
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>

      {/* NavLink — adds 'active' class when the link matches current URL */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/profile"
        style={({ isActive }) => ({
          color: isActive ? 'blue' : 'black',
          fontWeight: isActive ? 'bold' : 'normal',
        })}
      >
        Profile
      </NavLink>
    </nav>
  );
}
```

---

## Route Parameters (Dynamic Routes)

Use `:paramName` to capture dynamic segments of the URL:

```jsx
// App.jsx
<Routes>
  <Route path="/users" element={<UserList />} />
  <Route path="/users/:userId" element={<UserProfile />} />
  <Route path="/posts/:postId/comments/:commentId" element={<Comment />} />
</Routes>
```

```jsx
// UserProfile.jsx — access the parameter
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (!user) return <p>Loading...</p>;
  return <div><h1>{user.name}</h1></div>;
}

// URL: /users/123 → userId = "123"
// URL: /users/aman → userId = "aman"
```

---

## Programmatic Navigation with `useNavigate`

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');        // Navigate on success
      navigate('/dashboard', { replace: true });  // Replace history (no back)
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      {/* ... */}
    </form>
  );
}

// Navigate to previous page
function BackButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>← Back</button>;
}

// Navigate with state
function ProductCard({ product }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/products/${product.id}`, {
      state: { from: 'home', product },  // Pass data along
    });
  }
}

// Receive state in destination
function ProductPage() {
  const { state } = useLocation();
  console.log(state.from);       // "home"
  console.log(state.product);    // product object
}
```

---

## Query Parameters (Search Params)

```jsx
import { useSearchParams } from 'react-router-dom';

// URL: /products?category=electronics&sort=price&page=2

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'name';
  const page = parseInt(searchParams.get('page') || '1');

  function handleCategoryChange(newCategory) {
    setSearchParams(prev => {
      prev.set('category', newCategory);
      prev.set('page', '1');  // Reset to page 1
      return prev;
    });
  }

  return (
    <div>
      <select
        value={category}
        onChange={e => handleCategoryChange(e.target.value)}
      >
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <p>Showing: {category}, Sorted by: {sort}, Page: {page}</p>
    </div>
  );
}
```

---

## Nested Routes

Create layouts with nested routes:

```jsx
// App.jsx
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Routes>
      {/* Layout route */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />          {/* "/" */}
        <Route path="about" element={<About />} />  {/* "/about" */}
        
        {/* Nested layout */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />           {/* "/dashboard" */}
          <Route path="settings" element={<Settings />} />      {/* "/dashboard/settings" */}
          <Route path="profile" element={<Profile />} />        {/* "/dashboard/profile" */}
        </Route>
      </Route>
    </Routes>
  );
}

// Layout.jsx — contains shared UI + Outlet
function Layout() {
  return (
    <div>
      <Navbar />          {/* Shared navbar */}
      <main>
        <Outlet />        {/* Child routes render here */}
      </main>
      <Footer />          {/* Shared footer */}
    </div>
  );
}

// DashboardLayout.jsx
function DashboardLayout() {
  return (
    <div className="dashboard">
      <DashboardSidebar />
      <div className="dashboard-content">
        <Outlet />        {/* Dashboard sub-routes render here */}
      </div>
    </div>
  );
}
```

---

## Protected Routes (Authentication)

```jsx
// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, save current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage in App.jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  } />
</Routes>

// LoginPage — redirect back after login
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    await login(email, password);
    navigate(from, { replace: true });  // Go back to where they were
  }
}
```

---

## useLocation Hook

```jsx
import { useLocation } from 'react-router-dom';

function PageTracker() {
  const location = useLocation();
  // location = {
  //   pathname: "/products/123",
  //   search: "?sort=price",
  //   hash: "#reviews",
  //   state: { from: "home" },
  //   key: "ax3n4"
  // }

  useEffect(() => {
    // Track page views
    analytics.page(location.pathname);
  }, [location]);

  return null;
}
```

---

## Lazy Loading Routes (Code Splitting)

```jsx
import { lazy, Suspense } from 'react';

// Lazily import components — each becomes its own JS bundle
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}
// Each route's code only loads when that route is visited!
```

---

## Complete Routing Example

```jsx
// App.jsx — Full routing setup
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />

          {/* Protected routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Summary

| Hook/Component | Use For |
|---|---|
| `<BrowserRouter>` | Wraps the entire app |
| `<Routes>`, `<Route>` | Define routes |
| `<Link to="...">` | Navigation links (no reload) |
| `<NavLink>` | Navigation link with active state |
| `<Outlet>` | Renders child routes in layouts |
| `useParams()` | Access URL parameters (`:id`) |
| `useNavigate()` | Programmatic navigation |
| `useLocation()` | Current URL info |
| `useSearchParams()` | Query string params (`?key=value`) |
| `<Navigate>` | Declarative redirect |

---

> **Previous:** [12 — Context API ←](./12_context_api.md)
> **Next:** [14 — State Management →](./14_state_management.md)

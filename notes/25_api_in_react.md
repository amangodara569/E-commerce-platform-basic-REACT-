# 25 — Using APIs in React (Practical Guide)

> **References:**
> - [Fetch API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
> - [Axios Docs](https://axios-http.com/docs/intro)
> - [JSONPlaceholder (free test API)](https://jsonplaceholder.typicode.com/)
> - [Vite Env Variables](https://vitejs.dev/guide/env-and-mode)

---

## What is an API in React Context?

An **API (Application Programming Interface)** is a server endpoint that returns data (usually JSON). In React, you fetch this data and put it into state to display in the UI.

```
React Component
     ↓  (sends request)
  API Server (e.g. https://api.myapp.com/users)
     ↓  (returns JSON)
React Component
     ↓  (saves to state → re-renders UI)
```

---

## Step 0 — Set Up Environment Variables

Never hardcode your API URL — use `.env`:

```bash
# .env  (in root of your Vite project, next to package.json)
VITE_API_URL=http://localhost:5000/api
```

```jsx
// Anywhere in your React code
const BASE_URL = import.meta.env.VITE_API_URL;
// Result: "http://localhost:5000/api"
```

> ⚠️ **Important:** Variables must start with `VITE_` to be accessible in Vite projects.
> Restart the dev server after changing `.env`.

---

## Method 1: Using `fetch()` (Built-in, No Install Needed)

### Basic GET Request

```jsx
// GET — fetch a list of users
async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');

  // response.ok is true if status is 200-299
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json(); // parse JSON body
  console.log(data);
  // [{id:1, name:"Leanne Graham", ...}, ...]
}
```

### GET Request with Query Params

```jsx
// Manually build URL with query string: /posts?userId=1&_limit=5
const url = new URL('https://jsonplaceholder.typicode.com/posts');
url.searchParams.set('userId', 1);
url.searchParams.set('_limit', 5);

const res = await fetch(url);
const posts = await res.json();
```

### POST Request (Send Data to Server)

```jsx
// POST — create a new user
async function createUser(userData) {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // tell server we're sending JSON
    },
    body: JSON.stringify(userData), // convert JS object → JSON string
  });

  const newUser = await response.json();
  console.log(newUser); // { id: 11, name: "Aman", ... }
  return newUser;
}

// Call it:
createUser({ name: 'Aman', email: 'aman@gmail.com' });
```

### PUT Request (Update Existing Data)

```jsx
// PUT — replace entire user with id = 1
async function updateUser(id, updatedData) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  return response.json();
}
```

### PATCH Request (Update Partial Data)

```jsx
// PATCH — only update the name, leave rest unchanged
async function patchUser(id, partialData) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partialData), // { name: "New Name" }
  });
  return response.json();
}
```

### DELETE Request

```jsx
// DELETE — remove user with id = 1
async function deleteUser(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'DELETE',
  });

  // DELETE usually returns 200 OK with empty body, or 204 No Content
  if (response.ok) {
    console.log('Deleted successfully');
  }
}
```

### Sending Auth Token (JWT)

```jsx
// Protected route — add token to Authorization header
async function getMyOrders() {
  const token = localStorage.getItem('token'); // get saved token

  const response = await fetch('http://localhost:5000/api/orders', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // "Bearer eyJhbGciOi..."
    },
  });

  return response.json();
}
```

---

## Method 2: Using Axios (Recommended for Real Projects)

### Install

```bash
npm install axios
```

### Basic Usage

```jsx
import axios from 'axios';

// GET
const res = await axios.get('https://jsonplaceholder.typicode.com/users');
console.log(res.data); // ← axios puts data in res.data automatically

// POST
const res2 = await axios.post('/api/users', { name: 'Aman', age: 20 });
console.log(res2.data);

// PUT
const res3 = await axios.put(`/api/users/${id}`, updatedData);

// DELETE
await axios.delete(`/api/users/${id}`);
```

> ✅ Key difference from `fetch`: Axios automatically parses JSON — no need to call `.json()`.
> ✅ Axios throws an error on 4xx/5xx responses (fetch does NOT).

### Create a Reusable Axios Instance

Create `src/utils/api.js` and configure it once:

```js
// src/utils/api.js

import axios from 'axios';

// Create a custom axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // reads from .env
  timeout: 10000, // cancel request if no response in 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR
// Runs before every request — adds auth token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // must return config
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
// Runs after every response — handle global errors
api.interceptors.response.use(
  (response) => response, // pass through success responses
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login'; // redirect to login
    }

    if (status === 403) {
      alert('You are not authorized to do this!');
    }

    if (status === 500) {
      alert('Server error, please try again later.');
    }

    return Promise.reject(error); // still reject so .catch() in component works
  }
);

export default api;
```

```jsx
// Using the api instance anywhere in your project
import api from '../utils/api';

// All requests automatically get the base URL + token
const users = await api.get('/users');         // → GET /api/users
const user  = await api.post('/users', data);  // → POST /api/users
await api.delete(`/users/${id}`);             // → DELETE /api/users/5

// With query params
const res = await api.get('/products', {
  params: { category: 'shoes', page: 1, limit: 10 },
  // Makes: /api/products?category=shoes&page=1&limit=10
});
```

---

## Fetching Data in a Component (useEffect + useState Pattern)

This is the core pattern you use 90% of the time:

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  // 1. State for: data, loading, error
  const [users, setUsers]     = useState([]);  // will hold array of users
  const [loading, setLoading] = useState(true); // show spinner while waiting
  const [error, setError]     = useState(null); // show message if failed

  // 2. Fetch data when component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data); // save data into state → triggers re-render
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // always stop the spinner
      }
    }

    fetchUsers();
  }, []); // [] = only run once when component first appears

  // 3. Handle different states
  if (loading) return <p>Loading users...</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

  // 4. Render the data
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <strong>{user.name}</strong> — {user.email}
        </li>
      ))}
    </ul>
  );
}

export default UserList;
```

---

## Fetching a Single Item (Dynamic ID from Route)

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // get :id from URL

function UserDetail() {
  const { id } = useParams(); // e.g. /users/3 → id = "3"
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]); // re-fetches whenever id changes (e.g. user navigates from /users/3 to /users/7)

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;
  if (!user)   return <p>No user found</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
    </div>
  );
}

export default UserDetail;
```

---

## Making API Calls on User Action (Button Click / Form Submit)

Not all API calls happen on mount. POST/PUT/DELETE usually happen on user action:

```jsx
import { useState } from 'react';
import api from '../utils/api';

function CreateProductForm() {
  const [name, setName]         = useState('');
  const [price, setPrice]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault(); // prevent page refresh

    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/products', { name, price: Number(price) });
      console.log('Created:', res.data);
      setMessage('Product created successfully!');
      setName('');   // reset form
      setPrice('');
    } catch (err) {
      setMessage('Failed to create product: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        required
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default CreateProductForm;
```

---

## Custom `useFetch` Hook — Reusable Data Fetching

Instead of copying the fetch + state + useEffect pattern everywhere, extract it:

```js
// src/hooks/useFetch.js

import { useState, useEffect } from 'react';

// Generic hook: pass any URL, get back data/loading/error
function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!url) return; // don't fetch if no URL given

    const controller = new AbortController(); // for cancellation
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') { // ignore cancellation errors
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    // Cleanup: cancel fetch if component unmounts or URL changes
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
```

```jsx
// Using useFetch in any component — very clean!
import useFetch from '../hooks/useFetch';

function Posts() {
  const { data: posts, loading, error } = useFetch(
    'https://jsonplaceholder.typicode.com/posts'
  );

  if (loading) return <p>Loading posts...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

## Understanding the Data Flow

```
1. Component renders
        ↓
2. useEffect runs (after first render)
        ↓
3. fetch() / axios.get() sends HTTP request
        ↓
4. Server processes request, sends back JSON
        ↓
5. .json() / res.data parses the response
        ↓
6. setData(parsedData) updates state
        ↓
7. React re-renders component with new data
        ↓
8. UI shows the fetched data
```

---

## Accessing Nested Data from API Response

APIs often return nested objects. Here's how to handle them:

```jsx
// API response might look like:
// {
//   "user": {
//     "id": 1,
//     "name": "Aman",
//     "address": {
//       "city": "Delhi",
//       "zip": "110001"
//     },
//     "orders": [
//       { "id": 101, "item": "Shoes", "price": 2500 }
//     ]
//   }
// }

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((json) => setUser(json.user)); // access the "user" key
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      {/* Optional chaining (?.) prevents crash if nested value is undefined */}
      <p>City: {user.address?.city}</p>

      {/* Render array of orders */}
      <h3>Orders</h3>
      <ul>
        {user.orders?.map((order) => (
          <li key={order.id}>
            {order.item} — ₹{order.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Dependent Requests (Fetch B after A)

Sometimes you need data from one request to make the next:

```jsx
function UserPostsAndComments({ userId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Step 1: get user's posts
        const postsRes = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        const posts = await postsRes.json();

        // Step 2: use first post's id to get comments
        const firstPostId = posts[0]?.id;
        if (!firstPostId) return;

        const commentsRes = await fetch(
          `https://jsonplaceholder.typicode.com/comments?postId=${firstPostId}`
        );
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  return <ul>{comments.map((c) => <li key={c.id}>{c.body}</li>)}</ul>;
}
```

---

## Parallel Requests (Fetch Multiple at Same Time)

Use `Promise.all` to run multiple requests simultaneously — much faster than sequential:

```jsx
useEffect(() => {
  async function loadAll() {
    try {
      // Both requests fire at the same time
      const [usersRes, productsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/products'),
      ]);

      const [users, products] = await Promise.all([
        usersRes.json(),
        productsRes.json(),
      ]);

      setUsers(users);
      setProducts(products);
    } catch (err) {
      console.error('One of the requests failed:', err);
    }
  }

  loadAll();
}, []);
```

---

## Full CRUD Example — Products Page

```jsx
// src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react';
import api from '../utils/api';

function ProductsPage() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [newName, setNewName]     = useState('');

  // READ — fetch all products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // CREATE — add new product
  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await api.post('/products', { name: newName });
      setProducts((prev) => [...prev, res.data]); // add to existing list
      setNewName('');
    } catch (err) {
      alert('Create failed');
    }
  }

  // UPDATE — edit product name
  async function handleUpdate(id) {
    const updatedName = prompt('New name?');
    if (!updatedName) return;

    try {
      const res = await api.put(`/products/${id}`, { name: updatedName });
      // Replace old item with updated item in state
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
    } catch (err) {
      alert('Update failed');
    }
  }

  // DELETE — remove product
  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      // Remove deleted item from state
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  }

  if (loading) return <p>Loading products...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Products</h1>

      {/* Create form */}
      <form onSubmit={handleCreate}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New product name"
          required
        />
        <button type="submit">Add</button>
      </form>

      {/* Product list */}
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name}
            <button onClick={() => handleUpdate(product._id)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsPage;
```

---

## Common Errors and Fixes

| Error | Cause | Fix |
|---|---|---|
| `CORS error` | Server not allowing your domain | Add CORS middleware on backend (`npm install cors`) |
| `401 Unauthorized` | Token missing or expired | Send token in `Authorization` header, or re-login |
| `404 Not Found` | Wrong URL | Check base URL and endpoint spelling |
| `Cannot read property of undefined` | Data not yet loaded | Use optional chaining `?.` or check `if (!data)` |
| `Infinite loop` | Object/array in `useEffect` deps | Use primitives in dependency array, or `useMemo` |
| `Warning: Can't perform state update on unmounted component` | Fetch completes after unmount | Use `AbortController` or `isMounted` flag |
| `VITE_API_URL is undefined` | Didn't restart dev server after `.env` change | `Ctrl+C` then `npm run dev` again |

---

## Quick Reference

```jsx
// --- fetch() quick patterns ---

// GET
const res = await fetch('/api/items');
const data = await res.json();

// POST
const res = await fetch('/api/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'test' }),
});

// With token
const res = await fetch('/api/me', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// --- axios quick patterns (after creating api instance) ---
const { data } = await api.get('/items');            // data is already parsed
const { data: created } = await api.post('/items', { name: 'test' });
await api.put(`/items/${id}`, { name: 'updated' });
await api.delete(`/items/${id}`);
```

---

## Summary

| Concept | How |
|---|---|
| Fetch on mount | `useEffect(() => { fetchData() }, [])` |
| Fetch when something changes | `useEffect(() => { fetchData() }, [id])` |
| Fetch on button click | Call async function inside event handler |
| Show loading state | `const [loading, setLoading] = useState(true)` |
| Show error state | `const [error, setError] = useState(null)` |
| Access nested data | `data?.address?.city` (optional chaining) |
| Reuse fetch logic | Create `useFetch` custom hook |
| Avoid repeating base URL + token | Create axios instance in `utils/api.js` |
| Multiple requests at once | `Promise.all([fetch1, fetch2])` |

---

> **Previous:** [24 — Best Practices ←](./24_best_practices.md)

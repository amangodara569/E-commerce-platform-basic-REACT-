# 17 — API Integration

> **References:**
> - [Fetch API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
> - [Axios Docs](https://axios-http.com/docs/intro)
> - [TanStack Query (React Query)](https://tanstack.com/query/latest)

---

## Fetching Data in React

You have three main options for making API calls:
1. **Native `fetch()`** — built into browsers, no installation needed
2. **Axios** — popular library with better error handling and interceptors
3. **TanStack Query (React Query)** — full data fetching + caching solution

---

## Option 1: Native Fetch API

```jsx
// Basic fetch in useEffect
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Fetch with Different HTTP Methods

```jsx
// GET
const res = await fetch('/api/users');
const data = await res.json();

// POST
const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Aman', email: 'aman@email.com' }),
});

// PUT
const res = await fetch(`/api/users/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedData),
});

// DELETE
const res = await fetch(`/api/users/${id}`, {
  method: 'DELETE',
});

// With Authorization header
const res = await fetch('/api/protected', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});
```

---

## Option 2: Axios

```bash
npm install axios
```

### Basic Axios Usage

```jsx
import axios from 'axios';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(res => setUser(res.data))    // res.data is already parsed JSON
      .catch(err => console.error(err)); // Catches both network & HTTP errors
  }, [userId]);
}
```

### Axios Instance (Best Practice)

Create an axios instance with default configuration:

```jsx
// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response.data,  // Unwrap data automatically
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      alert('You do not have permission to do this');
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
```

```jsx
// Using the API instance
import api from '../utils/api';

// Simple and clean!
const users = await api.get('/users');            // Returns response.data
const user = await api.post('/users', userData);  // POST with data
const updated = await api.put(`/users/${id}`, updatedData);
await api.delete(`/users/${id}`);

// With query params
const filtered = await api.get('/users', {
  params: { role: 'admin', page: 1, limit: 10 }
});
// Makes request to: /users?role=admin&page=1&limit=10
```

---

## Option 3: TanStack Query (React Query) — Recommended

The most powerful solution for server state management:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### Setup

```jsx
// main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // Data considered fresh for 5 minutes
      retry: 2,                    // Retry failed requests twice
      refetchOnWindowFocus: true,  // Refetch when window regains focus
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools />  {/* Dev tools panel */}
  </QueryClientProvider>
);
```

### useQuery — Fetching Data

```jsx
import { useQuery } from '@tanstack/react-query';

// Define fetch function (no useEffect needed!)
async function fetchUsers() {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

function UserList() {
  const {
    data: users,        // The fetched data
    isLoading,          // True on first load
    isFetching,         // True when refetching (has old data)
    isError,            // True if there's an error
    error,              // The error object
    refetch,            // Function to manually refetch
  } = useQuery({
    queryKey: ['users'],            // Unique cache key
    queryFn: fetchUsers,            // The fetch function
    staleTime: 5 * 60 * 1000,      // Override global default
  });

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      {isFetching && <p>Updating...</p>}
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Dynamic Query Keys

```jsx
function UserProfile({ userId }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['users', userId],    // Re-fetches when userId changes!
    queryFn: () => fetchUser(userId),
    enabled: !!userId,              // Don't fetch if userId is null
  });

  if (isLoading) return <Spinner />;
  return <div>{user?.name}</div>;
}

// Filter/search with dynamic keys
function SearchResults({ query, category }) {
  const { data } = useQuery({
    queryKey: ['search', { query, category }],  // Unique per search
    queryFn: () => searchAPI(query, category),
    enabled: query.length > 2,  // Only search when query > 2 chars
  });
}
```

### useMutation — Creating/Updating Data

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUserForm() {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (newUser) => api.post('/users', newUser),
    
    // Optimistic update — update UI before server responds
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], old => [...old, { ...newUser, id: 'temp' }]);
      return { previousUsers };
    },

    // On success — invalidate cache to refetch fresh data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },

    // On error — rollback optimistic update
    onError: (error, variables, context) => {
      queryClient.setQueryData(['users'], context.previousUsers);
      console.error('Failed to create user:', error);
    },
  });

  function handleSubmit(userData) {
    createUserMutation.mutate(userData);
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      handleSubmit({ name: 'New User', email: 'new@email.com' });
    }}>
      <button
        type="submit"
        disabled={createUserMutation.isPending}
      >
        {createUserMutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      {createUserMutation.isError && <p>Error creating user!</p>}
      {createUserMutation.isSuccess && <p>User created!</p>}
    </form>
  );
}
```

### Infinite Queries (Load More)

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';

function PostFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  // data.pages is an array of page results
  const posts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## Environment Variables

```bash
# .env
VITE_API_URL=https://api.myapp.com
VITE_GOOGLE_MAPS_KEY=AIzaSyB...
```

```jsx
// Usage in code — must start with VITE_
const apiUrl = import.meta.env.VITE_API_URL;
const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

// .env.development — used in development
VITE_API_URL=http://localhost:5000

// .env.production — used in production build
VITE_API_URL=https://api.myapp.com
```

---

## Custom useFetch Hook

```jsx
// hooks/useFetch.js
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(url, { ...options, signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();  // Cancel request on cleanup
  }, [url]);

  return { data, loading, error };
}

// Usage
function Users() {
  const { data, loading, error } = useFetch('https://api.example.com/users');
  // ...
}
```

---

## Summary

| Solution | Best For | Setup |
|---|---|---|
| `fetch()` | Simple projects | None (built-in) |
| Axios | Any project, interceptors | `npm install axios` |
| TanStack Query | Complex data fetching, caching, real-time | `npm install @tanstack/react-query` |

**Recommended stack:** Axios (for requests) + TanStack Query (for caching & state)

---

> **Previous:** [16 — Error Handling ←](./16_error_handling.md)
> **Next:** [18 — Advanced Patterns →](./18_advanced_patterns.md)

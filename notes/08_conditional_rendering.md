# 08 — Conditional Rendering

> **References:**
> - [Conditional Rendering — React Docs](https://react.dev/learn/conditional-rendering)

---

## What is Conditional Rendering?

**Conditional rendering** means showing or hiding parts of the UI based on some condition — just like `if` statements in regular JavaScript.

---

## Method 1: if/else Statement

The most straightforward approach. Move logic outside the JSX return:

```jsx
function UserGreeting({ isLoggedIn, username }) {
  if (isLoggedIn) {
    return (
      <div>
        <h1>Welcome back, {username}!</h1>
        <button>Log Out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Please sign in</h1>
      <button>Log In</button>
    </div>
  );
}

// Usage
<UserGreeting isLoggedIn={true} username="Aman" />
<UserGreeting isLoggedIn={false} />
```

---

## Method 2: Ternary Operator `condition ? a : b`

Best for choosing between **two different** JSX outputs inline:

```jsx
function Badge({ isPremium }) {
  return (
    <div className="profile">
      <h2>User Profile</h2>
      {/* Ternary inside JSX */}
      {isPremium
        ? <span className="badge premium">⭐ Premium</span>
        : <span className="badge free">Free Plan</span>
      }
    </div>
  );
}
```

```jsx
// Can also render entirely different components
function Dashboard({ user }) {
  return (
    <main>
      {user.isAdmin
        ? <AdminPanel user={user} />
        : <UserPanel user={user} />
      }
    </main>
  );
}
```

---

## Method 3: Logical AND `&&` (Short Circuit)

Best for **optionally** showing something (or nothing):

```jsx
function Notification({ message, count }) {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Only renders if count > 0 */}
      {count > 0 && (
        <div className="notification">
          You have {count} new messages!
        </div>
      )}

      {/* Only renders if message exists */}
      {message && <p className="alert">{message}</p>}
    </div>
  );
}
```

### ⚠️ `&&` Pitfall with Numbers

```jsx
// ❌ BUG — renders "0" on screen when count is 0!
{count && <p>Items: {count}</p>}
// When count = 0, JavaScript evaluates: 0 && <p> = 0
// React renders 0 (a number) on the screen!

// ✅ Fix — convert to boolean
{count > 0 && <p>Items: {count}</p>}
{!!count && <p>Items: {count}</p>}
{Boolean(count) && <p>Items: {count}</p>}
```

---

## Method 4: Nullish Coalescing `??`

Show something only if the value is `null` or `undefined`:

```jsx
function UserCard({ nickname }) {
  return (
    <div>
      {/* Show nickname, or "Anonymous" if null/undefined */}
      <p>{nickname ?? 'Anonymous'}</p>
    </div>
  );
}
```

---

## Method 5: Return null (Render Nothing)

Return `null` to render absolutely nothing:

```jsx
function ErrorAlert({ error }) {
  // Render nothing if no error
  if (!error) return null;

  return (
    <div className="error-alert">
      ❌ {error.message}
    </div>
  );
}

// Usage — renders nothing if error is null
<ErrorAlert error={null} />
<ErrorAlert error={{ message: 'Network failed' }} />
```

---

## Conditional className

```jsx
function Button({ variant, disabled }) {
  // Method 1: Template literal
  const className = `btn btn-${variant} ${disabled ? 'btn-disabled' : ''}`.trim();

  // Method 2: Array join (cleaner for many conditions)
  const classes = [
    'btn',
    variant && `btn-${variant}`,
    disabled && 'btn-disabled',
    'btn-rounded',
  ].filter(Boolean).join(' ');

  return <button className={classes} disabled={disabled}>Click</button>;
}

// Usage
<Button variant="primary" disabled={false} />
<Button variant="danger" disabled={true} />
```

---

## Real-World Examples

### Loading States

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  // Multiple conditional returns
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <p>User not found</p>;

  // Main content
  return (
    <div className="profile">
      <img src={user.avatar} alt={user.name} />
      <h1>{user.name}</h1>
      {user.bio && <p className="bio">{user.bio}</p>}
      {user.isVerified && <span>✅ Verified</span>}
      {user.isPremium ? (
        <PremiumFeatures user={user} />
      ) : (
        <UpgradePrompt />
      )}
    </div>
  );
}
```

### Permission-Based Rendering

```jsx
function Settings({ currentUser }) {
  return (
    <div className="settings">
      <h1>Settings</h1>

      {/* Basic settings for everyone */}
      <GeneralSettings />

      {/* Only for admins */}
      {currentUser.role === 'admin' && (
        <AdminSettings />
      )}

      {/* Only for premium users */}
      {currentUser.isPremium ? (
        <PremiumSettings />
      ) : (
        <div className="upgrade-prompt">
          <p>Upgrade to Premium for advanced settings</p>
          <button>Upgrade Now</button>
        </div>
      )}

      {/* Only if email is verified */}
      {currentUser.emailVerified && (
        <EmailPreferences />
      )}
    </div>
  );
}
```

### Tab System

```jsx
function Tabs() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div>
      <nav className="tabs">
        {['profile', 'posts', 'followers'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <div className="tab-content">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'posts' && <PostsTab />}
        {activeTab === 'followers' && <FollowersTab />}
      </div>
    </div>
  );
}
```

### Feature Flags

```jsx
// Feature flags — toggle features during development
const FEATURES = {
  newDashboard: true,
  betaChat: false,
  darkMode: true,
};

function App() {
  return (
    <div>
      {FEATURES.newDashboard ? <NewDashboard /> : <OldDashboard />}
      {FEATURES.betaChat && <BetaChatWidget />}
    </div>
  );
}
```

---

## Choosing the Right Method

| Scenario | Best Method |
|---|---|
| Show A or B | Ternary `? :` |
| Show or hide one thing | AND `&&` |
| Complex conditions | `if/else` before return |
| Completely hide component | Return `null` |
| Fallback value | Nullish `??` |
| Dynamic CSS classes | Template literal or array join |

---

## Summary

```jsx
// Quick reference
const el = (
  <div>
    {/* if/else → use ternary */}
    {condition ? <A /> : <B />}

    {/* show or nothing */}
    {condition && <A />}

    {/* null safe fallback */}
    {value ?? 'Default'}

    {/* dynamic class */}
    <div className={`base ${isActive ? 'active' : ''}`}>
  </div>
)
```

---

> **Previous:** [07 — Event Handling ←](./07_events.md)
> **Next:** [09 — Lists & Keys →](./09_lists_and_keys.md)

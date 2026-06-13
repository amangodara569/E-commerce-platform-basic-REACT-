# 01 — Setup & Tooling

> **References:**
> - [Vite Official Docs](https://vitejs.dev/guide/)
> - [Create React App Docs](https://create-react-app.dev/)
> - [Node.js Download](https://nodejs.org/)
> - [VS Code React Extensions](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

---

## Prerequisites

Before starting React, you need:
- **Node.js** (v18+ recommended) — [Download here](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- A code editor — **VS Code** is highly recommended

```bash
# Verify installations
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

---

## Method 1: Vite (Recommended ✅)

**Vite** is the modern, lightning-fast way to create React apps. It's significantly faster than Create React App.

```bash
# Create a new React project with Vite
npm create vite@latest my-app -- --template react

# Navigate to project folder
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Your app will be running at `http://localhost:5173` ⚡

### Why Vite over CRA?
| Feature | Vite | Create React App |
|---|---|---|
| Start Time | < 1 second | 10-30 seconds |
| Hot Reload | Instant | Slow |
| Bundle Size | Smaller | Larger |
| Configuration | Minimal | Hidden (ejectable) |
| Status | Actively maintained | Deprecated |

---

## Method 2: Create React App (Legacy)

```bash
# Create a new CRA project
npx create-react-app my-app

# Navigate and start
cd my-app
npm start
```

> ⚠️ **Note:** CRA is no longer actively maintained. Use Vite for new projects.

---

## Project Structure (Vite)

After running `npm create vite@latest`, you get:

```
my-app/
│
├── public/               ← Static assets (favicon, images)
│   └── vite.svg
│
├── src/                  ← Your source code lives here
│   ├── assets/           ← Images, fonts, etc.
│   ├── App.css           ← Styles for App component
│   ├── App.jsx           ← Root component
│   ├── index.css         ← Global styles
│   └── main.jsx          ← Entry point (mounts React to DOM)
│
├── index.html            ← HTML template
├── package.json          ← Project metadata & dependencies
├── vite.config.js        ← Vite configuration
└── node_modules/         ← Installed packages (don't touch!)
```

---

## Understanding Key Files

### `index.html` — The HTML Shell
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My React App</title>
  </head>
  <body>
    <!-- React mounts INTO this div -->
    <div id="root"></div>
    
    <!-- Vite injects the JS bundle here -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `src/main.jsx` — Entry Point
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// This mounts your entire React app into the #root div
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**What is `React.StrictMode`?**
- A development-only tool that highlights potential problems
- It renders components twice in development to detect side effects
- Has zero impact on production

### `src/App.jsx` — Root Component
```jsx
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Hello React!</h1>
    </div>
  )
}

export default App
```

---

## npm Scripts Explained

```json
// package.json
{
  "scripts": {
    "dev": "vite",          // Start development server (hot reload)
    "build": "vite build",  // Build for production (optimized)
    "preview": "vite preview", // Preview production build locally
    "lint": "eslint ."      // Check code for errors
  }
}
```

| Command | What It Does |
|---|---|
| `npm run dev` | Starts local dev server with hot reload |
| `npm run build` | Creates optimized production files in `/dist` |
| `npm run preview` | Preview the production build |

---

## Recommended VS Code Extensions

Install these for the best React development experience:

```
1. ES7+ React/Redux/React-Native Snippets
   → Shortcut snippets (type "rafce" to create a component)

2. Prettier - Code Formatter
   → Auto-formats your code on save

3. ESLint
   → Highlights code errors/warnings

4. Auto Import - ES6, TS, JSX, TSX
   → Auto-suggests imports

5. GitLens
   → Better Git integration
```

### Useful Snippets (ES7 Extension)

| Shortcut | Expands to |
|---|---|
| `rafce` | React Arrow Function Component Export |
| `rfce` | React Function Component Export |
| `rce` | React Class Export |
| `useState` | `const [state, setState] = useState()` |
| `useEffect` | Full useEffect template |

---

## Installing React Dependencies

```bash
# Install a package
npm install package-name

# Install as dev dependency
npm install package-name --save-dev

# Common React packages you'll use:
npm install react-router-dom      # Routing
npm install axios                  # HTTP requests
npm install zustand                # State management
npm install @tanstack/react-query  # Data fetching
```

---

## Setting Up with TypeScript (Vite + TS)

```bash
# Create React + TypeScript project
npm create vite@latest my-app -- --template react-ts

# Files will be .tsx instead of .jsx
```

---

## Vite Config (Optional Customization)

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,           // Change dev server port
    open: true,           // Auto-open browser
  },
  resolve: {
    alias: {
      '@': '/src',        // Use @ to import from /src
    }
  }
})
```

---

## Summary

- Use **Vite** to create new React projects (`npm create vite@latest`)
- The entry point is `main.jsx`, which mounts `App.jsx` into `index.html`
- Use `npm run dev` to start development
- Install VS Code extensions for a better experience
- File extensions: `.jsx` for React files (or `.tsx` with TypeScript)

---

> **Previous:** [00 — Introduction ←](./00_introduction.md)
> **Next:** [02 — JSX →](./02_jsx.md)

# 21 — Next.js Basics

> **References:**
> - [Next.js Official Docs](https://nextjs.org/docs)
> - [Next.js App Router](https://nextjs.org/docs/app)
> - [Next.js Learn Course](https://nextjs.org/learn)

---

## What is Next.js?

**Next.js** is a **React framework** that adds production-grade features on top of React:

| Feature | React | Next.js |
|---|---|---|
| Routing | Library needed (React Router) | Built-in (file-based) |
| SEO | Poor (client-rendered) | Excellent (SSR/SSG) |
| Performance | Good | Excellent (automatic optimizations) |
| API Routes | No | Yes (full-stack) |
| Image Optimization | No | Yes (next/image) |
| Deployment | Any host | Optimized for Vercel |

---

## Getting Started

```bash
# Create Next.js app (App Router — modern way)
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm run dev
```

---

## App Router vs Pages Router

Next.js 13+ introduced the **App Router** (recommended).

```
Pages Router (old):
pages/
├── index.js        → /
├── about.js        → /about
└── blog/
    └── [slug].js   → /blog/:slug

App Router (new):
app/
├── page.tsx        → /
├── layout.tsx      → Shared layout for all pages
├── about/
│   └── page.tsx    → /about
└── blog/
    └── [slug]/
        └── page.tsx → /blog/:slug
```

---

## App Router File Conventions

```
app/
├── layout.tsx       → Root layout (shared UI, wraps all pages)
├── page.tsx         → Page component (the actual route)
├── loading.tsx      → Loading UI (shown while page loads)
├── error.tsx        → Error UI (shown when error occurs)
├── not-found.tsx    → 404 UI
├── template.tsx     → Like layout but re-renders on navigation
└── route.ts         → API endpoint (REST API)
```

---

## Creating Pages

```tsx
// app/page.tsx — Home page at "/"
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
      <p>This is the home page</p>
    </main>
  );
}

// app/about/page.tsx — About page at "/about"
export default function AboutPage() {
  return <h1>About Us</h1>;
}

// app/blog/[slug]/page.tsx — Dynamic route at "/blog/:slug"
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}

// app/shop/[...categories]/page.tsx — Catch-all route
export default function ShopPage({ params }: { params: { categories: string[] } }) {
  return <p>Categories: {params.categories.join(' > ')}</p>;
}
```

---

## Layouts

Layouts wrap pages with shared UI (navbar, footer, etc.):

```tsx
// app/layout.tsx — Root layout (required)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// SEO metadata
export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Built with Next.js and React',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

```tsx
// app/dashboard/layout.tsx — Dashboard nested layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}
// All /dashboard/* routes get this sidebar automatically!
```

---

## Rendering Strategies

### Server Components (Default in App Router)

Components render on the **server** by default. No JavaScript sent to client!

```tsx
// app/products/page.tsx — Server Component (default)
// Can directly use async/await for data fetching!
async function ProductsPage() {
  // This runs on the SERVER — no useEffect needed!
  const res = await fetch('https://api.example.com/products');
  const products = await res.json();

  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductsPage;
```

### Client Components

Add `'use client'` directive for components that need:
- State (`useState`, `useReducer`)
- Effects (`useEffect`)
- Browser APIs
- Event handlers

```tsx
'use client'  // ← This makes it a Client Component

import { useState } from 'react';

function InteractiveCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}

export default InteractiveCounter;
```

### When to Use Each

```
Server Component (default) → Use when:
  ✅ Fetching data from database/API
  ✅ Accessing backend resources directly
  ✅ Keeping sensitive data on server
  ✅ Large dependencies you don't want to ship to client
  ✅ No interactivity needed

Client Component ('use client') → Use when:
  ✅ Need useState, useReducer, useEffect
  ✅ Need browser APIs (localStorage, geolocation)
  ✅ Need event listeners (onClick, onChange)
  ✅ Using third-party libraries that need DOM
```

---

## Data Fetching in Next.js

### Server-Side Rendering (SSR) — Dynamic

```tsx
// Every request fetches fresh data (SSR)
async function Page() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store',  // Don't cache — always fresh
  });
  const data = await res.json();
  return <div>{data.message}</div>;
}
```

### Static Site Generation (SSG) — Cached

```tsx
// Data is fetched once at build time (SSG)
async function Page() {
  const res = await fetch('https://api.example.com/data');
  // Default behavior: cached indefinitely
  const data = await res.json();
  return <div>{data.message}</div>;
}
```

### Incremental Static Regeneration (ISR)

```tsx
// Cached, but revalidated every N seconds
async function Page() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 },  // Revalidate every 1 hour
  });
  const data = await res.json();
  return <div>{data.message}</div>;
}
```

---

## Navigation

```tsx
'use client'
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav>
      {/* Client-side navigation */}
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      
      {/* Active link styling */}
      <Link
        href="/dashboard"
        className={pathname === '/dashboard' ? 'active' : ''}
      >
        Dashboard
      </Link>

      {/* Programmatic navigation */}
      <button onClick={() => router.push('/login')}>Login</button>
      <button onClick={() => router.replace('/home')}>Replace</button>
      <button onClick={() => router.back()}>Go Back</button>
    </nav>
  );
}
```

---

## API Routes

Create backend API endpoints within Next.js:

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET() {
  const users = await db.users.findMany();
  return NextResponse.json(users);
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await db.users.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}
```

```tsx
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await db.users.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.users.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
```

---

## Metadata & SEO

```tsx
// Static metadata
export const metadata = {
  title: 'My App',
  description: 'Description of my app',
  keywords: ['react', 'nextjs', 'web'],
  openGraph: {
    title: 'My App',
    description: 'Description',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// Dynamic metadata (per page)
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```

---

## Image Optimization

```tsx
import Image from 'next/image';

function ProductCard({ product }) {
  return (
    <div>
      {/* next/image automatically: */}
      {/* - Resizes and optimizes images */}
      {/* - Lazy loads by default */}
      {/* - Prevents layout shift with width/height */}
      {/* - Serves modern formats (WebP, AVIF) */}
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        priority={false}     // true for above-the-fold images
        placeholder="blur"   // Show blur while loading
      />
    </div>
  );
}
```

---

## Middleware

Run code before every request (auth, redirects, logging):

```ts
// middleware.ts (at project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');
  return response;
}

// Which paths to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

---

## Environment Variables

```bash
# .env.local (never commit to git)
DATABASE_URL="postgresql://..."
JWT_SECRET="mysecret123"
NEXT_PUBLIC_API_URL="https://api.myapp.com"
#  ^^^^^^^^^^ Prefix with NEXT_PUBLIC_ to expose to browser
```

```tsx
// Server-side only (not exposed to browser)
const dbUrl = process.env.DATABASE_URL;

// Client-side accessible (must be NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## Summary

| Concept | Next.js Feature |
|---|---|
| File-based routing | `app/about/page.tsx` → `/about` |
| Shared UI | `layout.tsx` |
| Loading UI | `loading.tsx` |
| Error UI | `error.tsx` |
| Server Component | Default — runs on server, no JS bundle |
| Client Component | `'use client'` — runs on browser |
| SSR | `cache: 'no-store'` |
| SSG | Default fetch caching |
| ISR | `next: { revalidate: N }` |
| API Routes | `app/api/*/route.ts` |
| SEO | `export const metadata = {...}` |
| Images | `import Image from 'next/image'` |
| Navigation | `import Link from 'next/link'` |

---

> **Previous:** [20 — Testing ←](./20_testing.md)
> **Next:** [22 — Animations →](./22_animations.md)

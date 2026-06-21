# 02 — Designing Cards & Components

> **References:**
> - [Dribbble](https://dribbble.com/) — design inspiration
> - [Shadcn/ui](https://ui.shadcn.com/) — beautiful component examples
> - [Framer Motion](https://www.framer.com/motion/) | [MUI](https://mui.com/) | [Chakra UI](https://chakra-ui.com/)

---

## The Golden Approach to Any Component

Before writing a single line of CSS, ask yourself:

```
1. What is its PURPOSE?      → Profile card? Product card? Notification?
2. What CONTENT goes in it?  → Image, title, text, button, badge?
3. What STATES does it have? → Default, hover, active, loading, disabled?
4. How does it RESPOND?      → Mobile vs desktop layout?
```

This prevents random CSS — every property you write has a reason.

---

## The 5 Pillars of Every Great Component

Every polished component — no matter what it is — shares these five traits:

### 1. Consistent Spacing
Internal padding creates breathing room. Use a spacing scale (multiples of 4 or 8).
```css
/* Good: rhythmic spacing */
.card { padding: 24px; gap: 16px; margin-bottom: 8px; }

/* Bad: random numbers */
.card { padding: 13px; gap: 7px; margin-bottom: 11px; }
```

### 2. Clear Visual Hierarchy
Make the most important thing the biggest/boldest. Guide the eye top to bottom.
```css
.card__title   { font-size: 1.25rem; font-weight: 700; color: #111; }
.card__subtitle{ font-size: 0.9rem;  font-weight: 400; color: #6b7280; }
.card__body    { font-size: 1rem;    font-weight: 400; color: #374151; }
```

### 3. Subtle Depth (Shadow + Border)
Shadows lift components off the page. Use light shadows for cards, stronger for modals.
```css
.card {
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04);
}
```

### 4. Smooth Interactivity
Every interactive component needs hover/focus/active states.
```css
.card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
```

### 5. Responsive by Default
Never hardcode a fixed width. Use `max-width` + `width: 100%`.
```css
.card { width: 100%; max-width: 380px; }
```

---

## Anatomy of a Card (Universal Structure)

Almost every card follows this pattern:

```
┌─────────────────────────────┐
│        IMAGE / MEDIA        │  ← Optional top media area
├─────────────────────────────┤
│  Badge / Tag (optional)     │
│  Title (biggest text)       │  ← Header block
│  Subtitle / Meta            │
├─────────────────────────────┤
│  Description / Body text    │  ← Content block
├─────────────────────────────┤
│  [Button]      [Icon] [Icon]│  ← Footer / Actions
└─────────────────────────────┘
```

---

## Basic Card — Start Here

```jsx
// BasicCard.jsx
function BasicCard({ image, tag, title, description, price }) {
  return (
    <div className="card">
      {image && <img src={image} alt={title} className="card__image" />}
      <div className="card__body">
        {tag && <span className="card__tag">{tag}</span>}
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
        <div className="card__footer">
          <span className="card__price">{price}</span>
          <button className="card__btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
```

```css
/* BasicCard.css */
.card {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden; /* clips image to card's border-radius */
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.14);
}

/* Image */
.card__image {
  width: 100%;
  height: 200px;
  object-fit: cover; /* crop without distorting */
  display: block;
}

/* Body */
.card__body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Tag / Badge */
.card__tag {
  display: inline-block;
  padding: 4px 10px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}

/* Title */
.card__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  /* clamp to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Description */
.card__description {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.card__price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
}

/* Button */
.card__btn {
  padding: 8px 18px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}
.card__btn:hover   { background: #4f46e5; }
.card__btn:active  { transform: scale(0.96); }
```

**With Tailwind:**
```jsx
<div className="w-full max-w-sm bg-white rounded-2xl border border-black/5 shadow-md overflow-hidden hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 cursor-pointer">
  <img src={image} className="w-full h-48 object-cover" />
  <div className="p-5 flex flex-col gap-2.5">
    <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full w-fit uppercase tracking-wide">{tag}</span>
    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{description}</p>
    <div className="flex justify-between items-center mt-1">
      <span className="text-lg font-bold">{price}</span>
      <button className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all">Add to Cart</button>
    </div>
  </div>
</div>
```

**With MUI:**
```jsx
import { Card, CardMedia, CardContent, Chip, Typography, Button } from '@mui/material';
<Card sx={{ maxWidth: 360, borderRadius: 3, '&:hover': { transform: 'translateY(-6px)', boxShadow: 8 }, transition: 'all 0.25s' }}>
  <CardMedia component="img" height="200" image={image} />
  <CardContent>
    <Chip label={tag} size="small" color="secondary" sx={{ mb: 1 }} />
    <Typography variant="h6" fontWeight={700}>{title}</Typography>
    <Typography variant="body2" color="text.secondary">{description}</Typography>
    <Button variant="contained" sx={{ mt: 2 }}>Add to Cart</Button>
  </CardContent>
</Card>
```

---

## Common Component Patterns

### Badge / Tag
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;    /* pill shape */
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
}
.badge--success { background: #d1fae5; color: #065f46; }
.badge--warning { background: #fef3c7; color: #92400e; }
.badge--danger  { background: #fee2e2; color: #991b1b; }
.badge--info    { background: #dbeafe; color: #1e40af; }
```

**With Tailwind:** `inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800`

### Avatar
```css
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #6366f1; /* colored ring */
}
/* Stacked avatars */
.avatar-group { display: flex; }
.avatar-group .avatar { margin-left: -10px; }
.avatar-group .avatar:first-child { margin-left: 0; }
```

### Button States (always define all 4)
```css
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn:hover    { filter: brightness(1.1); }
.btn:active   { transform: scale(0.97); }
.btn:focus    { outline: 2px solid #6366f1; outline-offset: 2px; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
```

### Skeleton Loader (while content loads)
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Use it */
.skeleton-title { height: 20px; width: 60%; margin-bottom: 8px; }
.skeleton-text  { height: 14px; width: 100%; margin-bottom: 6px; }
```

```jsx
// In React — conditional render
{loading ? <div className="skeleton skeleton-title" /> : <h3>{title}</h3>}
```

**With a Library — react-loading-skeleton:**
```jsx
// npm install react-loading-skeleton
import Skeleton from 'react-loading-skeleton';
{loading ? <Skeleton height={20} width="60%" /> : <h3>{title}</h3>}
```

### Tooltip
```css
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.tooltip-text {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.tooltip-wrapper:hover .tooltip-text { opacity: 1; }
```

**With a Library — Tippy.js:**
```jsx
// npm install @tippyjs/react
import Tippy from '@tippyjs/react';
<Tippy content="Tooltip text"><button>Hover me</button></Tippy>
```

### Modal / Dialog
```css
.overlay {
  position: fixed; inset: 0;   /* covers entire screen */
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.2s ease;
}
.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.3s ease;
}
@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
```

**With a Library — Radix UI:**
```jsx
// npm install @radix-ui/react-dialog
import * as Dialog from '@radix-ui/react-dialog';
<Dialog.Root><Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal><Dialog.Overlay className="overlay" />
    <Dialog.Content className="modal"><Dialog.Title>Title</Dialog.Title></Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Input Field
```css
.input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: white;
}
.input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}
.input:invalid { border-color: #ef4444; }
.input::placeholder { color: #9ca3af; }
```

---

## The Dark Card — Building a Dark Theme

```css
.card--dark {
  background: #1e1e2e;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  color: #e2e8f0;
}
.card--dark .card__title       { color: #f1f5f9; }
.card--dark .card__description { color: #94a3b8; }
.card--dark .card__tag {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}
```

---

## Glassmorphism Card

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);          /* the blur effect */
  -webkit-backdrop-filter: blur(12px);  /* Safari support */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3); /* inner highlight */
  color: white;
  padding: 28px;
}
/* Needs a colorful background behind it to look good */
.glass-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## ✨ Tutorial — Complex Aesthetic Card (Step by Step)

We'll build a **Profile Card** with: gradient header, avatar with ring, stats row, tags, and an animated follow button.

### Step 1 — HTML Structure
```jsx
function ProfileCard({ user }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="profile-card">
      <div className="profile-card__header">
        <img src={user.avatar} className="profile-card__avatar" alt={user.name} />
        <div className="profile-card__online-dot" />
      </div>
      <div className="profile-card__body">
        <h3 className="profile-card__name">{user.name}</h3>
        <p className="profile-card__role">{user.role}</p>
        <div className="profile-card__stats">
          <div className="stat"><span className="stat__num">{user.posts}</span><span className="stat__label">Posts</span></div>
          <div className="stat__divider" />
          <div className="stat"><span className="stat__num">{user.followers}</span><span className="stat__label">Followers</span></div>
          <div className="stat__divider" />
          <div className="stat"><span className="stat__num">{user.following}</span><span className="stat__label">Following</span></div>
        </div>
        <div className="profile-card__tags">
          {user.tags.map(tag => <span key={tag} className="profile-card__tag">#{tag}</span>)}
        </div>
        <button
          className={`profile-card__btn ${following ? 'profile-card__btn--following' : ''}`}
          onClick={() => setFollowing(f => !f)}
        >
          {following ? '✓ Following' : '+ Follow'}
        </button>
      </div>
    </div>
  );
}
```

### Step 2 — Base Card & Header
```css
.profile-card {
  width: 100%;
  max-width: 320px;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 4px 6px rgba(0,0,0,0.05),
    0 10px 40px rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-family: 'Inter', sans-serif;
}
.profile-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 8px 16px rgba(0,0,0,0.08),
    0 20px 60px rgba(99, 102, 241, 0.25);
}

/* Gradient header band */
.profile-card__header {
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;      /* anchor for avatar */
}
```

### Step 3 — Avatar with Ring & Online Dot
```css
.profile-card__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  /* Position: centered, half inside header, half in body */
  position: absolute;
  bottom: -40px;           /* half of 80px — hangs below header */
  left: 50%;
  transform: translateX(-50%);
}

/* Online indicator dot */
.profile-card__online-dot {
  width: 14px;
  height: 14px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid white;
  position: absolute;
  /* position relative to AVATAR */
  bottom: -40px + 8px;     /* near bottom-right of avatar */
  left: calc(50% + 22px);
  transform: translateY(-100%);
}
```

### Step 4 — Body Content
```css
.profile-card__body {
  padding: 52px 24px 28px;  /* top: 52px to clear avatar overlap */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.profile-card__name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.profile-card__role {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}
```

### Step 5 — Stats Row
```css
.profile-card__stats {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: center;
  padding: 16px 0;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat__num {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}

.stat__label {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat__divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
}
```

### Step 6 — Tags
```css
.profile-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.profile-card__tag {
  padding: 4px 10px;
  background: #ede9fe;
  color: #5b21b6;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  transition: background 0.2s ease;
}
.profile-card__tag:hover {
  background: #ddd6fe;
}
```

### Step 7 — Animated Follow Button
```css
.profile-card__btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* spring bounce */
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}
.profile-card__btn:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.55);
}
.profile-card__btn:active {
  transform: scale(0.97);
}

/* Following state — muted style */
.profile-card__btn--following {
  background: #f3f4f6;
  color: #374151;
  box-shadow: none;
}
.profile-card__btn--following:hover {
  background: #fee2e2;
  color: #b91c1c;
  box-shadow: none;
}
```

### Step 8 — Entry Animation
```css
/* Animate card in when it mounts */
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.profile-card {
  animation: cardEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
```

### With Framer Motion (much easier):
```jsx
import { motion } from 'framer-motion';
// npm install framer-motion

<motion.div
  className="profile-card"
  initial={{ opacity: 0, y: 24, scale: 0.97 }}
  animate={{ opacity: 1, y: 0,  scale: 1    }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  whileHover={{ y: -8 }}
>
  {/* card content */}
</motion.div>
```

---

## Checklist — Before Shipping Any Component

```
□ Does it have a hover state?
□ Does it have a focus state (keyboard accessible)?
□ Does it have an active/click state?
□ Does text truncate gracefully on small sizes?
□ Does the image use object-fit: cover?
□ Is the font-weight creating a clear hierarchy?
□ Does it look good on mobile (max-width: 100%)?
□ Are all transitions smooth (0.2s–0.3s ease)?
□ Is cursor: pointer set on clickable elements?
□ Is overflow: hidden set on the card wrapper?
```

---

> **Back:** [01 — CSS Fundamentals ←](./01_css_fundamentals.md)

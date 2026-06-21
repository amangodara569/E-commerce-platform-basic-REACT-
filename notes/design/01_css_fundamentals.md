# 01 — CSS Fundamentals for React

> **References:**
> - [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
> - [CSS Tricks](https://css-tricks.com/)
> - [Tailwind Docs](https://tailwindcss.com/docs) | [MUI Docs](https://mui.com/) | [Chakra UI Docs](https://chakra-ui.com/)

---

## How to Use CSS in React

### Method 1 — CSS Module (Recommended for components)
```jsx
// Card.module.css
.card { background: white; border-radius: 12px; }

// Card.jsx
import styles from './Card.module.css';
function Card() {
  return <div className={styles.card}>Hello</div>;
}
```

### Method 2 — Global CSS file
```jsx
// index.css  (imported once in main.jsx)
.card { background: white; }

// Any component
<div className="card">Hello</div>
```

### Method 3 — Inline styles (avoid for large styling)
```jsx
// Only for truly dynamic values
<div style={{ backgroundColor: color, padding: '16px' }}>Hello</div>
```

### With a Library — Tailwind CSS
```jsx
// Install: npm install -D tailwindcss
// Classes go directly in JSX — no separate CSS file needed
<div className="bg-white rounded-xl p-4 shadow-md">Hello</div>
```

### With a Library — MUI (Material UI)
```jsx
// npm install @mui/material @emotion/react @emotion/styled
import { Box } from '@mui/material';
<Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2 }}>Hello</Box>
```

---

## 1. Box Model — The Most Important Concept

Every HTML element is a box. The box model describes how space is calculated.

```
┌──────────────────────────────────┐
│            MARGIN                │  ← Space OUTSIDE the element
│  ┌────────────────────────────┐  │
│  │         BORDER             │  │  ← The visible edge
│  │  ┌──────────────────────┐  │  │
│  │  │       PADDING        │  │  │  ← Space INSIDE, between border & content
│  │  │  ┌────────────────┐  │  │  │
│  │  │  │    CONTENT     │  │  │  │  ← Your text / image / children
│  │  │  └────────────────┘  │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

```css
.box {
  /* Content size */
  width: 300px;
  height: 200px;

  /* Padding — breathing room INSIDE */
  padding: 16px;               /* all 4 sides */
  padding: 8px 16px;           /* top/bottom  left/right */
  padding: 8px 12px 16px 20px; /* top right bottom left (clockwise) */

  /* Border — the edge */
  border: 2px solid #333;      /* width style color */
  border-radius: 8px;          /* rounds the corners */

  /* Margin — space OUTSIDE */
  margin: 24px;
  margin: 0 auto;              /* classic trick: centers block element horizontally */
}
```

### `box-sizing: border-box` — ALWAYS set this
```css
/* Without border-box: width = content + padding + border (confusing!) */
/* With border-box:    width = total size you set (padding is INSIDE) */

*, *::before, *::after {
  box-sizing: border-box; /* Put this in your global CSS — always */
}
```

**With Tailwind:** `p-4` = padding 1rem | `m-4` = margin 1rem | `rounded-lg` = border-radius
**With MUI:** `<Box sx={{ p: 2, m: 3, borderRadius: 2 }}>`

---

## 2. Display — How Elements Sit on the Page

```css
.element {
  display: block;        /* Takes full width, stacks vertically (div, p, h1) */
  display: inline;       /* Sits in text flow, no width/height control (span, a) */
  display: inline-block; /* Sits in text flow BUT accepts width/height */
  display: none;         /* Completely hidden — removed from layout */
  display: flex;         /* Flexbox layout (most used) */
  display: grid;         /* Grid layout */
}
```

**With Tailwind:** `block`, `inline-block`, `hidden`, `flex`, `grid`
**With MUI:** `<Box sx={{ display: 'flex' }}>`

---

## 3. Flexbox — Your Go-To Layout Tool

Use flex to **align and distribute** items in a row or column.

```css
.container {
  display: flex;

  /* Direction */
  flex-direction: row;            /* → left to right (default) */
  flex-direction: column;         /* ↓ top to bottom */
  flex-direction: row-reverse;    /* ← right to left */

  /* Horizontal alignment (main axis) */
  justify-content: flex-start;    /* items at the start */
  justify-content: flex-end;      /* items at the end */
  justify-content: center;        /* items centered */
  justify-content: space-between; /* first & last at edges, rest evenly spaced */
  justify-content: space-around;  /* equal space around each item */
  justify-content: space-evenly;  /* perfectly equal gaps */

  /* Vertical alignment (cross axis) */
  align-items: stretch;           /* items stretch to fill height (default) */
  align-items: flex-start;        /* items at the top */
  align-items: flex-end;          /* items at the bottom */
  align-items: center;            /* items vertically centered */
  align-items: baseline;          /* items aligned by text baseline */

  /* Wrapping */
  flex-wrap: nowrap;   /* all in one line (default) */
  flex-wrap: wrap;     /* wraps to next line when no space */

  gap: 16px;           /* space BETWEEN items (modern, preferred over margin) */
  gap: 8px 16px;       /* row-gap  column-gap */
}

/* Flex children */
.item {
  flex: 1;             /* grow to fill available space equally */
  flex: 0 0 200px;     /* don't grow, don't shrink, stay at 200px */
  align-self: center;  /* override parent's align-items for THIS item */
  order: 2;            /* change visual order without changing HTML */
}
```

### Most Common Flex Pattern — Center Anything
```css
.center-everything {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**With Tailwind:** `flex flex-col items-center justify-between gap-4 flex-wrap`
**With MUI:** `<Stack direction="row" spacing={2} alignItems="center">`

---

## 4. Grid — For 2D Layouts

Use grid when you need **rows AND columns** (like a card grid, dashboard).

```css
.grid-container {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 200px 200px;  /* 3 fixed columns */
  grid-template-columns: 1fr 2fr 1fr;        /* fractional: middle is twice as wide */
  grid-template-columns: repeat(3, 1fr);     /* 3 equal columns shorthand */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* responsive grid! */

  /* Define rows */
  grid-template-rows: auto;   /* rows size to their content (default) */
  grid-template-rows: 100px auto 50px; /* header, content, footer */

  gap: 24px;           /* space between all grid cells */
  row-gap: 16px;       /* space between rows only */
  column-gap: 24px;    /* space between columns only */
}

/* Grid children */
.item {
  grid-column: span 2;         /* this item takes up 2 columns */
  grid-column: 1 / 3;          /* start at column line 1, end at line 3 */
  grid-row: span 2;            /* this item takes up 2 rows */
}
```

### Responsive Card Grid — Most Used Pattern
```css
.card-grid {
  display: grid;
  /* Auto-fill as many 280px columns as fit, stretch to fill remaining space */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

**With Tailwind:** `grid grid-cols-3 gap-6` | `grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]`
**With MUI:** `<Grid container spacing={3}> <Grid item xs={12} md={4}>`

---

## 5. Position — Placing Elements Precisely

```css
.element {
  position: static;    /* Default — element flows normally, top/left/etc. have NO effect */

  position: relative;  /* Moves element relative to its NORMAL position.
                          Also: makes it the anchor for absolute children */
  top: 10px;           /* Move 10px DOWN from where it would normally be */
  left: 20px;          /* Move 20px RIGHT */

  position: absolute;  /* Removed from normal flow. Positioned relative to the nearest
                          ancestor with position: relative (or the viewport if none) */
  top: 0;
  right: 0;            /* Stick to top-right corner of parent */

  position: fixed;     /* Like absolute, but relative to the VIEWPORT (screen).
                          Stays in place even when scrolling — used for navbars */
  top: 0;
  width: 100%;

  position: sticky;    /* Flows normally until it hits the scroll threshold,
                          then "sticks" — used for sticky headers */
  top: 0;
}

/* z-index — who appears on TOP when elements overlap */
.modal    { z-index: 1000; }  /* appears above everything */
.overlay  { z-index: 999;  }
.navbar   { z-index: 100;  }
.card     { z-index: 1;    }
/* z-index only works on positioned elements (not static) */
```

**With Tailwind:** `relative`, `absolute`, `fixed`, `sticky top-0`, `z-10`, `z-50`

---

## 6. Typography — Text Styling

```css
.text {
  /* Font */
  font-family: 'Inter', sans-serif;  /* font name, fallback */
  font-size: 16px;     /* size */
  font-size: 1rem;     /* 1rem = 16px (root font size) — preferred */
  font-size: 1.25rem;  /* 20px */
  font-weight: 400;    /* normal */
  font-weight: 600;    /* semi-bold */
  font-weight: 700;    /* bold */
  font-style: italic;

  /* Spacing */
  line-height: 1.5;    /* 1.5x the font size — good for readability */
  letter-spacing: 0.05em; /* space between letters */
  word-spacing: 4px;

  /* Alignment */
  text-align: left;
  text-align: center;
  text-align: right;
  text-align: justify;

  /* Decoration */
  text-decoration: none;        /* removes underline from links */
  text-decoration: underline;
  text-transform: uppercase;    /* ALL CAPS */
  text-transform: capitalize;   /* First Letter Caps */

  /* Overflow */
  white-space: nowrap;          /* prevent text wrapping */
  overflow: hidden;             /* hide overflowing text */
  text-overflow: ellipsis;      /* show ... when text overflows */
}

/* One-line text truncation */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Multi-line text truncation (clamp to 3 lines) */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Google Fonts in React (Vite)
```html
<!-- index.html — add in <head> -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```
```css
/* Then use in CSS */
body { font-family: 'Inter', sans-serif; }
```

**With Tailwind:** `text-xl font-semibold text-center tracking-wide leading-relaxed truncate`
**With MUI:** `<Typography variant="h6" fontWeight={600} noWrap>`

---

## 7. Colors & Backgrounds

```css
.element {
  /* Color formats */
  color: red;                        /* named color */
  color: #ff5733;                    /* hex */
  color: rgb(255, 87, 51);           /* rgb */
  color: rgba(255, 87, 51, 0.5);     /* rgb + alpha (transparency) */
  color: hsl(14, 100%, 60%);         /* hue saturation lightness */
  color: hsla(14, 100%, 60%, 0.8);   /* hsl + alpha */

  /* Background */
  background-color: #f8f9fa;

  /* Gradients */
  background: linear-gradient(135deg, #667eea, #764ba2);
  /* angle, color1, color2 */
  background: linear-gradient(to right, #f093fb, #f5576c);
  background: radial-gradient(circle, #667eea, #764ba2);

  /* Background image */
  background-image: url('./image.jpg');
  background-size: cover;       /* image covers entire element */
  background-size: contain;     /* image fits inside element */
  background-position: center;
  background-repeat: no-repeat;
}
```

**With Tailwind:** `bg-blue-500`, `bg-gradient-to-r from-purple-500 to-pink-500`, `text-gray-700`

---

## 8. Shadows

```css
/* box-shadow: offset-x  offset-y  blur-radius  spread-radius  color */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);        /* subtle */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);       /* medium */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);        /* large */
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);    /* focus ring / glow */

  /* Multiple shadows */
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 24px rgba(0, 0, 0, 0.15);

  /* Inset shadow (inner shadow) */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  /* Text shadow */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

**With Tailwind:** `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

---

## 9. Borders & Border Radius

```css
.element {
  /* Border shorthand: width style color */
  border: 1px solid #e2e8f0;
  border: 2px dashed #cbd5e0;
  border: 3px dotted red;
  border: none;                    /* remove border */

  /* Individual sides */
  border-top: 4px solid #6366f1;
  border-bottom: 1px solid #e2e8f0;

  /* Border radius (rounded corners) */
  border-radius: 4px;              /* slightly rounded */
  border-radius: 8px;              /* card-like rounding */
  border-radius: 12px;             /* modern card */
  border-radius: 16px;             /* very rounded */
  border-radius: 50%;              /* perfect circle (only when width == height) */
  border-radius: 9999px;           /* pill shape */

  /* Individual corners: top-left top-right bottom-right bottom-left */
  border-radius: 12px 12px 0 0;    /* round top, flat bottom */

  /* Outline (doesn't affect layout, used for focus) */
  outline: 2px solid #6366f1;
  outline-offset: 2px;             /* gap between element and outline */
}
```

**With Tailwind:** `border border-gray-200`, `rounded`, `rounded-lg`, `rounded-xl`, `rounded-full`

---

## 10. Width & Height

```css
.element {
  width: 300px;          /* fixed width */
  width: 100%;           /* 100% of parent's width */
  width: 50vw;           /* 50% of viewport width */
  width: auto;           /* browser decides (default for block) */
  width: fit-content;    /* shrinks to content size */
  min-width: 200px;      /* never smaller than this */
  max-width: 600px;      /* never larger than this */

  height: 200px;         /* fixed height */
  height: 100vh;         /* 100% of viewport height */
  height: auto;          /* grows with content (default) */
  min-height: 100vh;     /* at least full screen height */
  max-height: 400px;     /* caps height */

  /* overflow — what happens when content is bigger than the box */
  overflow: visible;     /* content spills out (default) */
  overflow: hidden;      /* clips content */
  overflow: auto;        /* scrollbar appears when needed */
  overflow: scroll;      /* always shows scrollbar */
  overflow-x: hidden;    /* hide horizontal overflow only */
  overflow-y: auto;      /* scroll vertically only */
}
```

**With Tailwind:** `w-full w-1/2 max-w-md h-screen min-h-full overflow-hidden`

---

## 11. Opacity & Visibility

```css
.element {
  opacity: 0;      /* Fully transparent (invisible but still takes up space) */
  opacity: 0.5;    /* 50% transparent */
  opacity: 1;      /* Fully visible (default) */

  visibility: hidden;   /* Invisible AND interaction disabled, but TAKES UP space */
  visibility: visible;

  display: none;        /* Invisible AND removed from layout (no space taken) */
}
```

**With Tailwind:** `opacity-0 opacity-50 opacity-100 invisible`

---

## 12. Cursor

```css
.element {
  cursor: default;    /* normal arrow */
  cursor: pointer;    /* hand — always use this on clickable things */
  cursor: text;       /* text cursor */
  cursor: not-allowed; /* blocked circle — for disabled elements */
  cursor: grab;        /* open hand — for draggable elements */
  cursor: grabbing;    /* closed hand — while dragging */
  cursor: crosshair;
  cursor: wait;        /* loading spinner */
}
```

**With Tailwind:** `cursor-pointer cursor-not-allowed cursor-grab`

---

## 13. Transitions & Animations

```css
/* Transition — smooth change from one CSS value to another */
.button {
  background: blue;
  /* property  duration  easing */
  transition: background 0.3s ease;
}
.button:hover {
  background: darkblue; /* transitions smoothly over 0.3s */
}

/* Transition multiple properties */
.card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    opacity 0.2s ease;
}

/* Common easing functions */
/* ease        — slow start, fast middle, slow end (default feel) */
/* ease-in     — slow start */
/* ease-out    — slow end */
/* ease-in-out — slow start AND end */
/* linear      — constant speed */
/* cubic-bezier(x1, y1, x2, y2) — custom curve */

/* Transform — move, scale, rotate WITHOUT affecting layout */
.card:hover {
  transform: translateY(-4px);   /* move up 4px */
  transform: scale(1.05);        /* scale up 5% */
  transform: rotate(45deg);      /* rotate 45 degrees */
  transform: translateX(10px) scale(1.02); /* combine multiple */
}

/* Keyframe Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.element {
  animation: fadeIn 0.5s ease forwards;
  /* name  duration  easing  fill-mode */
}

/* Spin animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 1s linear infinite;
}
```

**With Tailwind:** `transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1`
**With Framer Motion (library):**
```jsx
// npm install framer-motion
import { motion } from 'framer-motion';
<motion.div whileHover={{ scale: 1.05 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
```

---

## 14. Pseudo-classes & Pseudo-elements

```css
/* Pseudo-classes — target element in a specific STATE */
.button:hover   { background: darkblue; }    /* mouse is over it */
.button:active  { transform: scale(0.97); }  /* being clicked */
.button:focus   { outline: 2px solid blue; } /* keyboard focused */
.input:disabled { opacity: 0.5; cursor: not-allowed; }
.input:placeholder-shown { border-color: gray; }

/* nth-child selectors */
li:first-child  { font-weight: bold; }
li:last-child   { border-bottom: none; }
li:nth-child(2) { color: red; }
li:nth-child(odd)  { background: #f5f5f5; }  /* zebra striping */
li:nth-child(even) { background: white; }

/* Pseudo-elements — create "virtual" elements */
.button::before {
  content: '';            /* required — even if empty */
  display: block;
  /* use for decorative elements, icons, overlays */
}

.button::after {
  content: '→';           /* can contain text */
}

/* Remove default list bullets */
ul::marker { display: none; }

/* Style placeholder text */
input::placeholder { color: #9ca3af; font-style: italic; }

/* Style selected text */
::selection { background: #6366f1; color: white; }
```

**With Tailwind:** `hover:bg-blue-700 focus:ring-2 active:scale-95 first:font-bold last:border-0`

---

## 15. CSS Variables (Custom Properties)

```css
/* Define variables in :root so they're available everywhere */
:root {
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --color-text: #1f2937;
  --color-bg: #ffffff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --border-radius: 12px;
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Use them anywhere */
.card {
  background: var(--color-bg);
  color: var(--color-text);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}

/* Dark mode with CSS variables */
[data-theme='dark'] {
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
}
```

### In React — Apply theme toggle:
```jsx
// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 16. Responsive Design — Media Queries

```css
/* Mobile-first approach (recommended) */
/* Write base styles for mobile, then add breakpoints for larger screens */

.card {
  width: 100%;    /* mobile: full width */
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .card { width: 50%; padding: 24px; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card { width: 33.33%; }
}

/* Common breakpoints */
/* xs:  < 480px  — small phones */
/* sm:  ≥ 640px  — phones landscape */
/* md:  ≥ 768px  — tablets */
/* lg:  ≥ 1024px — laptops */
/* xl:  ≥ 1280px — desktops */
/* 2xl: ≥ 1536px — large screens */

/* Responsive grid — no media queries needed! */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

**With Tailwind:** `w-full md:w-1/2 lg:w-1/3` — breakpoints built-in as prefixes

---

## Quick Reference Table

| Property | What it does | Example |
|---|---|---|
| `margin` | Space outside element | `margin: 16px` |
| `padding` | Space inside element | `padding: 8px 16px` |
| `border` | Visible edge | `border: 1px solid #ccc` |
| `border-radius` | Round corners | `border-radius: 12px` |
| `display` | Layout mode | `display: flex` |
| `flex` | Flexbox shorthand | `flex: 1` |
| `gap` | Space between flex/grid items | `gap: 16px` |
| `position` | Positioning mode | `position: absolute` |
| `z-index` | Stack order | `z-index: 10` |
| `width/height` | Size | `width: 100%` |
| `max-width` | Cap the size | `max-width: 600px` |
| `overflow` | Content clipping | `overflow: hidden` |
| `color` | Text color | `color: #333` |
| `background` | Background | `background: linear-gradient(...)` |
| `font-size` | Text size | `font-size: 1rem` |
| `font-weight` | Text boldness | `font-weight: 600` |
| `line-height` | Line spacing | `line-height: 1.5` |
| `text-align` | Text alignment | `text-align: center` |
| `box-shadow` | Drop shadow | `box-shadow: 0 4px 12px rgba(...)` |
| `opacity` | Transparency | `opacity: 0.8` |
| `cursor` | Mouse cursor shape | `cursor: pointer` |
| `transition` | Animate CSS changes | `transition: all 0.3s ease` |
| `transform` | Move/scale/rotate | `transform: scale(1.05)` |

---

> **Next:** [02 — Designing Cards & Components →](./02_designing_cards_and_components.md)

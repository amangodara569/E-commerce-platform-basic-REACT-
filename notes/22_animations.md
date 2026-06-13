# 22 — Animations in React

> **References:**
> - [Framer Motion Docs](https://www.framer.com/motion/)
> - [React Spring Docs](https://www.react-spring.dev/)
> - [CSS Transitions — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)

---

## Animation Options in React

| Approach | Complexity | Performance | Best For |
|---|---|---|---|
| CSS Transitions/Animations | Easy | Excellent | Simple hover/state changes |
| CSS Keyframes | Easy | Excellent | Looping, complex CSS animations |
| `Framer Motion` | Medium | Excellent | Component animations, gestures |
| `React Spring` | Medium | Excellent | Physics-based animations |
| `GSAP` | Advanced | Excellent | Complex timeline animations |

---

## 1. CSS Transitions (Simplest)

```css
/* styles.css */
.card {
  transform: scale(1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;  /* Animate all properties */
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.btn {
  background: #6366f1;
  transition: background 0.2s, transform 0.1s;
}

.btn:hover { background: #4f46e5; }
.btn:active { transform: scale(0.97); }
```

```jsx
function AnimatedCard({ children }) {
  return <div className="card">{children}</div>;
}
```

---

## 2. CSS Keyframes

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

.pulse {
  animation: pulse 2s infinite ease-in-out;
}

.spinner {
  animation: spin 1s linear infinite;
}
```

```jsx
function FadeInWrapper({ children }) {
  return <div className="fade-in">{children}</div>;
}

function LoadingSpinner() {
  return (
    <div className="spinner" style={{
      width: 40,
      height: 40,
      border: '4px solid #e5e7eb',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
  );
}
```

---

## 3. State-Based CSS Animations

```jsx
function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
      <button onClick={() => setIsOpen(o => !o)} className="accordion-header">
        {title}
        <span className={`icon ${isOpen ? 'rotated' : ''}`}>▼</span>
      </button>
      
      {/* Animate height with CSS transition */}
      <div className={`accordion-body ${isOpen ? 'open' : ''}`}>
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  );
}
```

```css
.accordion-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-body.open {
  max-height: 500px;  /* Large enough for content */
}

.icon {
  transition: transform 0.3s;
}

.icon.rotated {
  transform: rotate(180deg);
}
```

---

## 4. Framer Motion

```bash
npm install framer-motion
```

### Basic Animations

```jsx
import { motion } from 'framer-motion';

// Animate on mount
function FadeInCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}  // Starting state
      animate={{ opacity: 1, y: 0 }}   // Ending state
      transition={{ duration: 0.5 }}   // How to animate
    >
      Hello!
    </motion.div>
  );
}

// Hover animations
function HoverCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      Hover me!
    </motion.div>
  );
}

// Exit animations (need AnimatePresence)
import { AnimatePresence } from 'framer-motion';

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Staggered List Animations

```jsx
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Each child animates 0.1s after previous
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function StaggeredList({ items }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {items.map(item => (
        <motion.li key={item.id} variants={item}>
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Page Transitions

```jsx
// Wrap routes with AnimatePresence
function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Gesture Animations

```jsx
function DraggableCard() {
  return (
    <motion.div
      drag                          // Enable dragging
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}             // How elastic the drag feels
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      style={{ cursor: 'grab' }}
    >
      Drag me!
    </motion.div>
  );
}
```

### Scroll Animations

```jsx
import { motion, useScroll, useTransform } from 'framer-motion';

function ParallaxHero() {
  const { scrollY } = useScroll();
  
  // As user scrolls from 0 to 500px, y goes from 0 to -100px
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="hero-background"
    />
  );
}

// Animate when element enters viewport
import { useInView } from 'framer-motion';
import { useRef } from 'react';

function AnimateOnScroll({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 5. Loading Skeleton Animations

```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 4px;
}
```

```jsx
function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 14, width: '60%' }} />
      </div>
    </div>
  );
}

function ProductList({ isLoading, products }) {
  if (isLoading) {
    return (
      <div className="grid">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
```

---

## 6. Number Counter Animation

```jsx
function AnimatedCounter({ target, duration = 2000 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);  // ~60fps

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{current.toLocaleString()}</span>;
}

// Usage
<AnimatedCounter target={10000} duration={2000} />
// Shows 0 → 10,000 over 2 seconds
```

---

## 7. Notification Toast Animations

```jsx
import { motion, AnimatePresence } from 'framer-motion';

function Toast({ message, type, onClose }) {
  return (
    <motion.div
      className={`toast toast-${type}`}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <span>{message}</span>
      <button onClick={onClose}>✕</button>
    </motion.div>
  );
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container" style={{ position: 'fixed', top: 20, right: 20 }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
```

---

## Summary

| Technique | Use For | Library |
|---|---|---|
| CSS Transitions | Simple hover, focus states | None |
| CSS Keyframes | Looping animations, complex CSS | None |
| State + CSS | Show/hide, accordions | None |
| Framer Motion | Complex animations, gestures, exit | `framer-motion` |
| React Spring | Physics-based (bouncy) | `react-spring` |
| GSAP | Professional complex timelines | `gsap` |

**Key principles:**
- Prefer CSS animations for simple cases (best performance)
- Use `AnimatePresence` for exit animations in Framer Motion
- Use `useScroll` + `useTransform` for scroll-based animations
- Keep animations under 300ms for UI feedback, longer for decorative

---

> **Previous:** [21 — Next.js ←](./21_nextjs.md)
> **Next:** [23 — Accessibility →](./23_accessibility.md)

# 10 — Forms in React

> **References:**
> - [Forms — React Docs](https://react.dev/learn/reacting-to-input-with-state)
> - [React Hook Form](https://react-hook-form.com/)
> - [Formik](https://formik.org/)

---

## Controlled vs. Uncontrolled Components

React offers two ways to handle form inputs:

| | Controlled | Uncontrolled |
|---|---|---|
| Data stored in | React state | DOM itself |
| Access via | `state` | `ref` |
| Real-time validation | ✅ Easy | ❌ Hard |
| Instant feedback | ✅ Yes | ❌ No |
| Recommended | ✅ Yes | For simple forms |

---

## Controlled Components

The form input value is **controlled by React state**. Every keystroke updates state, which updates the input.

```jsx
function ControlledInput() {
  const [name, setName] = useState('');

  return (
    <div>
      {/* Input is controlled: value comes from state */}
      <input
        type="text"
        value={name}                           // Controlled by state
        onChange={e => setName(e.target.value)} // Updates state on change
        placeholder="Enter your name"
      />
      <p>You typed: {name}</p>
      <p>Character count: {name.length}</p>
    </div>
  );
}
```

---

## Basic Form with Multiple Fields

```jsx
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: 'male',
    agreeToTerms: false,
  });

  // Generic handler for all fields
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      // For checkboxes, use 'checked'; for others, use 'value'
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();  // Prevent page reload!
    console.log('Form submitted:', formData);
    // Send formData to API...
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create Account</h2>

      {/* Text Input */}
      <div className="field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
        />
      </div>

      {/* Email Input */}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
        />
      </div>

      {/* Password Input */}
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min 8 characters"
        />
      </div>

      {/* Select / Dropdown */}
      <div className="field">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">-- Select --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Checkbox */}
      <div className="field">
        <label>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
          />
          I agree to the Terms and Conditions
        </label>
      </div>

      <button type="submit" disabled={!formData.agreeToTerms}>
        Register
      </button>
    </form>
  );
}
```

---

## Form Validation

### Manual Validation

```jsx
function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(form.email, form.password);
      // Navigate to dashboard...
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.submit && <p className="error">{errors.submit}</p>}

      <div className="field">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="field">
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? 'input-error' : ''}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}
```

---

## Uncontrolled Components with useRef

For simple cases where you only need the value on submit:

```jsx
import { useRef } from 'react';

function SimpleForm() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    // Access DOM values directly
    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
    };
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} type="text" placeholder="Name" />
      <input ref={emailRef} type="email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## React Hook Form (Library — Recommended for Complex Forms)

```bash
npm install react-hook-form
```

```jsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const password = watch('password');  // Watch for password confirmation

  async function onSubmit(data) {
    // data contains all form values
    await createUser(data);
    reset();  // Reset form after submit
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Register each field with validation rules */}
      <input
        {...register('username', {
          required: 'Username is required',
          minLength: { value: 3, message: 'Min 3 characters' },
          maxLength: { value: 20, message: 'Max 20 characters' },
          pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, underscore' },
        })}
        placeholder="Username"
      />
      {errors.username && <p>{errors.username.message}</p>}

      <input
        {...register('email', {
          required: 'Email required',
          pattern: { value: /^\S+@\S+$/, message: 'Invalid email' },
        })}
        type="email"
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        {...register('password', {
          required: 'Password required',
          minLength: { value: 8, message: 'Min 8 characters' },
        })}
        type="password"
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}

      <input
        {...register('confirmPassword', {
          required: 'Confirm your password',
          validate: value => value === password || 'Passwords do not match',
        })}
        type="password"
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
```

---

## Different Input Types

```jsx
function AllInputTypes() {
  const [form, setForm] = useState({
    text: '',
    number: '',
    date: '',
    time: '',
    color: '#000000',
    range: 50,
    radio: '',
    file: null,
    textarea: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <form>
      {/* Text */}
      <input type="text" value={form.text} onChange={e => update('text', e.target.value)} />

      {/* Number */}
      <input type="number" min="0" max="100" value={form.number} onChange={e => update('number', e.target.value)} />

      {/* Date */}
      <input type="date" value={form.date} onChange={e => update('date', e.target.value)} />

      {/* Color picker */}
      <input type="color" value={form.color} onChange={e => update('color', e.target.value)} />
      <p>Selected: {form.color}</p>

      {/* Range slider */}
      <input type="range" min="0" max="100" value={form.range} onChange={e => update('range', e.target.value)} />
      <p>Value: {form.range}</p>

      {/* Radio buttons */}
      {['male', 'female', 'other'].map(option => (
        <label key={option}>
          <input
            type="radio"
            name="gender"
            value={option}
            checked={form.radio === option}
            onChange={e => update('radio', e.target.value)}
          />
          {option}
        </label>
      ))}

      {/* Textarea */}
      <textarea
        value={form.textarea}
        onChange={e => update('textarea', e.target.value)}
        rows={5}
        placeholder="Enter description..."
      />

      {/* File input (uncontrolled — files can't be set programmatically) */}
      <input
        type="file"
        onChange={e => update('file', e.target.files[0])}
        accept="image/*"
      />
      {form.file && <p>Selected: {form.file.name}</p>}
    </form>
  );
}
```

---

## Form Reset

```jsx
function ResetableForm() {
  const initialState = { name: '', email: '' };
  const [form, setForm] = useState(initialState);

  function handleReset() {
    setForm(initialState);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);
    setForm(initialState);  // Reset after submit
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
      <input name="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
      <button type="submit">Submit</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
}
```

---

## Summary

| Concept | Key Point |
|---|---|
| Controlled | `value` + `onChange` = React controls the input |
| Uncontrolled | Use `ref` to access DOM value directly |
| `e.preventDefault()` | Always call this in `onSubmit` |
| Generic handler | `[e.target.name]: e.target.value` pattern |
| Validation | Run before submit, display errors per field |
| React Hook Form | Best library for complex forms (less boilerplate) |

---

> **Previous:** [09 — Lists & Keys ←](./09_lists_and_keys.md)
> **Next:** [11 — Hooks Deep Dive →](./11_hooks.md)

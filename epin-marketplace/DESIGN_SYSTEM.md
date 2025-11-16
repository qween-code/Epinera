# Epinera Design System

## Color Palette

### Primary Colors
```css
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main brand color */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;
```

### Secondary Colors (Gaming Purple)
```css
--secondary-50: #faf5ff;
--secondary-100: #f3e8ff;
--secondary-200: #e9d5ff;
--secondary-300: #d8b4fe;
--secondary-400: #c084fc;
--secondary-500: #a855f7;
--secondary-600: #9333ea;
--secondary-700: #7e22ce;
--secondary-800: #6b21a8;
--secondary-900: #581c87;
```

### Success (Green)
```css
--success-500: #10b981;
--success-600: #059669;
--success-700: #047857;
```

### Warning (Yellow)
```css
--warning-500: #f59e0b;
--warning-600: #d97706;
```

### Error (Red)
```css
--error-500: #ef4444;
--error-600: #dc2626;
```

### Neutral Colors
```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
--gray-950: #030712;
```

## Typography

### Font Families
```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
--font-display: 'Inter', var(--font-sans);
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## Spacing Scale

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

## Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-base: 0.5rem;  /* 8px */
--radius-md: 0.75rem;   /* 12px */
--radius-lg: 1rem;      /* 16px */
--radius-xl: 1.5rem;    /* 24px */
--radius-2xl: 2rem;     /* 32px */
--radius-full: 9999px;
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-glow: 0 0 20px rgb(59 130 246 / 0.5);
--shadow-glow-purple: 0 0 20px rgb(168 85 247 / 0.5);
```

## Component Styles

### Buttons

**Primary Button**
```css
background: var(--primary-600);
color: white;
padding: 0.75rem 1.5rem;
border-radius: var(--radius-lg);
font-weight: var(--font-semibold);
transition: all 0.2s;
box-shadow: var(--shadow-base);

hover: {
  background: var(--primary-700);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

active: {
  transform: translateY(0);
}
```

**Secondary Button**
```css
background: transparent;
color: var(--primary-600);
border: 2px solid var(--primary-600);
padding: 0.75rem 1.5rem;
border-radius: var(--radius-lg);
font-weight: var(--font-semibold);
transition: all 0.2s;

hover: {
  background: var(--primary-50);
}
```

### Cards

```css
background: white;
border-radius: var(--radius-xl);
padding: var(--spacing-6);
box-shadow: var(--shadow-base);
transition: all 0.3s;

hover: {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}
```

### Inputs

```css
background: white;
border: 2px solid var(--gray-300);
border-radius: var(--radius-lg);
padding: 0.75rem 1rem;
font-size: var(--text-base);
transition: all 0.2s;

focus: {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  outline: none;
}

error: {
  border-color: var(--error-500);
}
```

## Layout

### Container
```css
max-width: 1280px;
margin: 0 auto;
padding: 0 var(--spacing-6);
```

### Grid System
```css
display: grid;
gap: var(--spacing-6);

/* Mobile */
grid-template-columns: 1fr;

/* Tablet */
@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop */
@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
}

/* Large Desktop */
@media (min-width: 1280px) {
  grid-template-columns: repeat(4, 1fr);
}
```

## Animation

### Transitions
```css
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;
--transition-slower: 500ms;

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Keyframes
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

## Breakpoints

```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

## Dark Mode Colors

```css
[data-theme="dark"] {
  --bg-primary: var(--gray-950);
  --bg-secondary: var(--gray-900);
  --bg-tertiary: var(--gray-800);
  --text-primary: var(--gray-50);
  --text-secondary: var(--gray-300);
  --text-tertiary: var(--gray-500);
  --border-color: var(--gray-800);
}
```

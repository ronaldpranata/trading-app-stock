# SCSS Best Practices in React

This guide outlines the recommended SCSS architecture and coding standards for this application. We use a **7-1 Pattern** adapted for Next.js to ensure scalability and maintainability.

## 1. Directory Structure

We strictly separate **abstracts** (variables, mixins) from **base** styles and **components**.

```text
src/styles/
├── abstracts/      # Helpers (No CSS output)
│   ├── _variables.scss  # Colors, fonts, breakpoints
│   └── _mixins.scss     # Reusable logic (glass-effect, scrollbars)
├── base/           # Boilerplate
│   └── _animations.scss # Keyframes
└── main.scss       # Main entry point (imports everything)
```

### Why this structure?
- **Global vs Local**: Global styles live in `src/styles`. Component-specific styles should ideally use **CSS Modules** (e.g., `Component.module.scss`) to avoid leaking styles, though global utility classes are permitted for common patterns.
- **Single Entry**: `main.scss` is the only file imported by `layout.tsx`.

## 2. Naming Convention (BEM)

We encourage **BEM (Block Element Modifier)** methodology for global styles to prevent clashes.

```scss
// Block
.stock-card {
  background: $bg-dark;
  
  // Element
  &__title {
    font-size: 1.2rem;
  }

  // Modifier
  &--active {
    border-color: $primary-color;
  }
}
```

## 3. Using Variables & Mixins

Always use variables for colors, spacing, and fonts to ensure consistency.

**Bad:**
```scss
.button {
  background: #3b82f6; // Hardcoded color
}
```

**Good:**
```scss
@use 'abstracts/variables' as *;

.button {
  background: $primary-color;
}
```

## 4. React Integration

### Global Styles
Import `main.scss` **once** in the root layout (`src/app/layout.tsx`).

### Component Styles (CSS Modules)
For component-specific styling, create a `[name].module.scss` file next to your component.

```tsx
// options.module.scss
.container { padding: 20px; }

// Options.tsx
import styles from './options.module.scss';

export default function Options() {
  return <div className={styles.container}>...</div>;
}
```

## 5. Performance Tips
- **Avoid Deep Nesting**: Don't nest more than 3 levels deep. It increases specificity and file size.
- **Use `@use` instead of `@import`**: Dart Sass (which we use) prefers `@use` for better modularity and to avoid global namespace pollution.

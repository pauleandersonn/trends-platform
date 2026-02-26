# Design System — Trends Platform

**Status:** ✅ Approved
**Date:** 2026-02-26
**Version:** 1.0.0

---

## Overview

Ultra-minimalista design system inspired by Apple (refinement), Notion (information clarity), and Linear (modernity). Removes all visual friction. User understands value in <3 seconds: select niche → view trends.

**Core Principle:** Maximum whitespace, clean typography, zero decorative elements, WCAG AA accessibility as first-class feature.

---

## 1. Typography System

**Primary Font:** Inter (or SF Pro Display if custom budget)

### Scale & Hierarchy

| Level     | Size | Weight | Line Height | Use Case                     |
| --------- | ---- | ------ | ----------- | ---------------------------- |
| **H1**    | 48px | 700    | 1.2         | Hero text, page hero         |
| **H2**    | 32px | 600    | 1.3         | Page titles, major sections  |
| **H3**    | 24px | 600    | 1.4         | Section headers, card titles |
| **Body**  | 16px | 400    | 1.6         | Default text, trend titles   |
| **Small** | 14px | 400    | 1.5         | Secondary info, metadata     |
| **Tiny**  | 12px | 500    | 1.4         | Labels, timestamps, badges   |

**Rationale:** Large line-heights (1.4-1.6) for readability in minimal design. Bold weights only where needed for hierarchy. Generous spacing prevents claustrophobia.

---

## 2. Color System

### Light Mode (Default)

```css
--bg-primary: #ffffff;
--text-primary: #1a1a1a; /* Near-black, not pure black for gentleness */
--text-secondary: #666666; /* Gray for metadata */
--accent: #0066cc; /* Apple-like blue, confident */
--border: #e5e5e5; /* Subtle dividers */
--success: #10b981; /* Green */
--warning: #f59e0b; /* Amber */
--error: #ef4444; /* Red */
```

### Dark Mode (Night)

```css
--bg-primary: #0f0f0f; /* Not pure black, easier on eyes */
--text-primary: #f5f5f5;
--text-secondary: #999999;
--accent: #5b9fff; /* Lighter blue for dark mode */
--border: #2a2a2a;
--success: #10b981; /* Adjusted for contrast */
--warning: #f59e0b;
--error: #ef4444;
```

### Whitespace (Padding & Margins)

```css
--page-padding: 32px; /* Desktop */
--page-padding-mobile: 16px; /* Mobile */
--section-margin: 48px; /* Desktop */
--section-margin-mobile: 32px; /* Mobile */
--component-gap: 16px; /* Default spacing between elements */
--component-gap-large: 24px; /* Spacious sections */
```

**Dark Mode Implementation:**

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0f0f0f;
    --text-primary: #f5f5f5;
    --accent: #5b9fff;
    /* ... all dark mode vars ... */
  }
}
```

**Toggle:** Moon/Sun icon in header (right side)

- Click persists preference in `localStorage`
- Smooth transition between themes (0.3s cubic-bezier(0.2, 0.8, 0.2, 1))
- System preference respected on first visit

---

## 3. Layout Grid & Spacing

### 8px Base Unit System

```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

### Container Widths

| Device      | Width      | Padding |
| ----------- | ---------- | ------- |
| **Mobile**  | 100vw      | 16px    |
| **Tablet**  | 600px max  | 16px    |
| **Desktop** | 1200px max | 32px    |

---

## 4. Component Library

### 4.1 Card (Trend Item)

**Structure:**

```
┌─────────────────────────────────┐
│ #1 Trending: AI in Marketing    │  ← Rank + Title (bold)
│ ↑ 245% growth • Google • 24h    │  ← Metrics (small text)
│                           📌    │  ← Bookmark icon (appears on hover)
└─────────────────────────────────┘
```

**Styling:**

- Border: 1px solid `--border`
- Border-radius: 8px (subtle roundness)
- Padding: 16px
- Hover: Background +1% darker, no shadow, no lift (respects motion preferences)
- Click: Transitions to trend detail page smoothly (0.2s)

**Responsive:**

- Full width on mobile
- Grid layout on tablet/desktop (2-3 columns)

---

### 4.2 Filter Bar

**Layout:**

- Inline below page title (never modal)
- Flex layout with gap-16

**Components:**

1. **Time Filter Button Group:**
   - "Last 24h | Last 7d | Last 30d"
   - Active: Text + underline in `--accent`
   - Inactive: Text in `--text-secondary`

2. **Sort Dropdown:**
   - Label: "Sort by"
   - Options: "Growth | Relevance | Date"
   - No visual "pressed" state, just text change + underline

**Responsive:**

- Desktop: Side-by-side
- Mobile: Stack vertically OR collapse into single dropdown

---

### 4.3 Niche Grid

**Desktop Layout:**

- 3 columns, gap-24

**Tablet Layout:**

- 2 columns, gap-24

**Mobile Layout:**

- 1 column, full width

**Each Niche Card:**

- Icon (32px, centered)
- Name (16px bold)
- Minimum 80x80px card
- Hover: Scale 1.05x, no shadow
- Click: Transition to `/trends/[nicho]` smoothly

---

### 4.4 Button Styles

#### Primary Button

```css
background: var(--accent);
color: white;
padding: 12px 24px;
border: none;
border-radius: 6px;
font-weight: 500;
cursor: pointer;
transition: background 0.2s ease;
```

**Hover:** 10% darker shade
**Focus:** 2px solid outline in `--accent` (WCAG AA)
**Active:** 15% darker shade

#### Secondary Button

```css
background: transparent;
color: var(--accent);
border: 1px solid var(--accent);
padding: 12px 24px;
border-radius: 6px;
cursor: pointer;
transition: all 0.2s ease;
```

**Hover:** Background 5% accent color opacity
**Focus:** 2px solid outline

#### Icon Button

```css
background: transparent;
padding: 8px;
border: none;
cursor: pointer;
border-radius: 4px;
transition: background 0.2s ease;
```

**Hover:** Background `--border` color
**Focus:** 2px solid outline

---

### 4.5 Form Inputs

**Structure:**

```
┌─────────────────────────────────┐
│ Label (required)                │
├─────────────────────────────────┤
│ [Input field or textarea]       │
├─────────────────────────────────┤
│ Error message (if validation)   │
└─────────────────────────────────┘
```

**Styling:**

- Border: 1px solid `--border`
- Padding: 12px 16px
- Font: 16px body
- Border-radius: 6px
- Background: `--bg-primary`

**States:**

- **Default:** Border `--border`, text `--text-primary`
- **Focus:** 2px solid border `--accent`, no outline
- **Filled:** Border `--text-secondary` (10% opacity), text `--text-primary`
- **Error:** Border 2px solid `--error`, error text below in `--error` color

**Label:**

- Always visible (not placeholder-only)
- Font: 14px tiny weight
- Color: `--text-secondary`
- Margin-bottom: 8px
- Required indicator: Red asterisk if mandatory

---

### 4.6 Loading State

**Skeleton Loader:**

- Pulsing gray boxes matching exact layout of content
- No spinners (distracting)
- Pulse animation: 1.5s ease-in-out infinite
- Background: `--border` color, 50% opacity

**Animation:**

```css
animation: skeleton-pulse 1.5s ease-in-out infinite;
@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
```

---

### 4.7 Navigation & Breadcrumbs

**Back Button:**

- Left arrow icon (24px)
- Text optional: "← Back"
- Always available on detail/secondary pages
- Positioned: top-left, 32px padding from edge

**Breadcrumbs (Detail Page):**

- Format: `Home > Niche > Trend`
- Font: 14px small
- Color: `--text-secondary`
- Separator: " / "

**Mobile Navigation:**

- Hamburger menu if needed (but minimize)
- Aim for simple footer navigation (Home, Favorites, Settings)

---

## 5. Dark Mode Implementation

### CSS Variables Approach

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent: #0066cc;
  --border: #e5e5e5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0f0f0f;
    --text-primary: #f5f5f5;
    --accent: #5b9fff;
    --border: #2a2a2a;
  }
}
```

### Tailwind Integration

```javascript
// tailwind.config.ts
export default {
  darkMode: "media", // or 'class' for toggle
  theme: {
    colors: {
      "bg-primary": "var(--bg-primary)",
      "text-primary": "var(--text-primary)",
      accent: "var(--accent)",
      border: "var(--border)",
      // ...
    },
  },
};
```

### Toggle Implementation

```typescript
// Hook to manage dark mode
function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggle = () => {
    setIsDark(!isDark);
    localStorage.setItem("theme", isDark ? "light" : "dark");
    // Apply theme to document
  };

  return { isDark, toggle };
}
```

---

## 6. Interaction Patterns

### Transitions

- **Page change:** Fade in (0.2s ease-out)
- **Hover states:** Subtle color shift (0.15s ease)
- **Dark mode toggle:** Smooth fade (0.3s cubic-bezier)
- **Loading:** Skeleton pulsing (1.5s infinite ease-in-out)
- **Button click:** Background change (0.1s ease)

### Error Handling UI

- **Inline errors:** Below form inputs, `--error` color (12px)
- **Toast notifications:** Top-right position, auto-dismiss 4s, semi-transparent background
- **Fallback screens:** Show cached data with "Data is from X hours ago" badge

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Accessibility (WCAG AA)

### Color Contrast

- **Text on background:** Minimum 4.5:1 (AAA: 7:1)
- **Text on components:** Minimum 4.5:1
- **Icon on background:** Minimum 3:1
- **Focus indicators:** 2px outline, high contrast

### Keyboard Navigation

- Tab through all interactive elements in logical order
- Visible focus indicator on all focusable elements
- Keyboard shortcuts documented (optional)
- Skip links for jumping to main content

### Screen Reader Support

- Semantic HTML: `<button>`, `<a>`, `<nav>`, `<main>`, `<section>`
- Form labels always associated: `<label htmlFor="input-id">`
- Alt text on all images (even decorative images: `alt=""`)
- ARIA labels for icon-only buttons: `aria-label="Bookmark trend"`
- Status messages announced: `role="status"` or `role="alert"`

### Forms

- Clear, visible labels (not placeholders)
- Required fields marked: `required` attribute + visual indicator
- Error messages tied to inputs: `aria-describedby`
- Success/validation feedback announced

### Mobile/Touch

- Minimum 44x44px touch targets (WCAG 2.5.5)
- Adequate spacing between clickable elements
- No hover-only interactions (provide alternative on touch)

---

## 8. Icon System

**Library:** Feather Icons or SF Symbols (minimalista aesthetic)

### Key Icons

| Icon                   | Use                        | Size |
| ---------------------- | -------------------------- | ---- |
| 🔖 Bookmark (unfilled) | Save trend (empty state)   | 24px |
| 🔖 Bookmark (filled)   | Saved trend (active state) | 24px |
| ← Back arrow           | Navigate back              | 24px |
| ☰ Hamburger           | Mobile menu toggle         | 24px |
| ☀️ Sun                 | Light mode toggle          | 24px |
| 🌙 Moon                | Dark mode toggle           | 24px |
| 🔗 Share               | Share trend (chain link)   | 24px |
| ✕ Close/X              | Close modals               | 24px |
| 📊 Chart               | Marketing/Analytics niche  | 32px |
| 🤖 Brain/Gear          | AI niche                   | 32px |
| 👗 Dress               | Fashion niche              | 32px |
| 🚀 Rocket              | Startups niche             | 32px |
| ₿ Bitcoin/₿            | Crypto niche               | 32px |
| 💪 Flexed arm          | Fitness niche              | 32px |

### Sizing

- **Default:** 24px (most interactions)
- **Small:** 16px (secondary icons, badges)
- **Large:** 32px (niche selection, hero elements)

### Styling

- Stroke weight: 1.5-2px (minimalista look)
- Color: Inherit from parent text color
- No fill except for active states (bookmark filled = saved)

---

## 9. Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: "0px", // 0 - 639px
  tablet: "640px", // 640px - 1023px
  desktop: "1024px", // 1024px+
};
```

### Mobile Considerations

- Single column layouts
- Touch-friendly (44px+ tap targets)
- Simplified navigation (hamburger menu)
- Stacked buttons
- Readable font sizes (16px minimum)

### Tablet Considerations

- 2-column layouts
- More breathing room
- Sidebar navigation optional
- Balance of touch and mouse interactions

### Desktop Considerations

- Multi-column layouts (3 columns for niches)
- Full-featured navigation
- Mouse-optimized hover states
- Abundant whitespace

---

## 10. Design System Components Inventory

### Atoms (Basic building blocks)

- Button (primary, secondary, icon)
- Input field
- Label
- Badge
- Icon
- Typography (h1-h6, body, small, tiny)

### Molecules (Simple combinations)

- Form field (label + input + error)
- Search bar
- Filter chip
- Loading skeleton

### Organisms (Complex UI sections)

- Header (logo, dark mode toggle, nav)
- Niche card
- Trend card
- Filter bar
- Navigation menu

### Templates (Page layouts)

- Default layout (header + main + footer)
- Detail layout (header + main with back button)
- Full-screen modal

### Pages (Specific instances)

- Home/Landing
- Nicho Feed
- Trend Detail
- Favorites
- Login/Register
- About
- Settings

---

## 11. Implementation Notes for @dev

### Tailwind Configuration

Create `tailwind.config.ts` with:

- Custom colors mapped to CSS variables
- 8px spacing scale (default utilities)
- Custom typography scale matching this document
- Dark mode support via `@media (prefers-color-scheme: dark)`
- Border radius: 6px base (sm), 8px (md), 12px (lg)

### CSS Variables Setup

```typescript
// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #FFFFFF;
  --text-primary: #1A1A1A;
  --accent: #0066CC;
  --border: #E5E5E5;
  /* ... all variables ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0F0F0F;
    /* ... dark mode vars ... */
  }
}
```

### Component Structure (TypeScript/React)

```typescript
// components/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "icon";
  size?: "sm" | "md" | "lg";
}

export const Button = ({ variant, size = "md", ...props }: ButtonProps) => {
  // Implementation using Tailwind classes
};
```

### Type-Safe Colors

```typescript
type ColorToken =
  | "bg-primary"
  | "text-primary"
  | "accent"
  | "border"
  | "error"
  | "success";

const colors: Record<ColorToken, string> = {
  "bg-primary": "var(--bg-primary)",
  "text-primary": "var(--text-primary)",
  // ...
};
```

---

## Approval & Next Steps

**Design System Status:** ✅ Ready for Component Implementation
**Next Phase:** @dev implements Epic 1 (Foundation & Home) using these specifications

**Questions for @dev:**

- Confirm Tailwind CSS v4 setup with custom tokens
- Verify dark mode implementation approach
- Confirm component library choice (Radix UI vs Headless UI)

---

**Created by:** Uma (UX Design Expert)
**Date:** 2026-02-26
**Version:** 1.0.0
**Approval:** ✅ Ready for Implementation

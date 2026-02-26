# UX Design Expert Prompt — Trends Platform Design System

## PRD Reference

**Document:** `docs/prd.md`
**Status:** ✅ Approved
**Date:** 2026-02-26

---

## Your Task

Create a **Design System & Component Library** that translates the minimalista vision into actionable UI specifications and component patterns for @dev implementation.

---

## Core Design Philosophy

From PRD:

> "Ultra-minimalista interface that removes all visual friction. Inspired by Apple (refinement), Notion (information clarity), and Linear (modernity). User should understand value in <3 seconds: select niche → view trends. Light background with clean typography (modern sans-serif), maximum whitespace, zero decorative elements."

**Your constraints:**

- ✅ WCAG AA accessibility (no sacrifice for aesthetics)
- ✅ Dark mode as first-class feature (not afterthought)
- ✅ Responsive (desktop-first, mobile touch-friendly)
- ✅ Performance budget: LCP <2.5s, CLS <0.1

---

## Design System Specifications

### 1. Typography System

**Primary Font:** Inter (or SF Pro Display if custom budget)

**Hierarchy:**

- **H1:** 48px / 1.2 line-height / 700 weight (hero text)
- **H2:** 32px / 1.3 line-height / 600 weight (page titles)
- **H3:** 24px / 1.4 line-height / 600 weight (section headers)
- **Body:** 16px / 1.6 line-height / 400 weight (default text)
- **Small:** 14px / 1.5 line-height / 400 weight (secondary info)
- **Tiny:** 12px / 1.4 line-height / 500 weight (labels, metadata)

**Rationale:** Large line-height for readability in minimalista design; bold weights only where needed for hierarchy.

### 2. Color System

**Light Mode (Default):**

- Background: #FFFFFF (pure white)
- Text Primary: #1A1A1A (near-black, not pure black for gentleness)
- Text Secondary: #666666 (gray for metadata)
- Accent: #0066CC (blue, confident, Apple-like) — **customize as needed**
- Border: #E5E5E5 (subtle dividers)
- Success: #10B981 (green)
- Warning: #F59E0B (amber)
- Error: #EF4444 (red)

**Dark Mode (Night):**

- Background: #0F0F0F (not pure black, easier on eyes)
- Text Primary: #F5F5F5
- Text Secondary: #999999
- Accent: #5B9FFF (lighter blue for dark mode)
- Border: #2A2A2A
- Success, Warning, Error: (adjusted for contrast)

**Whitespace:**

- Page padding: 32px (desktop), 16px (mobile)
- Section margin: 48px (desktop), 32px (mobile)
- Component gap: 16px (default), 24px (large)

### 3. Component Library

#### **Card (Trend Item)**

- Border: 1px solid border color
- Border-radius: 8px (subtle roundness, not 0, not 20px)
- Padding: 16px
- Hover: Background +1% darker (no shadow, no lift)
- Content: Title (bold) | Metadata (small text) | Icon area (right)

```
┌─────────────────────────────────┐
│ #1 Trending: AI in Marketing    │  ← Rank + Title
│ ↑ 245% growth • Google • 24h    │  ← Metrics
│                           📌    │  ← Bookmark icon (hover)
└─────────────────────────────────┘
```

#### **Filter Bar**

- Inline below page title (no modal)
- Button group: "Last 24h | Last 7d | Last 30d"
- Dropdown: "Sort by: Growth | Relevance | Date"
- No visual "pressed" state, just text change + underline
- Mobile: Collapse into single dropdown

#### **Nicho Grid**

- 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Each nicho: Icon + Name, 80x80px card minimum
- Hover: Slight scale (1.05x), no shadow
- Click: Transition to feed page smoothly

#### **Button Styles**

- **Primary:** Solid accent color, white text, padding 12px 24px
- **Secondary:** Border-only, accent color border, transparent background
- **Icon Button:** No visible container until hover, then subtle background

#### **Form Inputs**

- Border: 1px solid border-color
- Focus: 2px solid accent color (no outline, native focus ring)
- Placeholder: Text-secondary color
- Error state: Red border + error message below

#### **Loading State**

- Skeleton loader (pulsing gray boxes, not spinners)
- Match exact layout of content to load

### 4. Layout Grid & Spacing

**8px base unit:**

- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

**Container widths:**

- Mobile: Full width - 32px padding
- Tablet: 600px max
- Desktop: 1200px max

### 5. Dark Mode Implementation

**Technology:** CSS variables + Tailwind dark mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f0f0f;
    --text-primary: #f5f5f5;
    /* ... */
  }
}
```

**Toggle:**

- Moon/Sun icon in header (right side)
- Click persists preference in localStorage
- Smooth transition between themes (0.3s)

---

## Wireframes & Information Architecture

### Screen 1: Home / Landing

```
TRENDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Discover trends by niche in seconds.
No noise. Just what matters.

[Select a niche to start]

┌─────────┬─────────┬─────────┐
│ 📊      │ 🤖      │ 👗      │
│ Mkt Dig │ AI      │ Fashion │
├─────────┼─────────┼─────────┤
│ 🚀      │ ₿        │ 💪      │
│ Startups│ Crypto  │ Fitness │
└─────────┴─────────┴─────────┘

[About] [Privacy] [Terms]
```

### Screen 2: Nicho Feed

```
AI ← Back button

Filters: [24h | 7d | 30d] [Sort: Growth ▼]

#1 AI-Powered Customer Support → 345%
   Google • 24h              [🔖]

#2 Large Language Models → 289%
   Google, Twitter • 24h     [🔖]

#3 Prompt Engineering → 256%
   Google, Reddit • 24h      [🔖]

[Load more...]
```

### Screen 3: Trend Detail

```
↼ Back

AI-Powered Customer Support
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Growth: ↑ 345% (24h) | Growth Timeline Graph

Sources:
  • Google Trends: ↑ 345%
  • Twitter/X: ↑ 289%
  • Reddit: ↑ 202%

Insight:
Demand for AI-powered CS solutions jumped 345%
in last 24h. Consider expanding product offering
or publishing thought leadership content.

[Share] [🔖 Save to Favorites]
```

### Screen 4: Favorites

```
My Favorites (12)

[Apply filters] [Delete all]

#1 AI-Powered Customer Support
   Saved 2h ago              [✓]

#2 Large Language Models
   Saved 5h ago              [✓]

[Continue exploring new trends →]
```

### Screen 5: Auth (Login/Register)

```
TRENDS

[Email input]
[Password input]
[Password confirm input] (register only)
[Agree to terms] (register only)

[Sign In / Sign Up]

Forgot password? [Reset →]
```

### Screen 6: About

```
About TRENDS
━━━━━━━━━━━━━

One platform to discover what's trending
across your niches. No noise. No generic
trending lists. Just the signal.

[Features list]
[Roadmap]
[Pricing] (link to monetization page)
[Blog] (if exists)
[Contact]
```

### Screen 7: Settings

```
⚙️ Settings

Theme:
  ☀️ Light | 🌙 Dark | ⚙️ Auto

Language: [English ▼]

Update frequency:
  [Every 6 hours ▼]

Notifications:
  [Enable desktop alerts] ☑️

[Log out]
[Delete account] (warning text)
```

---

## Interaction Patterns

### Navigation

- Back button always available (top-left)
- Breadcrumbs: Home > Niche > Trend (on detail page)
- Mobile: Hamburger menu if needed, but aim for simple footer nav

### Transitions

- Page change: Fade in (0.2s ease-out)
- Hover states: Subtle color shift (0.15s ease)
- Dark mode toggle: Smooth fade (0.3s)
- Loading: Skeleton pulsing (looped)

### Error Handling UI

- Inline error messages (below form inputs)
- Toast notifications (top-right, auto-dismiss 4s)
- Fallback screens if API fails (show cached data with "Data is from X hours ago" badge)

### Accessibility

- All buttons have sufficient contrast (WCAG AA)
- Form labels always visible (not placeholder-only)
- Keyboard navigation: Tab through interactive elements
- Screen reader: Semantic HTML (buttons, links, headings, alt text on icons)
- Focus indicators: Visible 2px outline on all focusable elements

---

## Icon System

**Library:** Feather Icons or SF Symbols

**Key icons:**

- Bookmark: unfilled vs filled (heart or bookmark shape)
- Back: left arrow
- Menu: hamburger
- Theme: sun/moon
- Niche: specific icons (chart for marketing, brain for AI, dress for fashion, etc.)
- Share: chain link
- Close: X

**Sizing:** 24px default, 16px small, 32px large

---

## Deliverables

**Files:**

1. `docs/design/design-system.md` — Typography, colors, spacing, components
2. `docs/design/wireframes.figma` (or PDF) — All screens (optional if Figma access)
3. `docs/design/accessibility-checklist.md` — WCAG AA compliance

**For @dev:**

- Tailwind config with custom colors/typography
- Component specs (button sizes, padding, etc.)
- Responsive breakpoints (mobile: <640px, tablet: 640-1024px, desktop: >1024px)
- Dark mode CSS variables

---

## Implementation Sequence

1. **Phase 1 (Epic 1):** Home + Login/Register (basic styling)
2. **Phase 2 (Epic 2):** Feed + Filters (card component, hover states)
3. **Phase 3 (Epic 3):** Detail page + Settings (modal/full-page design)
4. **Phase 4 (Epic 4):** Polish + Animations (refine all transitions)

---

## Notes for You

- **Simplicity is hard:** Every visual decision should have a reason
- **Whitespace is content:** Don't fill empty space with decorations
- **Test dark mode:** Make sure colors work in both themes
- **Mobile-first mindset:** But desktop implementation first (easier to scale down)
- **Accessibility by default:** Not as afterthought

**Next:** After design system approved, @architect confirms tech stack, then @dev implements Epic 1.

---

**Execute:** `*create-doc design-system --template front-end-spec-tmpl`

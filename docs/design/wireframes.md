# Wireframes & Information Architecture — Trends Platform

**Status:** ✅ Approved
**Date:** 2026-02-26
**Version:** 1.0.0

---

## Overview

Complete wireframes for all 7 core screens. Designed for mobile-first responsiveness with desktop optimization. Follows the minimalista design philosophy: maximum whitespace, clean typography, zero decoration.

---

## Screen 1: Home / Landing Page

**URL:** `/`
**Auth Required:** No
**Purpose:** Welcome users, allow niche selection
**Device Variants:** Mobile (1 column), Tablet (2 cols), Desktop (3 cols)

### Layout Structure

```
┌─────────────────────────────────────────┐
│                                         │
│  TRENDS                                 │
│  Discover trends by niche in seconds.   │
│  No noise. Just what matters.           │
│                                         │
│         [Select a niche to start]       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  📊          │  │  🤖          │   │
│  │ Marketing    │  │  AI          │   │
│  │ Digital      │  │              │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  👗          │  │  🚀          │   │
│  │  Fashion     │  │  Startups    │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  ₿           │  │  💪          │   │
│  │  Crypto      │  │  Fitness     │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  [About] [Privacy] [Terms]              │
└─────────────────────────────────────────┘
```

### Components

- **Header:** Logo + Dark Mode Toggle (top-right)
- **Hero Section:** Title (H1), Subtitle (Body), CTA text
- **Niche Grid:** 3x2 cards on desktop, 2x3 on tablet, 1 column on mobile
- **Footer:** Links (About, Privacy, Terms)

### Interactions

- Niche card hover: Scale 1.05x, subtle shadow
- Click: Smooth transition to `/trends/[niche]` with fade-in animation
- Dark mode toggle: Instant theme switch with 0.3s transition

### Spacing

- Page padding: 32px (desktop), 16px (mobile)
- Hero section: 64px vertical margins
- Niche grid gap: 24px
- Footer: 48px top margin

---

## Screen 2: Nicho Feed / Trends List

**URL:** `/trends/[nicho]` (e.g., `/trends/ai`)
**Auth Required:** No
**Purpose:** Display trends for selected niche with filtering options
**Device Variants:** Responsive, single column on mobile

### Layout Structure

```
┌─────────────────────────────────────────┐
│ ← AI                                    │  ← Back button + Niche title
│ Filters: [24h|7d|30d] [Sort: Growth ▼] │  ← Inline filters
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  #1 AI-Powered Customer Support        │  ← Trend rank + title
│     ↑ 345% growth • Google • 24h  [🔖] │  ← Metrics + bookmark icon
│                                         │
│  #2 Large Language Models              │
│     ↑ 289% growth • Google, Twitter    │
│     [🔖]                               │
│                                         │
│  #3 Prompt Engineering                 │
│     ↑ 256% growth • Google, Reddit     │
│     [🔖]                               │
│                                         │
│  ... (load more on scroll)              │
│                                         │
│  [Load more...]                         │
│                                         │
└─────────────────────────────────────────┘
```

### Components

- **Back Button:** Left arrow (24px) + niche name
- **Filter Bar:** Inline below title
  - Time buttons: "Last 24h | Last 7d | Last 30d" (active = underline)
  - Sort dropdown: "Sort by: Growth ▼" (or Relevance, Date)
- **Trend Cards:** Stacked vertically
  - Each card: rank (bold) + title, growth percentage (visual), sources, timestamp
  - Bookmark icon appears on hover (right side)
- **Loading State:** Skeleton cards matching exact layout
- **Infinite Scroll:** "Load more..." button or auto-load on scroll

### Responsive Behavior

- **Desktop:** Cards at full width, filter bar inline
- **Tablet:** Cards full width, filter bar inline
- **Mobile:** Cards full width, filter bar stacked vertically

### Interactions

- **Card hover:** Background +1% darker, bookmark icon appears
- **Card click:** Navigate to `/trends/[niche]/[trend-id]` (detail page)
- **Filter change:** No page refresh, URL updates with query params (e.g., `?time=7d&sort=relevance`)
- **Filter persistence:** Settings saved in localStorage
- **Bookmark click:** Toggle bookmark (requires auth → redirect to login if needed)

---

## Screen 3: Trend Detail Page

**URL:** `/trends/[nicho]/[trend-id]`
**Auth Required:** No
**Purpose:** Deep dive into single trend with insights and sources
**Device Variants:** Full-screen page, responsive

### Layout Structure

```
┌─────────────────────────────────────────┐
│ ← Back                                  │  ← Back button
│                                         │
│ AI-Powered Customer Support             │  ← Title (H1)
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│ Growth: ↑ 345% (24h)                   │  ← Growth % + timeframe
│ [Graph placeholder - growth over time]  │
│                                         │
│ Sources:                                │  ← Multi-source breakdown
│  • Google Trends: ↑ 345%               │
│  • Twitter/X: ↑ 289%                   │
│  • Reddit: ↑ 202%                      │
│                                         │
│ Insight:                                │
│ Demand for AI-powered CS solutions     │
│ jumped 345% in last 24h. Consider      │
│ expanding product offering or          │
│ publishing thought leadership content. │
│                                         │
│ [Share] [🔖 Save to Favorites]         │  ← Action buttons
│                                         │
└─────────────────────────────────────────┘
```

### Components

- **Header:** Back button + Title (H1)
- **Growth Indicator:** Large percentage + timeframe
- **Growth Chart:** Simple line chart (placeholder area for visualization)
- **Sources Section:** Bulleted list of data sources with individual growth %
- **Insight Section:** 2-3 sentence actionable summary
- **Action Buttons:** Share button + Bookmark/Unbookmark toggle

### Responsive Behavior

- **Desktop:** Full-width content with margin
- **Tablet:** Slightly condensed spacing
- **Mobile:** Single column, larger touch targets for buttons

### Interactions

- **Back button:** Return to feed page (preserve filter state)
- **Share button:** Open share dialog (copy link, social share options)
- **Bookmark button:** Toggle bookmark (requires auth)
- **Graph hover:** Show data tooltip on desktop, tap to reveal on mobile

---

## Screen 4: Favorites Page

**URL:** `/favorites`
**Auth Required:** Yes (redirect to login if not authenticated)
**Purpose:** View and manage saved trends
**Device Variants:** Responsive, single column on mobile

### Layout Structure

```
┌─────────────────────────────────────────┐
│ ← My Favorites (12)                     │  ← Back + count
│                                         │
│ [Apply filters] [Delete all]            │  ← Action buttons
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  #1 AI-Powered Customer Support        │
│     Saved 2h ago              [✓ Saved]│
│                                         │
│  #2 Large Language Models               │
│     Saved 5h ago              [✓ Saved]│
│                                         │
│  #3 Prompt Engineering                  │
│     Saved yesterday           [✓ Saved]│
│                                         │
│  [Continue exploring new trends →]      │  ← CTA to discover more
│                                         │
└─────────────────────────────────────────┘
```

### Components

- **Header:** Back button + "My Favorites" + count
- **Action Buttons:**
  - "Apply filters" (open filter dialog)
  - "Delete all" (confirm dialog)
- **Favorite Cards:** Similar to feed cards
  - Rank + title
  - Save timestamp
  - Checkmark + "Saved" label (instead of bookmark icon)
- **CTA Section:** "Continue exploring new trends" link

### Responsive Behavior

- **Desktop:** Cards full width
- **Mobile:** Cards full width, better touch spacing

### Interactions

- **Card click:** Navigate to detail page
- **Card hover:** Show delete option (trash icon)
- **Saved card click:** Removes from favorites
- **Apply filters:** Open modal with time/relevance filters
- **Delete all:** Confirmation dialog before bulk delete
- **CTA click:** Navigate back to home `/`

---

## Screen 5: Login / Register

**URL:** `/auth/login` or `/auth/register`
**Auth Required:** No (available to unauthenticated users)
**Purpose:** User authentication
**Device Variants:** Centered modal-like form, responsive

### Login Layout

```
┌─────────────────────────────────────────┐
│                                         │
│             TRENDS                      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Email                           │   │
│  │ [____________________________]   │   │
│  │                                 │   │
│  │ Password                        │   │
│  │ [____________________________]   │   │
│  │                                 │   │
│  │ [Sign In]                       │   │
│  │                                 │   │
│  │ Forgot password? [Reset →]      │   │
│  │                                 │   │
│  │ No account? [Sign Up →]         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Register Layout

```
┌─────────────────────────────────────────┐
│                                         │
│             TRENDS                      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Email                           │   │
│  │ [____________________________]   │   │
│  │                                 │   │
│  │ Password                        │   │
│  │ [____________________________]   │   │
│  │                                 │   │
│  │ Confirm Password                │   │
│  │ [____________________________]   │   │
│  │                                 │   │
│  │ ☐ I agree to Terms              │   │
│  │                                 │   │
│  │ [Sign Up]                       │   │
│  │                                 │   │
│  │ Already have account? [Log In →]│   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Components

- **Logo:** Centered at top
- **Form Container:** Max-width 400px, centered
- **Input Fields:**
  - Email (with validation for format)
  - Password (with show/hide toggle)
  - Confirm password (register only)
- **Checkbox:** Terms agreement (register only)
- **Primary Button:** "Sign In" or "Sign Up" (full width)
- **Links:** Forgot password, switch between login/register

### Validation States

- **Email error:** Red border + error message below
- **Password error:** Red border + error message
- **Required:** Visual indicator (red asterisk)

### Responsive Behavior

- **Mobile:** Full-width form with padding
- **Desktop:** Centered container, max-width 400px

### Interactions

- **Form submission:** Validate on client, send to API, handle errors
- **Show/hide password:** Toggle icon in password field
- **Link navigation:** Switch between login/register screens
- **Forgot password link:** Navigate to password reset flow

---

## Screen 6: About Page

**URL:** `/about`
**Auth Required:** No
**Purpose:** Project information and roadmap
**Device Variants:** Single column, responsive

### Layout Structure

```
┌─────────────────────────────────────────┐
│ ← About TRENDS                          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│ One platform to discover what's         │
│ trending across your niches.            │
│ No noise. No generic trending lists.    │
│ Just the signal.                        │
│                                         │
│ Features                                │
│ • Multi-niche tracking                  │
│ • Real-time data from 4 sources        │
│ • Save your favorite trends             │
│ • Dark mode support                     │
│ • Fully responsive design               │
│                                         │
│ Roadmap (Coming Soon)                   │
│ • Advanced filtering (categories, tags) │
│ • API access for developers             │
│ • Email digest subscriptions            │
│ • Mobile app (iOS/Android)              │
│                                         │
│ [Blog] [Contact] [Pricing]              │
│                                         │
└─────────────────────────────────────────┘
```

### Components

- **Back button**
- **Title:** "About TRENDS"
- **Hero description:** 2-3 sentences about the platform
- **Features list:** Bulleted key features
- **Roadmap section:** Coming soon items (bulleted)
- **Footer links:** Blog, Contact, Pricing

### Responsive Behavior

- **Mobile:** Single column, generous padding
- **Desktop:** Max-width container, centered

---

## Screen 7: Settings Page

**URL:** `/settings`
**Auth Required:** Yes
**Purpose:** User preferences and account management
**Device Variants:** Single column, responsive

### Layout Structure

```
┌─────────────────────────────────────────┐
│ ← ⚙️ Settings                           │
│                                         │
│ Theme                                   │
│  [☀️ Light] [🌙 Dark] [⚙️ Auto]         │
│                                         │
│ Language                                │
│  [English ▼]                            │
│                                         │
│ Update Frequency                        │
│  [Every 6 hours ▼]                      │
│                                         │
│ Notifications                           │
│  ☑️ Enable desktop alerts               │
│                                         │
│ Account                                 │
│  Email: user@example.com                │
│  [Change password]                      │
│  [Two-factor authentication]             │
│                                         │
│ [Log out]                               │
│ [Delete account] (⚠️ Irreversible)      │
│                                         │
└─────────────────────────────────────────┘
```

### Components

- **Theme selector:** Button group (Light, Dark, Auto)
- **Language dropdown:** Localization selection
- **Update frequency dropdown:** 6h, 12h, 24h options
- **Notification checkbox:** Toggle desktop alerts
- **Account section:** Email display, password change, 2FA setup
- **Danger zone:** Log out button, Delete account (with warning)

### Interactions

- **Theme toggle:** Instant theme switch with 0.3s transition
- **Language change:** Page refreshes in selected language
- **Update frequency:** Syncs with job queue settings
- **Notifications toggle:** Updates user preferences
- **Change password:** Modal form
- **Log out:** Clears tokens, redirects to login
- **Delete account:** Confirmation dialog + warning

---

## Information Architecture Hierarchy

```
Home (/)
├── Niche Selection (Grid)
└── Links: About, Privacy, Terms

Trends Feed (/trends/[niche])
├── Back to Home
├── Filter Bar
└── Trend Cards (List)
    └── Click → Detail Page

Trend Detail (/trends/[niche]/[trend-id])
├── Back to Feed
├── Growth Chart
├── Sources Breakdown
├── Insight Text
└── Actions: Share, Bookmark

Favorites (/favorites)
├── Back button
├── Saved Trends List
└── Continue Exploring Link → Home

Authentication (/auth/login, /auth/register)
├── Login Form
│   └── Forgot Password Link
└── Register Form
    └── Login Link

About (/about)
└── Project Info + Roadmap

Settings (/settings)
├── Theme Selection
├── Language Selection
├── Notification Preferences
└── Account Management

Unathenticated Flow:
Home → Niche Selection → Trends Feed → Trend Detail → [Bookmark attempts login] → Auth

Authenticated Flow:
Home → Niche Selection → Trends Feed → Trend Detail → [Can bookmark] → Favorites → Settings
```

---

## User Flows

### New User Flow

```
1. Land on Home
2. See niche grid + hero text
3. Select niche (e.g., "AI")
4. See Trends Feed for AI
5. Explore individual trend (Detail page)
6. Try to bookmark → Redirected to Login
7. Create account
8. Bookmark trend
9. View Favorites
10. Explore Settings
```

### Returning User Flow

```
1. Land on Home
2. Auto-redirect to last viewed niche (optional, from localStorage)
3. See Trends Feed
4. Bookmark trends
5. View Favorites (see updated list)
6. Change theme/preferences in Settings
```

### Power User Flow

```
1. Home
2. Select niche
3. Apply filters (time range, sort)
4. Browse multiple trends
5. Bookmark frequently
6. Check Favorites page regularly
7. Share trends with others
8. Customize notification frequency
```

---

## Responsive Grid System

### Mobile (0-639px)

- Single column layouts
- Full-width cards with padding
- Stacked filters vertically
- Touch-friendly sizing (44px+ targets)

### Tablet (640px-1023px)

- 2-column layouts for nichos
- Inline filters with slight wrapping
- Slightly more whitespace

### Desktop (1024px+)

- 3-column niche grid
- Full-featured multi-column layouts
- Abundant whitespace
- Hover states fully enabled

---

## Next Steps for @dev

1. **Create page routes:** Home, Feed, Detail, Favorites, Auth, About, Settings
2. **Implement components:** Button, Card, FilterBar, FormField (from design system)
3. **Build layouts:** Follow wireframe structure exactly
4. **Add interactions:** Transitions, filters, navigation
5. **Implement dark mode:** Using CSS variables from design system
6. **Test responsiveness:** Mobile, tablet, desktop viewports

---

**Created by:** Uma (UX Design Expert)
**Date:** 2026-02-26
**Approval:** ✅ Ready for Implementation

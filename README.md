# Trends Platform

Ultra-minimalista platform to discover trends by niche in seconds.

## Project Overview

Trends Platform is a full-stack application built with Next.js, designed to help users discover emerging trends in their specific niches quickly and efficiently. The application provides an ultra-clean, minimalist interface inspired by modern SaaS platforms like Apple, Notion, and Linear.

## Tech Stack

### Frontend

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Server State:** TanStack Query
- **Testing:** Jest + React Testing Library

### Backend

- **Runtime:** Next.js API Routes
- **Database:** PostgreSQL (via Supabase)
- **Caching:** Redis (6-hour TTL)

### Infrastructure

- **Deployment:** Vercel
- **CI/CD:** GitHub Actions
- **Version Control:** Git

### Development Tools

- **Linting:** ESLint (Next.js config)
- **Formatting:** Prettier
- **Pre-commit Hooks:** Husky + lint-staged
- **Build Orchestration:** Turbo (monorepo)

## Project Structure

```
trends-platform/
├── apps/
│   └── web/                    # Next.js frontend + API routes
│       ├── src/
│       │   ├── app/           # App Router pages and layouts
│       │   │   ├── page.tsx   # Home page
│       │   │   ├── layout.tsx # Root layout
│       │   │   └── globals.css
│       │   ├── components/    # React components
│       │   └── lib/          # Utilities and helpers
│       ├── public/           # Static files
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       └── tailwind.config.ts
├── packages/
│   ├── shared-types/         # Shared TypeScript types
│   │   └── src/
│   │       └── index.ts
│   └── utils/               # Shared utility functions
│       └── src/
│           └── index.ts
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD pipeline
├── .husky/                  # Git hooks configuration
├── package.json            # Root monorepo configuration
├── tsconfig.json          # Root TypeScript configuration
├── .eslintrc.json         # ESLint configuration
├── .prettierrc             # Prettier configuration
└── README.md              # This file

```

## Getting Started

### Prerequisites

- **Node.js:** 20+ (npm 9+)
- **Git:** Latest version
- **GitHub CLI:** Optional, for GitHub integration

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/trends-platform.git
   cd trends-platform
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

**Development server monitors changes and auto-reloads.**

### Building for Production

Build the application:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Scripts

### Workspace Commands (Turbo Orchestrated)

```bash
# Development
npm run dev              # Start dev servers for all apps

# Building
npm run build            # Build all apps for production

# Testing
npm run test             # Run tests in all workspaces
npm run test:watch       # Run tests in watch mode

# Quality
npm run lint             # Run ESLint across all workspaces
npm run typecheck        # Run TypeScript type checking
npm run format           # Format files with Prettier
npm run format:check     # Check formatting without modifying

# Cleanup
npm run clean            # Clean build artifacts and node_modules
```

### Individual App Commands

Navigate to `apps/web/` and run:

```bash
npm run dev              # Start Next.js dev server
npm run build            # Build Next.js app
npm run start            # Start production server
npm run lint             # Lint the app
npm run test             # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run typecheck        # TypeScript type check
```

## Code Quality

### ESLint

Configuration extends `next/core-web-vitals` and `prettier`:

```bash
npm run lint             # Check linting
npm run lint -- --fix    # Auto-fix linting issues
```

### Prettier

Code formatting configuration:

```bash
npm run format           # Format all code
npm run format:check     # Check if formatting is needed
```

### Type Checking

```bash
npm run typecheck        # Verify no TypeScript errors
```

### Testing

```bash
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
```

## Pre-commit Hooks

**Husky + lint-staged** automatically run before commits:

- **TypeScript/TSX:** ESLint + Prettier
- **JSON/Markdown:** Prettier

The hooks run automatically on `git commit`. To skip (not recommended):

```bash
git commit --no-verify
```

## CI/CD Pipeline

GitHub Actions automatically runs on every push and pull request:

1. **Lint & Format** - ESLint and Prettier checks
2. **Type Checking** - TypeScript verification
3. **Tests** - Unit tests with coverage
4. **Build** - Production build verification
5. **Deploy** - Auto-deploy to Vercel on main branch

View workflow status in the GitHub repository under **Actions** tab.

### Required Secrets for Vercel Deployment

Add these secrets in GitHub repository settings:

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

## Database Setup

### Supabase

1. Create a Supabase project at https://supabase.com
2. Copy database credentials to `.env.local`
3. Run migrations (when available):

   ```bash
   npm run db:migrate
   ```

### Environment Variables

See `.env.example` for all available configuration options.

## Deployment

### Vercel

Automatic deployment is configured via GitHub Actions on every push to `main` branch.

**Manual Deployment:**

```bash
npm run build
vercel --prod
```

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push to remote: `git push origin feature/feature-name`
4. Open a Pull Request on GitHub

## Design System

**Design Philosophy:** Ultra-minimalista

- Clean, distraction-free interface
- Dark mode support (`@media (prefers-color-scheme: dark)`)
- Accessibility-first approach (WCAG AA)
- Atomic design methodology

## Performance

- **Next.js Image Optimization:** Automatic image optimization for faster loads
- **Code Splitting:** Automatic code splitting at route level
- **CSS-in-JS:** Tailwind CSS with tree-shaking
- **Caching Strategy:**
  - Redis for API response caching (6-hour TTL)
  - Browser caching for static assets
  - Next.js ISR (Incremental Static Regeneration)

## Security

- **Environment Variables:** Sensitive data managed via `.env.local`
- **API Routes:** Protected by authentication middleware
- **CORS:** Configured for allowed origins only
- **Headers:** Security headers configured in Next.js
- **RLS:** PostgreSQL Row-Level Security (Supabase)

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

### Dependencies Issues

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Failures

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

## Support

For issues, questions, or suggestions:

1. Check existing GitHub Issues
2. Open a new issue with detailed information
3. Include error messages and reproduction steps

## License

[Specify your license here - MIT, Apache 2.0, etc.]

## Acknowledgments

- Design inspiration: Apple, Notion, Linear
- Built with: Next.js, TypeScript, Tailwind CSS, Zustand
- Hosted on: Vercel
- Database: Supabase

---

**Last Updated:** February 26, 2026

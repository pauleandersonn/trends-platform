# Architect Prompt — Trends Platform Architecture

## PRD Reference

**Document:** `docs/prd.md`
**Status:** ✅ Approved
**Date:** 2026-02-26

---

## Your Task

Create a comprehensive **Architecture Document** for the Trends Platform that translates the PRD into technical design, systems, and implementation constraints for @dev.

---

## Core Requirements

### 1. System Architecture Diagram

- High-level system overview (Frontend, Backend, Database, External APIs, Cache, Job Queue)
- Component relationships
- Data flow
- Integration points

### 2. Technology Stack Validation

**Proposed Stack:**

- Frontend: Next.js 16+ (App Router), React 18+, TypeScript, Tailwind CSS, Zustand
- Backend: Next.js API routes
- Database: PostgreSQL (Supabase)
- Cache: Redis (for rate limiting and API response caching)
- Job Queue: Vercel Cron or Bull
- Auth: NextAuth.js or Supabase Auth
- Monitoring: Sentry, PostHog

**Your validation should address:**

- ✅ Confirm suitability for MVP scope
- ✅ Identify potential bottlenecks
- ✅ Suggest alternatives if needed
- ✅ Justify choices

### 3. API Integration Architecture

**External APIs to integrate:**

1. Google Trends (unofficial or scraping)
2. Twitter/X API v2
3. Reddit API
4. Product Hunt API

**Design requirements:**

- Rate limiting strategy for each API
- Retry logic (max 3 retries, exponential backoff)
- Graceful fallback if API fails
- Caching layer (Redis, TTL = 6 hours for data freshness)
- Error handling and monitoring

### 4. Database Schema Design

**Core entities:**

- `users` (id, email, password_hash, created_at, updated_at)
- `trends` (id, title, description, nicho, growth%, source, rank, created_at)
- `favorites` (user_id, trend_id, saved_at)
- `cache_log` (api_source, last_fetched, ttl_expires)

**Requirements:**

- Foreign key relationships
- Indexes for performance
- RLS (Row-Level Security) policies for Supabase
- Migration strategy

### 5. Caching Strategy

**Challenge:** APIs have strict rate limits (Twitter/X ~450 req/15min, Reddit ~60 req/min, etc.)

**Solution Design:**

- Redis cache with TTL (6 hours for data freshness)
- Cache invalidation strategy
- Hit/miss metrics
- Fallback to stale data if API fails

### 6. Authentication & Authorization

**Requirements from PRD:**

- Email/password registration and login
- JWT tokens (access + refresh)
- Session management (24h timeout)
- Password reset flow
- Protected API routes

**Design:**

- Token generation and validation
- Refresh token rotation
- CORS policy
- Rate limiting per user

### 7. Job Queue Design

**Requirement:** Automatic trend data updates every 6 hours

**Options:**

1. **Vercel Cron:** Simple, serverless, no infrastructure
2. **Bull (Redis-backed):** More control, retries, monitoring

**Design should cover:**

- Cron schedule
- Job structure (which APIs to fetch, how to aggregate)
- Error handling and retry logic
- Logging and monitoring
- Performance impact on main app

### 8. Performance & Scalability

**NFR targets:**

- Response time: <500ms for user actions
- Page load: <2s on 3G
- Scalability: 10k+ concurrent users

**Architecture decisions:**

- CDN for static assets (Vercel built-in)
- Database connection pooling
- API response compression
- Image optimization
- Code splitting strategy

### 9. Security & Compliance

**Critical areas:**

- Password hashing (bcrypt)
- HTTPS enforcement
- CORS policy
- Rate limiting (DDoS protection)
- Input validation (Zod schemas)
- SQL injection prevention (Prisma ORM)
- Environment variable management
- API secret handling

### 10. Monitoring & Error Handling

**Tools:**

- Sentry (error tracking)
- PostHog (analytics)
- Vercel Analytics (performance)

**What to monitor:**

- API integration failures
- Cache hit/miss ratio
- Job queue execution
- Database performance
- User activity metrics

---

## Deliverables

**File:** `docs/architecture/trends-architecture.md`

**Sections:**

1. System Overview (diagram + narrative)
2. Technology Stack (validated + rationale)
3. API Integration Architecture
4. Database Schema (ERD + DDL)
5. Caching Strategy
6. Authentication & Authorization Flow
7. Job Queue Design
8. Performance & Scalability Plan
9. Security Architecture
10. Monitoring & Error Handling
11. Deployment Pipeline

---

## Epic Sequencing Consideration

Architecture will guide story implementation:

- **Epic 1 (Foundation):** Setup infrastructure, initialize DB schema, auth endpoints
- **Epic 2 (Feed):** Single API (Google Trends) integration, cache layer
- **Epic 3 (Favorites):** Auth robustness, favorites data model
- **Epic 4 (Multi-Source):** Additional APIs, aggregation logic, job queue

---

## Notes for You

- Focus on **constraints for @dev** — be specific about implementation details
- Call out **technical debt early** (e.g., unofficial Google Trends API risk)
- Suggest **alternatives** if you see better solutions
- Define **clear boundaries** between Frontend, Backend, External Services
- Consider **future scalability** (monetization phase might need API server)

**Next:** After architecture is approved, @ux-design-expert creates design system, then @dev implements Epic 1.

---

**Execute:** `*create-doc architecture --template architecture-v4`

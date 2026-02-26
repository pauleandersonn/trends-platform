# Trends Platform — Technical Architecture Document

**Status:** ✅ Architecture Approved
**Date:** 2026-02-26
**Architect:** Aria (Visionary)
**Reference:** `docs/prd.md`

---

## 1. System Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
          ┌────────────────┴────────────────┐
          │                                 │
    ┌─────▼──────┐                    ┌────▼────┐
    │ Vercel CDN │                    │ Next.js  │
    │(Static     │                    │ Frontend │
    │Assets)     │                    │(React 18)│
    └────────────┘                    └────┬─────┘
                                           │
                                    ┌──────▼──────────┐
                                    │  Next.js API    │
                                    │  Routes         │
                                    │(Backend)        │
                                    └──────┬──────────┘
                       ┌────────────────────┼────────────────────┐
                       │                    │                    │
                  ┌────▼────┐          ┌────▼────┐          ┌────▼─────┐
                  │PostgreSQL│          │  Redis  │          │  Sentry  │
                  │(Supabase)│          │ (Cache) │          │ (Errors) │
                  └─────────┘          └─────────┘          └──────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼─────┐          ┌───────────▼──────┐
   │  Vercel  │          │  External APIs   │
   │  Cron    │          │  ├─ Google Trends│
   │  (Jobs)  │          │  ├─ Twitter/X    │
   └──────────┘          │  ├─ Reddit       │
                         │  └─ Product Hunt │
                         └──────────────────┘
```

### Component Responsibilities

| Component         | Role                                                  | Technology                                                |
| ----------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| **Frontend**      | UI rendering, state management, user interactions     | React 18, Next.js App Router, Zustand, TanStack Query     |
| **API Layer**     | Request handling, authentication, data aggregation    | Next.js API routes, Zod validation, JWT middleware        |
| **Database**      | Persistent data storage, user data, trends, favorites | PostgreSQL (Supabase), Prisma ORM, RLS policies           |
| **Cache Layer**   | API response caching, rate limit tracking             | Redis (TTL-based, 6-hour freshness)                       |
| **Job Queue**     | Scheduled trend updates, aggregation logic            | Vercel Cron (6-hour intervals)                            |
| **External APIs** | Trend data sources                                    | Google Trends, Twitter/X API v2, Reddit API, Product Hunt |
| **Monitoring**    | Error tracking, analytics, performance                | Sentry, PostHog, Vercel Analytics                         |
| **CDN**           | Static asset delivery                                 | Vercel CDN (included with Vercel hosting)                 |

### Data Flow

1. **User Action** → Frontend captures user intent (nicho selection, filtering, bookmarking)
2. **API Call** → Frontend calls Next.js API route with auth token
3. **Validation** → Backend validates JWT + input using Zod schemas
4. **Cache Check** → Checks Redis for cached trend data
5. **Cache Hit** → Return cached data if available and fresh (TTL not expired)
6. **Cache Miss** → Fetch from external APIs (Google Trends, Twitter/X, Reddit)
7. **Aggregation** → Combine multi-source data, calculate weighted scores
8. **Database** → Store trends in PostgreSQL, update cache in Redis
9. **Response** → Return aggregated data to frontend
10. **UI Render** → Frontend renders trends, user sees results

---

## 2. Technology Stack Validation

### Frontend Stack ✅

| Layer             | Technology                   | Rationale                                                                                         |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| **Framework**     | Next.js 16+ (App Router)     | ✅ SSR + Static Generation + API routes = full-stack in one framework; Vercel deployment built-in |
| **UI Library**    | React 18+                    | ✅ Latest features (Suspense, streaming); strong ecosystem                                        |
| **Language**      | TypeScript                   | ✅ Type safety prevents runtime errors; better DX; enterprise standard                            |
| **Styling**       | Tailwind CSS                 | ✅ Utility-first, minimalista aesthetic, WCAG AA compliant out-of-box                             |
| **State Mgmt**    | Zustand                      | ✅ Lightweight (2KB), simple API, no boilerplate vs Redux; perfect for MVP                        |
| **Data Fetching** | TanStack Query (React Query) | ✅ Server state management, caching, refetching, deduplication built-in                           |
| **Forms**         | React Hook Form + Zod        | ✅ Minimal re-renders, excellent validation, shared types with backend                            |
| **Components**    | Radix UI / Headless UI       | ✅ Accessible, unstyled (full design control), WAI-ARIA compliant                                 |
| **Animation**     | Tailwind CSS / Framer Motion | ✅ Smooth transitions (0.2-0.3s), CSS-in-JS where needed                                          |

**Validation:** Suitable for MVP + enterprise scaling. Stack is proven in production apps at scale. Learning curve is moderate (familiar to most React developers).

### Backend Stack ✅

| Layer              | Technology            | Rationale                                                                                           |
| ------------------ | --------------------- | --------------------------------------------------------------------------------------------------- |
| **API Framework**  | Next.js API routes    | ✅ Monolithic initially (fast MVP), serverless (scales automatically)                               |
| **Database**       | PostgreSQL (Supabase) | ✅ Relational, proven, excellent for structured data; Supabase = managed + RLS                      |
| **ORM**            | Prisma                | ✅ Type-safe queries, auto-migrations, supports Postgres fully                                      |
| **Authentication** | Supabase Auth         | ✅ Built-in JWT, integrates with Postgres RLS, no separate service needed                           |
| **Validation**     | Zod                   | ✅ Schema validation at API boundary, shared types with frontend (TypeScript)                       |
| **Caching**        | Redis                 | ✅ In-memory, fast, supports TTL (exact need for 6-hour freshness)                                  |
| **Job Queue**      | Vercel Cron           | ✅ Serverless, no infrastructure to manage, integrated with Vercel, adequate for MVP frequency (6h) |

**Validation:** Monolithic is correct for MVP (simpler than microservices). Supabase reduces operational burden vs self-managed Postgres. Vercel Cron is ideal for scheduled tasks at MVP scale.

**Future Migration Path:** If monetization requires real-time updates or complex data pipelines, can graduate to Bull (Redis queue) + dedicated Node worker in Phase 2.

### Infrastructure Stack ✅

| Layer                | Technology                 | Rationale                                                                      |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------ |
| **Hosting**          | Vercel                     | ✅ Next.js native, auto-scaling, built-in CDN, cost-effective for MVP          |
| **Database Hosting** | Supabase (AWS managed)     | ✅ Managed PostgreSQL, automated backups, RLS for multi-tenancy                |
| **Cache Hosting**    | Upstash (Serverless Redis) | ✅ Serverless, pay-per-use, no container management, integrates with Vercel    |
| **Monitoring**       | Sentry + PostHog           | ✅ Sentry = error tracking; PostHog = product analytics (both have free tiers) |
| **Version Control**  | GitHub                     | ✅ Industry standard, integrates with Vercel CI/CD                             |
| **CI/CD**            | GitHub Actions             | ✅ Built-in, no additional services, lint + tests + deploy                     |

**Validation:** Zero-operations approach suitable for lean team. All services have generous free tiers for MVP. Can scale to millions of requests without code changes (serverless auto-scales).

### Bottleneck Analysis & Mitigation

| Potential Bottleneck             | Impact                                         | Mitigation                                                                        |
| -------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| **External API Rate Limits**     | Twitter/X (450 req/15min), Reddit (60 req/min) | 6-hour Redis cache + batch fetching during cron jobs                              |
| **Google Trends Unofficial API** | Unstable, may change                           | Implement fallback to Twitter/X trends; monitor for changes                       |
| **Database Connection Limit**    | PostgreSQL max connections                     | Vercel's serverless functions share connection pool via Prisma                    |
| **Cold Start Latency**           | First request slow (~1-2s)                     | Insignificant for trend updates (6-hour intervals); within NFR <2s on warm starts |
| **Concurrent Users**             | 10k+ simultaneous users                        | Vercel auto-scales; Supabase Connection Pooling; Redis handles cache throughput   |

**Result:** Stack is production-ready for MVP with clear scaling path.

---

## 3. API Integration Architecture

### External API Strategy

#### 3.1 Google Trends API

**Approach:** Unofficial API via `google-trends-api` or `pytrends` wrapper
**Rate Limit:** ~5 requests per second per IP (soft limit)
**Update Frequency:** Every 6 hours (Vercel Cron)

```
GET /api/trends/[nicho]?source=google
  ├─ Check Redis cache (TTL 6h)
  ├─ If hit → return cached data
  └─ If miss:
     ├─ Fetch from Google Trends
     ├─ Parse results (title, growth%, date)
     ├─ Store in Redis (TTL 6h)
     └─ Return to frontend
```

**Retry Logic:**

- Max 3 attempts with exponential backoff (1s → 2s → 4s)
- If all fail, return stale data from cache with `staleness_warning` flag
- Log failure in Sentry for monitoring

**Risk:** Unofficial API may break if Google changes. **Mitigation:** Monitor API status; fallback to Twitter/X trends if unavailable.

#### 3.2 Twitter/X API v2

**Endpoint:** `https://api.twitter.com/2/tweets/search/recent`
**Rate Limit:** 450 requests per 15-minute window
**Authentication:** Bearer Token (OAuth 2.0)
**Update Frequency:** Every 6 hours

```
GET /api/trends/[nicho]?source=twitter
  ├─ Build query: nicho keywords + exclude retweets + recent
  ├─ Check Redis cache (TTL 6h)
  ├─ Fetch from Twitter API (max 100 tweets per request)
  ├─ Extract hashtags, @mentions, engagement metrics
  ├─ Calculate growth% based on tweet velocity
  ├─ Cache in Redis
  └─ Return to frontend
```

**Rate Limiting Strategy:**

- Track request count per 15-minute window
- If approaching limit, defer next fetch to next cron cycle
- Use Upstash Redis to persist counter with 15-minute TTL

#### 3.3 Reddit API

**Endpoint:** `https://oauth.reddit.com/r/[subreddit]/hot`
**Rate Limit:** 60 requests per minute
**Authentication:** OAuth 2.0 (app credentials)
**Update Frequency:** Every 6 hours

```
GET /api/trends/[nicho]?source=reddit
  ├─ Map nicho → relevant subreddits
  ├─ Fetch top posts from each subreddit
  ├─ Extract post title, upvotes, comments
  ├─ Calculate upvote velocity = growth%
  ├─ Cache in Redis (TTL 6h)
  └─ Return to frontend
```

**Subreddit Mapping:**

```javascript
const nichoSubredditMap = {
  "marketing-digital": ["marketing", "MarketingAutomation", "DigitalMarketing"],
  ia: ["MachineLearning", "LanguageModels", "ArtificialIntelligence"],
  moda: ["fashion", "streetwear", "FashionReps"],
  startups: ["startups", "Entrepreneur", "smallbusiness"],
  cripto: ["cryptocurrency", "Bitcoin", "ethereum"],
  fitness: ["fitness", "bodyweightfitness", "Fitness"],
};
```

#### 3.4 Product Hunt API

**Endpoint:** `https://api.producthunt.com/v2/posts`
**Rate Limit:** 480 requests per day
**Authentication:** Bearer Token
**Update Frequency:** Daily (1 additional cron job)

```
GET /api/trends/[nicho]?source=producthunt
  ├─ Filter by category tags
  ├─ Sort by upvote count (daily)
  ├─ Map upvotes → growth%
  ├─ Cache in Redis (TTL 24h, longer freshness)
  └─ Return to frontend
```

### Aggregation Logic (Multi-Source)

**Score Calculation:**

```javascript
const calculateGlobalScore = (googleScore, twitterScore, redditScore) => {
  // Weighted average: Google 40%, Twitter 35%, Reddit 25%
  return googleScore * 0.4 + twitterScore * 0.35 + redditScore * 0.25;
};

// Growth% by source
const googleGrowth = (current_searches / baseline_searches) * 100 - 100;
const twitterGrowth =
  (current_tweets_per_hour / baseline_tweets_per_hour) * 100 - 100;
const redditGrowth =
  (current_upvotes_per_hour / baseline_upvotes_per_hour) * 100 - 100;
```

**Ranking:**

- Trends ranked by global score descending
- Ties broken by recency (most recent first)
- Visual indicator: 🔥 🔥 🔥 (3 flames) if global score > 200%

### Error Handling & Fallback

```javascript
async function fetchTrendsWithFallback(
  nicho,
  sources = ["google", "twitter", "reddit"],
) {
  const cachedData = await redis.get(`trends:${nicho}`);
  if (cachedData && !isStale(cachedData)) {
    return cachedData;
  }

  let results = {};

  for (const source of sources) {
    try {
      results[source] = await fetchFromAPI(source, nicho, (maxRetries = 3));
    } catch (error) {
      logger.error(`Failed to fetch from ${source}:`, error);
      sentry.captureException(error);

      // Fallback: use cached data if available (even if stale)
      const staleData = await redis.get(`trends:${nicho}:${source}:stale`);
      if (staleData) {
        results[source] = { ...staleData, isStale: true };
      } else {
        results[source] = null;
      }
    }
  }

  // Aggregate available sources
  const aggregated = aggregateTrends(results);
  await redis.setex(`trends:${nicho}`, 6 * 3600, aggregated); // 6-hour TTL

  return aggregated;
}
```

---

## 4. Database Schema Design

### Entity Relationship Diagram (ERD)

```
┌──────────────────┐
│      users       │
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ password_hash    │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │
         │ 1:N
         │
         ├─────────────────┐
         │                 │
    ┌────▼─────────┐  ┌────▼─────────────┐
    │  favorites   │  │  refresh_tokens  │
    ├──────────────┤  ├──────────────────┤
    │ id (PK)      │  │ id (PK)          │
    │ user_id (FK) │  │ user_id (FK)     │
    │ trend_id (FK)│  │ token_hash       │
    │ saved_at     │  │ expires_at       │
    └──────────────┘  │ created_at       │
         │            └──────────────────┘
         │ N:M
         │
    ┌────▼──────────────────┐
    │     trends            │
    ├───────────────────────┤
    │ id (PK)               │
    │ title                 │
    │ description           │
    │ nicho                 │
    │ source (google|twitter│reddit|producthunt)
    │ growth_percent        │
    │ global_score          │
    │ rank_position         │
    │ detected_at           │
    │ created_at            │
    └───────────────────────┘

┌─────────────────────────┐
│   cache_metadata        │
├─────────────────────────┤
│ id (PK)                 │
│ api_source              │
│ nicho                   │
│ last_fetched_at         │
│ ttl_expires_at          │
│ cache_status (hit|miss) │
│ response_time_ms        │
└─────────────────────────┘
```

### DDL (Data Definition Language)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Refresh tokens (for JWT rotation)
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Trends table
CREATE TABLE trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  nicho VARCHAR(50) NOT NULL,
  source VARCHAR(50) NOT NULL, -- 'google', 'twitter', 'reddit', 'producthunt'
  growth_percent FLOAT NOT NULL,
  global_score FLOAT, -- weighted aggregate score
  rank_position INT,
  detected_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(title, nicho, source, detected_at)
);

CREATE INDEX idx_trends_nicho ON trends(nicho);
CREATE INDEX idx_trends_created_at ON trends(created_at DESC);
CREATE INDEX idx_trends_global_score ON trends(global_score DESC);

-- Favorites (bookmarks)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, trend_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_saved_at ON favorites(saved_at DESC);

-- Cache metadata tracking
CREATE TABLE cache_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_source VARCHAR(50) NOT NULL,
  nicho VARCHAR(50),
  last_fetched_at TIMESTAMPTZ NOT NULL,
  ttl_expires_at TIMESTAMPTZ NOT NULL,
  cache_status VARCHAR(20), -- 'hit', 'miss'
  response_time_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cache_metadata_api_source ON cache_metadata(api_source);
CREATE INDEX idx_cache_metadata_ttl_expires ON cache_metadata(ttl_expires_at);

-- Row-Level Security (Supabase)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only view their own data
CREATE POLICY users_own_data ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY favorites_own_data ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY favorites_insert_own ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY favorites_delete_own ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Trends are public (no RLS)
ALTER TABLE trends DISABLE ROW LEVEL SECURITY;
```

### Migration Strategy

**Prisma Migrations:**

1. Initial schema: `001_initial_schema.sql`
2. Add indexes: `002_add_performance_indexes.sql`
3. Enable RLS: `003_enable_rls_policies.sql`

**Deployment:**

- Run `prisma migrate deploy` during Vercel build
- Automatic rollback if migration fails
- Zero-downtime deployments (compatible migrations)

---

## 5. Caching Strategy

### Redis Architecture

**Upstash Serverless Redis** (Vercel-native)

```
┌─────────────────────────────────────────────────────┐
│                  Redis Cache                        │
├─────────────────────────────────────────────────────┤
│ Key Structure: trends:{nicho}:{source}:{timestamp}  │
│ TTL: 6 hours (21,600 seconds)                       │
│ Value: JSON (title, growth%, rank, detected_at)    │
└─────────────────────────────────────────────────────┘
```

**Cache Keys:**

```javascript
// Primary cache: aggregated trends by nicho
key: `trends:${nicho}`
value: { trends: [...], timestamp: Date, metadata: {...} }
ttl: 6 * 3600 // 6 hours

// Per-source cache (for debugging/fallback)
key: `trends:${nicho}:${source}`
value: { trends: [...], source, timestamp }
ttl: 6 * 3600

// Stale data fallback
key: `trends:${nicho}:${source}:stale`
value: { ...previousData, staleness: true }
ttl: 24 * 3600 // 24 hours

// Rate limit tracking (Twitter/X)
key: `ratelimit:twitter:${windowStart}`
value: request_count
ttl: 15 * 60 // 15 minutes
```

### Cache Invalidation

**Strategy:** TTL-based (lazy expiration)

```javascript
// On cron job execution (every 6 hours)
const invalidateCache = async (nicho) => {
  const redisKeys = await redis.keys(`trends:${nicho}*`);
  await redis.del(...redisKeys);
  // New fetch will repopulate cache
};
```

**Manual Invalidation (Admin):**

```javascript
POST / api / admin / cache / invalidate;
body: {
  nicho: "ia";
}
// Requires admin auth token
```

### Cache Hit/Miss Metrics

**Monitoring:**

```javascript
const cacheMetrics = {
  hitRate: (totalHits / (totalHits + totalMisses)) * 100,
  avgResponseTime: {
    cachHit: 50, // ms (Redis response)
    cacheMiss: 2000, // ms (API fetch + aggregate)
  },
};

// Log to PostHog
posthog.track("cache_operation", {
  status: "hit" | "miss",
  nicho,
  source,
  responseTimeMs,
  timestamp,
});
```

**Dashboard (in PostHog):**

- Cache hit rate trend (daily)
- Average response time by source
- Failure rate per API

### Fallback Logic

If Redis is unavailable:

```javascript
try {
  const cached = await redis.get(key);
  if (cached) return cached;
} catch (error) {
  // Redis error, proceed to direct fetch
  logger.warn("Redis unavailable, fetching directly");
}

// Direct fetch without cache
const fresh = await fetchFromAPIs();
return fresh;
```

---

## 6. Authentication & Authorization Flow

### JWT Architecture

**Token Structure:**

```javascript
// Access Token (15 minutes)
{
  sub: user_id,
  email: user@example.com,
  iat: 1677000000,
  exp: 1677000900,
  aud: 'trends-platform'
}

// Refresh Token (7 days, rotated on use)
{
  sub: user_id,
  type: 'refresh',
  iat: 1677000000,
  exp: 1677604800,
  jti: unique_token_id
}
```

**Implementation:** Supabase Auth (JWT built-in)

### Registration Flow

```
1. POST /api/auth/register
   └─ Validate email format + password strength (min 8 chars)
   └─ Check email not already registered
   └─ Hash password with bcrypt (rounds: 10)
   └─ Create user in Postgres
   └─ Return { access_token, refresh_token }

2. Email verification (optional, omit for MVP)
```

### Login Flow

```
1. POST /api/auth/login
   └─ Validate email + password
   └─ Find user by email
   └─ Compare password hash with bcrypt
   └─ If match:
      ├─ Generate access token (15 min)
      ├─ Generate refresh token (7 days)
      ├─ Store refresh token hash in DB
      └─ Return { access_token, refresh_token, expiresIn: 900 }
   └─ If no match:
      └─ Return 401 Unauthorized (don't reveal if email exists)
```

### Protected Routes Middleware

```javascript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = verifyJWT(token)
    request.user = decoded
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

// Apply to: /api/favorites/*, /api/user/*, /api/settings/*
export const config = {
  matcher: ['/api/favorites/:path*', '/api/user/:path*', '/api/settings/:path*']
}
```

### Token Refresh Flow

```
1. POST /api/auth/refresh
   └─ Take refresh token from body
   └─ Verify token signature
   └─ Check token not in blacklist (revoked)
   └─ Rotate: Issue new refresh token + new access token
   └─ Return { access_token, refresh_token, expiresIn: 900 }

2. Frontend updates localStorage with new tokens
```

### Password Reset Flow

```
1. POST /api/auth/forgot-password
   └─ Accept email
   └─ Generate reset token (32-char random)
   └─ Store reset token hash in DB with 1-hour expiry
   └─ Send email with reset link
   └─ Return { message: 'Check your email' }

2. GET /api/auth/reset-password?token=xxx
   └─ Validate token exists and not expired
   └─ Return { valid: true }

3. POST /api/auth/reset-password
   └─ Accept { token, new_password }
   └─ Validate token + new password
   └─ Hash new password
   └─ Update user.password_hash
   └─ Delete reset token
   └─ Return { message: 'Password reset successfully' }
```

### CORS Policy

```javascript
// api/middleware.ts
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};
```

**Allowed origins:**

- Development: `http://localhost:3000`
- Production: `https://trends-platform.vercel.app`

### Rate Limiting

**Strategy:** Sliding window via Redis

```javascript
const rateLimit = async (userId: string, limit = 100, windowSecs = 60) => {
  const key = `ratelimit:${userId}:${Math.floor(Date.now() / 1000)}`
  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, windowSecs)
  }

  if (count > limit) {
    return { allowed: false, retryAfter: windowSecs }
  }

  return { allowed: true }
}

// Per route
app.use((req, res, next) => {
  const userId = req.user?.id
  const { allowed, retryAfter } = await rateLimit(userId)

  if (!allowed) {
    res.status(429).json({ error: 'Too many requests' })
    res.set('Retry-After', retryAfter)
  } else {
    next()
  }
})
```

---

## 7. Job Queue Design

### Vercel Cron Configuration

**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-trends",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Trigger:** Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)

### Cron Job Implementation

```javascript
// api/cron/fetch-trends.ts
export async function GET(request: NextRequest) {
  // Verify request is from Vercel
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const nichos = ['marketing-digital', 'ia', 'moda', 'startups', 'cripto', 'fitness']

    const results = await Promise.allSettled(
      nichos.map(nicho => fetchAndAggregateTrends(nicho))
    )

    // Log results
    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ Fetched ${nichos[idx]}: ${result.value.trendsCount} trends`)
      } else {
        console.error(`❌ Failed ${nichos[idx]}:`, result.reason)
        sentry.captureException(result.reason)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cron job completed',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    sentry.captureException(error)
    return NextResponse.json(
      { error: 'Cron job failed', message: error.message },
      { status: 500 }
    )
  }
}
```

### Job Structure

```javascript
const fetchAndAggregateTrends = async (nicho: string) => {
  const sources = ['google', 'twitter', 'reddit'] // Skip Product Hunt (daily only)
  const trends = []

  // Fetch from all sources in parallel
  const sourceResults = await Promise.allSettled(
    sources.map(source => fetchFromAPI(source, nicho))
  )

  // Aggregate results
  sourceResults.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      trends.push(...result.value)
    } else {
      logger.error(`${sources[idx]} failed:`, result.reason)
    }
  })

  // Deduplicate + calculate global score
  const aggregated = aggregateTrends(trends)

  // Store in database
  await prisma.trend.createMany({
    data: aggregated,
    skipDuplicates: true
  })

  // Update cache
  await redis.setex(
    `trends:${nicho}`,
    6 * 3600,
    JSON.stringify(aggregated)
  )

  return { nicho, trendsCount: aggregated.length }
}
```

### Error Handling & Retry

**Max Retries:** 3 per API per nicho

```javascript
const fetchWithRetry = async (apiName: string, nicho: string, maxRetries = 3) => {
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callAPI(apiName, nicho)
    } catch (error) {
      lastError = error
      const delay = Math.pow(2, attempt - 1) * 1000 // exponential backoff
      console.warn(`${apiName} attempt ${attempt} failed, retrying in ${delay}ms`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}
```

### Monitoring & Logging

**Log Entry:**

```json
{
  "timestamp": "2026-02-26T12:00:00Z",
  "jobName": "fetch-trends",
  "status": "success",
  "nicho": "ia",
  "sources": {
    "google": { "trendsCount": 50, "duration_ms": 1200, "status": "success" },
    "twitter": { "trendsCount": 45, "duration_ms": 800, "status": "success" },
    "reddit": { "trendsCount": 30, "duration_ms": 600, "status": "success" }
  },
  "totalTrends": 125,
  "deduplicatedTrends": 95,
  "duration_ms": 2600
}
```

**Alerts (Sentry):**

- If all sources fail for a nicho → CRITICAL
- If 2+ sources fail → WARNING
- If cron job timeout (>60 seconds) → WARNING

---

## 8. Performance & Scalability Plan

### Performance Targets

| Metric                             | Target  | Current Risk     | Mitigation                          |
| ---------------------------------- | ------- | ---------------- | ----------------------------------- |
| **First Contentful Paint (FCP)**   | < 1.5s  | Network latency  | Next.js SSG for home, streaming API |
| **Largest Contentful Paint (LCP)** | < 2.5s  | API latency      | Redis cache (50ms hit)              |
| **Cumulative Layout Shift (CLS)**  | < 0.1   | Skeleton loaders | Use CSS Grid with fixed heights     |
| **Time to Interactive (TTI)**      | < 3.5s  | JS parsing       | Code splitting + dynamic imports    |
| **API Response Time**              | < 500ms | Database queries | Indexes on (nicho, created_at)      |

### Frontend Optimization

**Code Splitting:**

```javascript
// Dynamic imports for modular bundle
const TrendDetail = dynamic(() => import("@/components/TrendDetail"), {
  loading: () => <Skeleton />,
});
```

**Image Optimization:**

```javascript
// Next.js Image component auto-optimizes
import Image from "next/image";

<Image
  src="/niche-icon.svg"
  alt="AI Niche"
  width={80}
  height={80}
  priority={true} // LCP image
/>;
```

**CSS:**

- Tailwind CSS (minified ~15KB gzipped)
- Critical CSS inlined in `<head>`
- Lazy-load non-critical styles

### Backend Optimization

**Database Query Optimization:**

```sql
-- Efficient query for trends list with pagination
SELECT id, title, growth_percent, global_score, detected_at, rank_position
FROM trends
WHERE nicho = $1 AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY global_score DESC
LIMIT 50 OFFSET $2;

-- Uses index: (nicho, created_at DESC)
```

**Connection Pooling:**

```javascript
// Prisma auto-manages connection pool via Supabase
// Max 5 connections per Vercel function (serverless limit)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // includes ?schema=public
    },
  },
});
```

**API Response Compression:**

```javascript
// Next.js auto-enables gzip for responses > 1KB
// Manual for specific routes:
import compression from "compression";
app.use(compression());
```

### Scalability

**Concurrent Users: 10,000+ simultaneous**

| Layer                    | Capacity                      | Scaling                                 |
| ------------------------ | ----------------------------- | --------------------------------------- |
| **Frontend (CDN)**       | Unlimited                     | Vercel CDN auto-scales globally         |
| **Backend (Serverless)** | 1000s of concurrent functions | Vercel auto-scales containers           |
| **Database (Postgres)**  | 100 concurrent connections    | Supabase Connection Pooling (pgBouncer) |
| **Cache (Redis)**        | 10k ops/sec                   | Upstash auto-scales (pay-per-request)   |

**Traffic Burst Handling:**

- Cron job (fetch trends) runs off-peak (6h intervals)
- Cache prevents thundering herd (all users get cached data)
- Rate limiting prevents abuse

**Future Scaling (Post-MVP):**

- If API become bottleneck: Add dedicated Node workers on Railway
- If database becomes bottleneck: Add read replicas (Supabase Pro tier)
- If real-time needed: Add Socket.IO server for WebSocket updates

---

## 9. Security Architecture

### Defense in Depth

```
┌──────────────────────────────────────┐
│ 1. Network Security (HTTPS/TLS)      │
└──────────────┬───────────────────────┘
┌──────────────▼───────────────────────┐
│ 2. Authentication (JWT + Refresh)    │
└──────────────┬───────────────────────┘
┌──────────────▼───────────────────────┐
│ 3. Authorization (RLS + RBAC)        │
└──────────────┬───────────────────────┘
┌──────────────▼───────────────────────┐
│ 4. Input Validation (Zod schemas)    │
└──────────────┬───────────────────────┘
┌──────────────▼───────────────────────┐
│ 5. API Security (Rate limiting, CORS)│
└──────────────┬───────────────────────┘
┌──────────────▼───────────────────────┐
│ 6. Data Security (Encryption at rest)│
└──────────────────────────────────────┘
```

### 1. Network Security

**HTTPS Enforcement:**

```javascript
// Vercel auto-redirects HTTP → HTTPS
// Add security headers
app.use((req, res, next) => {
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'",
  );
  next();
});
```

**TLS Certificate:** Let's Encrypt (auto-renewed by Vercel)

### 2. Authentication

**Password Security:**

```javascript
// bcrypt with 10 rounds (default)
const hashedPassword = await bcrypt.hash(password, 10);

// Verification
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

**Token Security:**

- Signed with RS256 (asymmetric, Supabase handles keys)
- Stored in localStorage (httpOnly not possible with SPA)
- Sent in Authorization header (not cookies, prevents CSRF)

### 3. Authorization

**Row-Level Security (Supabase RLS):**

- Users can only view their own data
- All trends queries are public (no user isolation)
- Favorites filtered by user_id

**API Authorization:**

```javascript
// Middleware: verify JWT + extract user_id
const protected = async (req: NextRequest, handler) => {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = verifyJWT(token)
  return handler(req, user) // Pass user to handler
}
```

### 4. Input Validation

**Zod Schemas:**

```javascript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password } = loginSchema.parse(body) // Throws if invalid
  // ... proceed
}
```

**Validation Everywhere:**

- Frontend: React Hook Form + Zod (UX feedback)
- Backend: Zod (security, data integrity)
- Database: Prisma types (type safety)

### 5. API Security

**Rate Limiting (per user, per IP):**

- 100 requests / minute per authenticated user
- 20 requests / minute per IP (unauthenticated)
- 1000 requests / hour per API source (cron job)

**CORS:**

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

**SQL Injection Prevention:**

- Prisma ORM parameterizes all queries (not vulnerable)
- Never concatenate user input into SQL

### 6. Data Security

**At Rest:**

- Supabase encrypts data at rest (AWS managed keys)
- Passwords hashed with bcrypt
- Sensitive config in environment variables

**In Transit:**

- HTTPS / TLS 1.2+
- API requests over HTTPS only
- No sensitive data in URLs or logs

**Data Retention:**

- User data: kept until account deletion
- Trends data: kept for 90 days (then archived)
- Logs: kept for 30 days (Vercel)
- Cron job logs: sent to Sentry (30-day retention)

---

## 10. Monitoring & Error Handling

### Monitoring Stack

**Tools:**

- **Sentry** (errors, exceptions, performance)
- **PostHog** (product analytics, feature flags)
- **Vercel Analytics** (Web Vitals, performance)

### Sentry Configuration

```javascript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event, hint) {
    // Filter out low-impact errors
    if (event.exception) {
      const error = hint.originalException;
      if (error.message.includes("Network")) {
        return null; // Don't send network errors
      }
    }
    return event;
  },
});
```

### Error Handling

**API Errors:**

```javascript
// Graceful error responses
const handleError = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
  }

  // Unknown error
  const errorId = generateErrorId()
  sentry.captureException(error, { tags: { errorId } })
  return NextResponse.json(
    { error: 'Internal server error', errorId },
    { status: 500 }
  )
}
```

**Frontend Errors:**

```javascript
// Toast notifications (top-right, auto-dismiss)
import { toast } from "sonner"; // or react-toastify

try {
  await loginUser(email, password);
  toast.success("Logged in successfully");
} catch (error) {
  toast.error(error.message || "Login failed");
  sentry.captureException(error);
}
```

### Metrics to Monitor

**API Level:**

```javascript
const apiMetrics = {
  requestRate: "requests/sec",
  responseTime: "avg, p95, p99 latencies",
  errorRate: "HTTP 5xx %",
  rateLimitHits: "count/hour",
};
```

**Cache Level:**

```javascript
const cacheMetrics = {
  hitRate: "cache hits / total requests %",
  evictionRate: "TTL expirations/hour",
  responseTime: "Redis get latency (ms)",
};
```

**Job Queue:**

```javascript
const jobMetrics = {
  execTime: "cron job duration (seconds)",
  successRate: "successful fetches / total attempts %",
  apiFailuresBySource: "count per source",
};
```

**Database:**

```javascript
const dbMetrics = {
  queryTime: "avg query latency (ms)",
  connectionPoolUsage: "active connections / max",
  rowCount: "trends table size",
};
```

**Frontend:**

```javascript
const webVitals = {
  LCP: "Largest Contentful Paint",
  FID: "First Input Delay",
  CLS: "Cumulative Layout Shift",
};
```

### PostHog Events to Track

```javascript
// User engagement
posthog.track("nicho_selected", { nicho, timestamp });
posthog.track("trend_viewed", { trendId, source, timestamp });
posthog.track("trend_bookmarked", { trendId, action: "add" | "remove" });
posthog.track("filter_applied", { filterType, filterValue });

// Performance
posthog.track("api_call", { endpoint, duration_ms, statusCode });
posthog.track("cache_hit", { source, hitRate });

// Auth
posthog.track("user_registered", { email_domain });
posthog.track("user_logged_in", { email_domain });
```

---

## 11. Deployment Pipeline

### Repository Structure

```
trends-platform/
├── apps/
│   └── web/                    # Next.js app
│       ├── app/                # App Router
│       ├── pages/              # Legacy routes (if any)
│       ├── api/                # API routes
│       ├── components/         # React components
│       ├── lib/                # Utilities
│       ├── public/             # Static assets
│       └── styles/             # Global CSS
├── packages/
│   ├── shared-types/           # TypeScript interfaces (shared)
│   └── utils/                  # Shared utilities
├── docs/
│   ├── prd.md                  # Product requirements
│   ├── architecture/           # THIS FILE
│   └── design/                 # Design system
├── .github/workflows/          # CI/CD
├── vercel.json                 # Vercel config (cron jobs, env)
├── next.config.js              # Next.js config
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── .env.example                # Environment variables template
└── README.md                   # Setup instructions
```

### Deployment Process

**Stage 1: Development**

```bash
npm run dev
# Runs on http://localhost:3000
# Hot reload enabled
```

**Stage 2: Build**

```bash
npm run build
# Outputs .next/ directory
# Optimizes for production
```

**Stage 3: Testing (CI/CD)**

```bash
# Automated on every push to GitHub
npm run lint          # ESLint
npm run typecheck     # tsc
npm run test          # Jest + Playwright
```

**Stage 4: Deployment**

```bash
git push origin main
# → GitHub Actions runs tests
# → If tests pass, Vercel auto-deploys
# → New URL: https://trends-platform-{commit}.vercel.app (preview)
# → Merge to main: https://trends-platform.vercel.app (production)
```

### Environment Variables

**Development (.env.local):**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Auth
NEXTAUTH_SECRET=xxxxx
NEXTAUTH_URL=http://localhost:3000

# External APIs
GOOGLE_TRENDS_API_KEY=xxxxx (if required)
TWITTER_BEARER_TOKEN=xxxxx
REDDIT_CLIENT_ID=xxxxx
REDDIT_CLIENT_SECRET=xxxxx
PRODUCTHUNT_API_TOKEN=xxxxx

# Cache
UPSTASH_REDIS_REST_URL=xxxxx
UPSTASH_REDIS_REST_TOKEN=xxxxx

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=xxxxx
NEXT_PUBLIC_POSTHOG_KEY=xxxxx

# Cron
CRON_SECRET=xxxxx
```

**Production (Vercel Env):**

- Same variables, scoped to production
- Secrets managed via Vercel UI (encrypted)
- Auto-deployed on merge to main

### Rollback Strategy

**If production breaks:**

1. Revert commit

```bash
git revert HEAD
git push origin main
```

2. Vercel auto-detects revert commit
3. Re-deploy with previous commit
4. Investigation → Fix → Commit → Deploy

**Estimated rollback time:** < 2 minutes

---

## Summary & Key Constraints for @dev

### Critical Implementation Details

1. **Monolith Initially:** Use Next.js API routes (no separate server)
2. **JWT with Rotation:** Refresh tokens stored in DB (hashed)
3. **Redis TTL:** 6 hours EXACT (regenerate on cron job)
4. **RLS Policies:** Enable on users, favorites; disable on trends
5. **Cron Timing:** Every 6 hours = 4 jobs/day
6. **Rate Limiting:** 100 req/min per user (sliding window)
7. **CORS:** Only frontend domain allowed
8. **Error Handling:** Always return errorId + log to Sentry
9. **Input Validation:** Zod on EVERY API endpoint
10. **Code Splitting:** Dynamic imports for < 3s LCP

### Technical Debt Early Warning

**Risk 1: Google Trends Unofficial API**

- May break if Google changes terms of service
- Mitigation: Implement Twitter/X fallback; add monitoring

**Risk 2: 6-Hour Update Frequency**

- May feel stale if user refreshes multiple times/day
- Mitigation: Track "Last Updated" timestamp; phase 2 consider real-time (WebSocket)

**Risk 3: Aggregation Weights (40-35-25)**

- Subjective; may need tuning based on user feedback
- Mitigation: Make weights configurable in admin panel (post-MVP)

### Approval Checklist

- ✅ System architecture validates tech stack for MVP scale
- ✅ All 11 sections documented with implementation constraints
- ✅ API integration strategy accounts for rate limits
- ✅ Database schema supports RLS + performance requirements
- ✅ Security defense-in-depth (6 layers)
- ✅ Monitoring covers all critical paths
- ✅ Deployment automated via Vercel + GitHub Actions
- ✅ Fallback strategies for API failures + cache misses
- ✅ Performance targets aligned with NFRs
- ✅ Scalability plan covers 10k+ users

---

**Architecture Status:** ✅ **APPROVED FOR DEVELOPMENT**

**Next Phase:** @ux-design-expert (Uma) creates design system from `docs/UX-DESIGN-PROMPT.md`, then @dev (Dex) implements Epic 1.

**Architecture Document Created:** 2026-02-26
**Architect:** Aria the Visionary 🏛️

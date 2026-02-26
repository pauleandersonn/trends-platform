# Trends Platform — Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Permitir usuários descobrirem tendências por nicho em segundos, sem ruído
- Criar uma interface minimalista que centra no conteúdo essencial
- Integrar múltiplas fontes de dados (Google Trends, Twitter/X, Reddit, Product Hunt, etc)
- Oferecer filtros inteligentes (data, relevância, crescimento)
- Habilitar sistema de favoritos e bookmarks
- Fornecer insights acionáveis e resumidos por tendência

### Background Context

Tendências mudam rapidamente e consumidores enfrentam sobrecarga de informação. Plataformas genéricas de análise de tendências oferecem dados brutos e desorganizados, dificultando decisões rápidas. Existe oportunidade clara para uma ferramenta minimalista que agrega dados de múltiplas fontes, os organiza por nicho, e apresenta apenas o que importa — com design inspirado em Apple, Notion e Linear para máxima clareza.

O mercado de nicho cresceu: Marketing Digital, IA, Moda, Startups, Cripto e Fitness têm públicos específicos com necessidades distintas. Uma solução focada em nichos, não genérica, cria diferencial estratégico como ferramenta recorrente e escalável.

### Change Log

| Date       | Version | Description                                | Author |
| ---------- | ------- | ------------------------------------------ | ------ |
| 2026-02-26 | v1.0    | PRD inicial baseado em briefing do usuário | Morgan |

---

## Requirements

### Functional Requirements

**FR1:** Sistema deve permitir usuários selecionar um nicho de uma lista predefinida e visualizar tendências atualizadas automaticamente para aquele nicho

**FR2:** Tendências devem ser aggregadas de múltiplas fontes (Google Trends, Twitter/X, Reddit, Product Hunt, etc.) em uma visualização unificada

**FR3:** Usuários devem poder filtrar tendências por data (últimas 24h, 7 dias, 30 dias), relevância e crescimento

**FR4:** Sistema deve exibir ranking visual simples de cada tendência (score numérico e indicador visual de crescimento)

**FR5:** Usuários autenticados devem poder salvar tendências em favoritos/bookmarks para consulta posterior

**FR6:** Página individual de tendência deve exibir: título, descrição resumida, fontes de dados, data de detecção, crescimento percentual, insights acionáveis

**FR7:** Usuários devem poder visualizar tendências favoritas em área dedicada (Favoritos)

**FR8:** Sistema deve atualizar dados automaticamente em intervalo configurável (ex: a cada 6 horas)

**FR9:** Usuários devem poder buscar/filtrar tendências por palavra-chave

**FR10:** Sistema deve apresentar página "Sobre" com visão do projeto e diferencial

**FR11:** Sistema deve incluir autenticação (login/cadastro) para salvar preferências e favoritos

### Non-Functional Requirements

**NFR1:** Interface deve seguir design minimalista extremo (inspirado em Apple, Notion, Linear) com foco em espaço em branco e tipografia moderna

**NFR2:** Sistema deve responder a ações do usuário em <500ms (tempo de resposta aceitável para UX fluida)

**NFR3:** Página de nicho deve carregar em <2s even com conexão 3G lenta

**NFR4:** API externa deve ser cacheada para evitar rate limiting e reduzir latência

**NFR5:** Sistema deve suportar Dark Mode elegante como alternativa ao Light Mode

**NFR6:** Aplicação deve ser responsiva e funcionar perfeitamente em Desktop, Tablet e Mobile

**NFR7:** Dados de tendências devem ser atualizados sem refresh de página (WebSocket ou polling)

**NFR8:** Sistema deve escalar para suportar 10k+ usuários simultâneos sem degradação

**NFR9:** Código deve seguir padrões de qualidade enterprise (linting, testes unitários, TypeScript)

**NFR10:** Todas as chamadas para APIs externas devem ter retry logic e fallback graceful

---

## User Interface Design Goals

### Overall UX Vision

Uma interface minimalista extrema que coloca tendências em primeiro plano e remove toda fricção visual. Design inspirado em Apple (refinamento), Notion (claridade de informação) e Linear (modernidade). O usuário deve entender o valor em <3 segundos: selecionar nicho → ver tendências. Fundo claro com tipografia limpa (sans-serif moderna como Inter ou SF Pro), muito espaço em branco, zero elementos decorativos. Dark mode para noites e privacidade. Cada pixel serve propósito.

### Key Interaction Paradigms

- **One-Click Nicho Selection:** Card elegante, clicável, transição suave para tendências
- **Scroll & Explore:** Lista de tendências, scannable em segundos, cada tendência é visual + headline
- **Subtle Hover States:** Ícones aparecem apenas no hover (bookmark, compartilhar, etc)
- **Stacked Cards for Tendencies:** Minimal card design, apenas essencial (título, score visual, data, 1-line insight)
- **Inline Filtering:** Sem modal, filtros aparecem discretamente abaixo do nicho
- **Smooth Transitions:** Transições suaves entre estados (tema claro/escuro, carregamento)

### Core Screens and Views

1. **Home/Landing:** Seleção de nichos em grid 2x3 ou 3x3, hero com proposta de valor minimalista
2. **Nicho Feed:** Lista de tendências com filtros inline (data, relevância, crescimento), ordenadas por score
3. **Tendência Detail:** Full screen ou modal, mostra: título, descrição, fonte, crescimento %, insights, botão bookmark
4. **Favoritos:** Coleção pessoal, mesma estética da feed principal
5. **Login/Cadastro:** Minimalista, apenas email/password, zero campo extra
6. **Sobre:** Página estática com visão, diferencial, roadmap simples
7. **Settings:** Preferências (tema, idioma, intervalo de atualização, notificações)

### Accessibility: WCAG AA

✅ Contrastes válidos, labels em formulários, navegação por teclado completa, alt text em imagens, cores não são única forma de comunicar info

### Branding

- **Logo minimalista:** Monograma ou wordmark simples (ex: "Trends" em SF Pro, 18pt bold)
- **Paleta:** 1 cor accent (azul suave? purple? verde?) para CTA e highlights
- **Tipografia:** Inter (sans-serif moderna, gratuita) ou SF Pro
- **Ícones:** Feather Icons ou SF Symbols (minimalistas, 1.5pt stroke)
- **Espaçamento:** 8px grid system, grandes margens

### Target Device and Platforms: Web Responsive

Desktop-first, mas totalmente responsivo em tablet e mobile (touch-friendly)

---

## Technical Assumptions

### Repository Structure: Monorepo

Monorepo com estrutura modular. Permite compartilhar código entre frontend e backend (tipos TypeScript, utilities).

```
trends-app/
├── apps/
│   ├── web/              # Next.js frontend + API routes
│   └── (mobile app future)
├── packages/
│   ├── shared-types/     # Tipos TypeScript compartilhadas
│   ├── api-client/       # Client para chamar APIs externas
│   └── utils/            # Utilitários comuns
├── docs/                 # PRD, arquitetura, guias
└── .github/              # CI/CD workflows
```

### Service Architecture: Monolith (Initially)

Monolith Next.js com API routes, escalável para microservices depois. Frontend (React) + backend (Next.js API routes) em um único deploy.

**Componentes:**

- **Frontend:** React (App Router do Next.js)
- **Backend:** Next.js API routes (`/api/*`)
- **Database:** PostgreSQL (Supabase)
- **Cache Layer:** Redis (estratégico para rate limiting)
- **Job Queue:** Vercel Cron ou Bull (atualização automática)

### Testing Requirements: Full Testing Pyramid

| Layer           | Cobertura                                   | Tools                       |
| --------------- | ------------------------------------------- | --------------------------- |
| **Unit**        | Lógica crítica (utils, hooks, API handlers) | Jest, React Testing Library |
| **Integration** | Fluxos entre componentes, APIs              | Jest + MSW                  |
| **E2E**         | Jornadas do usuário                         | Playwright                  |

Objetivo: >75% cobertura crítica

### Additional Technical Assumptions

**Frontend Stack:**

- Framework: Next.js 16+ (App Router)
- UI Library: React 18+, TypeScript
- Styling: Tailwind CSS
- Component Library: Radix UI ou Headless UI
- State Management: Zustand
- Data Fetching: TanStack Query (React Query)
- Forms: React Hook Form + Zod

**Backend Stack:**

- API: Next.js API routes
- Database: PostgreSQL via Supabase
- ORM: Prisma
- Authentication: NextAuth.js ou Supabase Auth
- Validation: Zod

**External APIs & Integrations:**

- Google Trends API (unofficial)
- Twitter/X API v2
- Reddit API
- Product Hunt API
- Caching Strategy: Redis com TTL (6 horas)

**Deployment & Infrastructure:**

- Hosting: Vercel
- Database: Supabase
- Job Queue: Vercel Cron
- Monitoring: Sentry, PostHog
- Environment: Node.js 20+

**CI/CD:**

- VCS: GitHub
- CI: GitHub Actions (linting, tests, type check)
- CD: Vercel (auto-deploy on main)

---

## Epic List

### Epic 1: Foundation & Home

Estabelecer infraestrutura (project setup, CI/CD, GitHub, Vercel), autenticação básica, e home page com seleção de nichos. **Deliverable:** App rodando em Vercel, usuários podem se registrar/logar e selecionar um nicho.

### Epic 2: Feed de Tendências (Google Trends MVP)

Integrar Google Trends, exibir tendências em lista com filtros, ranking visual. **Deliverable:** Usuários veem tendências atualizadas por nicho, podem filtrar, veem ranking de crescimento.

### Epic 3: Autenticação Completa + Favoritos + Tendência Detail

Sistema robusto de auth, página individual de tendência, sistema de bookmarks. **Deliverable:** Usuários salvam tendências favoritas, acessam detalhes completos com insights.

### Epic 4: Múltiplas Fontes de Dados + Atualização Automática

Integrar Twitter/X, Reddit, Product Hunt, criar job queue para atualização automática. **Deliverable:** Dados agregados de 4 fontes, atualizados automaticamente a cada 6h.

---

## Epic 1 Details: Foundation & Home

**Objetivo:** Estabelecer infraestrutura robusta e home minimalista.

### Story 1.1: Project Setup & Infrastructure

**Como um** desenvolvedor,
**Quero** ter projeto Next.js configurado com CI/CD,
**Para que** todas as mudanças sejam validadas automaticamente.

**Acceptance Criteria:**

1. Projeto Next.js 16+ (App Router) com TypeScript, Tailwind, Zustand
2. ESLint + Prettier em pre-commit hook
3. Jest + React Testing Library configurados
4. GitHub Actions workflow (linting, typecheck, testes)
5. Vercel deployment auto-deploy em main
6. .env.example documentado
7. README com instruções
8. Estrutura: `apps/web/`, `packages/shared-types/`, `packages/utils/`

### Story 1.2: Authentication System (Register/Login)

**Como um** usuário novo,
**Quero** me registrar e fazer login com email/password,
**Para que** minhas tendências favoritas sejam salvas.

**Acceptance Criteria:**

1. Página Register: email, password, confirm, termos
2. Página Login: email, password, "Esqueci senha"
3. Validação email (formato, não duplicado)
4. Validação password (min 8 chars)
5. Hash seguro (bcrypt)
6. JWT tokens (access + refresh)
7. Refresh token rotativo
8. Logout limpa tokens
9. Protected API routes verificam JWT
10. Session persiste em localStorage
11. Redirect para login se não autenticado

### Story 1.3: Home Page & Nicho Selection

**Como um** visitante,
**Quero** ver lista de nichos e selecionar um,
**Para que** eu comece a explorar tendências imediatamente.

**Acceptance Criteria:**

1. Home minimalista com logo + proposta de valor
2. Grid de nichos (2x3/3x3): Marketing Digital, IA, Moda, Startups, Cripto, Fitness
3. Cada nicho é card clicável com ícone + nome
4. Hover state sutil
5. Click redireciona para `/trends/[nicho]`
6. Dark mode toggle funcional
7. Tipografia moderna (Inter), muito espaço em branco
8. Mobile responsivo
9. Unauthenticated users podem ver home
10. Analytics event ao selecionar nicho

---

## Epic 2 Details: Feed de Tendências

**Objetivo:** Primeira experiência de valor com Google Trends.

### Story 2.1: Google Trends Integration

**Acceptance Criteria:**

1. Endpoint `/api/trends/[nicho]` retorna Google Trends data
2. Cache por 6 horas
3. Rate limiting (max 10 req/min por IP)
4. JSON estruturado: `[{title, growth%, date, rank}]`
5. Fallback se API falhar
6. Error logging em Sentry

### Story 2.2: Trends Feed UI & Rendering

**Acceptance Criteria:**

1. Página `/trends/[nicho]` lista tendências em cards minimalistas
2. Cada card: título (bold), crescimento% (visual), data (small)
3. Ranking numérico (1º, 2º, 3º...)
4. Cards clicáveis
5. Loading state (skeleton loaders)
6. Ordenação padrão: por crescimento
7. Mobile-friendly
8. Dark mode funciona

### Story 2.3: Filters (Date, Relevance, Growth)

**Acceptance Criteria:**

1. Filtros inline abaixo título
2. Date: Last 24h | Last 7d | Last 30d
3. Sort: Growth % | Relevance | Date
4. Sem page refresh
5. URL com query params
6. Default: 24h + Growth
7. Persistem em localStorage
8. Mobile: dropdown

---

## Epic 3 Details: Auth Completa + Favoritos + Detail

**Objetivo:** Aumentar retenção com favoritos e detalhes profundos.

### Story 3.1: Tendência Detail Page

**Acceptance Criteria:**

1. Página `/trends/[nicho]/[trend-id]`
2. Conteúdo: título, descrição, crescimento%, fonte, data
3. Insight acionável (1-2 frases)
4. Back button / close
5. Share button
6. Bookmark button
7. Mobile responsivo

### Story 3.2: Favorites System

**Acceptance Criteria:**

1. Ícone bookmark (unfilled → filled)
2. Click salva trend_id no banco
3. Página `/favorites` lista favoritos do usuário
4. Persistem entre sessões
5. Unbookmark remove
6. Count de favoritos no header
7. Unauthorized redirecionam ao login

### Story 3.3: Enhanced Auth (Password Reset, Session Management)

**Acceptance Criteria:**

1. "Esqueci minha senha" link
2. Email de reset válido por 1 hora
3. Página de reset: nova password
4. Email de confirmação
5. Session timeout após 24h
6. Logout apaga refresh token

---

## Epic 4 Details: Múltiplas Fontes + Atualização Automática

**Objetivo:** Diferencial competitivo com agregação multi-fonte.

### Story 4.1: Twitter/X & Reddit Integration

**Acceptance Criteria:**

1. Dados Twitter/X API v2
2. Dados Reddit API
3. Endpoints: `/api/trends/[nicho]?sources=google,twitter,reddit`
4. Retorno unificado com "source" field
5. Deduplicação
6. Cache 4 horas
7. Rate limiting robusto
8. Fallback se uma fonte falhar

### Story 4.2: Trends Aggregation & Ranking

**Acceptance Criteria:**

1. UI mostra growth% por plataforma
2. Score consolidado (média ponderada: Google 40%, Twitter 35%, Reddit 25%)
3. Detail mostra breakdown
4. Sort por "Global Growth"
5. Visual indicator (🔥 🔥 🔥 para trending global)

### Story 4.3: Automatic Updates (Job Queue)

**Acceptance Criteria:**

1. Job queue setup (Vercel Cron ou Bull)
2. Cron a cada 6 horas: fetch, agregação, cache update
3. Logs de execução
4. Retry logic (max 3 retries)
5. Graceful failure
6. Last update timestamp na UI

---

## Next Steps

### Para @architect (Aria)

Prioridades:

1. Tech stack validation (Next.js 16, Supabase, Redis)
2. API integration architecture (Google Trends, Twitter/X, Reddit)
3. Caching strategy (Redis TTL, rate limiting)
4. Job queue design (Vercel Cron vs Bull)
5. Database schema (users, trends, favorites, cache logs)

### Para @ux-design-expert (Uma)

Prioridades:

1. Design system (minimalista, Apple-inspired, Tailwind tokens)
2. Wireframes (Home, Feed, Detail, Favorites)
3. Component library
4. Dark mode palette
5. Interaction patterns

---

**Status:** ✅ PRD Completa — Pronta para Arquitetura e Design

**Data:** 2026-02-26

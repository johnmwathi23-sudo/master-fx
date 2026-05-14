# Master FX - AI-Enhanced Trading Platform

A production-grade simulated trading platform with AI-powered assistant, real-time market data, and comprehensive admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion, Zustand, React Query |
| Backend | NestJS, Prisma ORM, PostgreSQL, Redis, Socket.IO, OpenAI API |
| Infra | Docker, NGINX, GitHub Actions CI/CD |

## Project Structure

```
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── server/       # NestJS backend
├── packages/
│   ├── ui/           # Shared UI components
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utilities
├── docker/           # Docker & NGINX configs
├── .github/          # CI/CD workflows
└── docs/             # Documentation
```

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- npm 10+

### 1. Clone & Install

```bash
git clone <repo-url> && cd master-fx
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values. Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_HOST` / `REDIS_PORT` — Redis connection
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — Random secret strings
- `OPENAI_API_KEY` — Your OpenAI API key (optional, fallback responses work without it)

### 3. Database Setup

```bash
cd apps/server
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 4. Start Development

```bash
# Terminal 1 — Backend
cd apps/server
npm run start:dev

# Terminal 2 — Frontend
cd apps/web
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### 5. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@master-fx.com | 0714534349 |
| Demo User | demo@master-fx.com | demo2026 |

## Docker Deployment

```bash
cd docker
docker compose up -d
```

This starts PostgreSQL, Redis, NestJS server, Next.js web, and NGINX reverse proxy on port 80.

## Features

- **Simulated Trading Engine** — Forex, crypto, commodities, stocks & indices
- **AI Assistant** — GPT-4o powered chat with market insights
- **Real-Time Market Data** — WebSocket price updates every 5 seconds
- **Wallet System** — Deposits, withdrawals, transaction history
- **Admin Dashboard** — User management, KYC review, analytics, CMS
- **Role-Based Access** — USER, ADMIN, SUPER_ADMIN with JWT auth
- **Referral System** — Unique codes, bonus tracking
- **KYC Verification** — Document submission & review workflow
- **Dark Fintech UI** — Glassmorphism, Framer Motion animations

## API Endpoints

| Module | Endpoint | Method | Auth |
|--------|----------|--------|------|
| Auth | `/auth/register` | POST | No |
| Auth | `/auth/login` | POST | No |
| Auth | `/auth/refresh` | POST | No |
| Auth | `/auth/profile` | GET | Yes |
| Trading | `/trading/trade` | POST | Yes |
| Trading | `/trading/positions` | GET | Yes |
| Trading | `/trading/close/:id` | POST | Yes |
| Wallet | `/wallet` | GET | Yes |
| Wallet | `/wallet/deposit` | POST | Yes |
| Wallet | `/wallet/withdraw` | POST | Yes |
| AI | `/ai/chat` | POST | Yes |
| AI | `/ai/history` | GET | Yes |
| Admin | `/admin/users` | GET | Admin |
| Admin | `/admin/kyc` | GET | Admin |
| Admin | `/admin/stats` | GET | Admin |

WebSocket: `/market` — Real-time price updates

## Scripts

```bash
# Root
npm install              # Install all workspace dependencies

# Server
cd apps/server
npm run start:dev        # Dev server with watch
npm run build            # Production build
npm run migrate          # Run Prisma migrations
npm run seed             # Seed demo data
npm run studio           # Prisma Studio

# Web
cd apps/web
npm run dev              # Next.js dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint
```

## Environment Variables

See `.env.example` for the complete list. Critical ones:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_ACCESS_SECRET` | Access token signing key | — |
| `JWT_REFRESH_SECRET` | Refresh token signing key | — |
| `OPENAI_API_KEY` | OpenAI API key (optional) | — |
| `API_PORT` | Backend server port | 4000 |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |

## License

Private — All rights reserved.

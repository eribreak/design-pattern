# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Project

TypeScript/Express 4 backend demonstrating 10 design patterns (Repository, Factory, Singleton, Strategy, Observer, Builder, Adapter, Decorator, CQRS, Circuit Breaker) at a foundational level. Compiles to CommonJS (`dist/`), runs on Node ≥ 20. Prisma 5 + PostgreSQL, Jest + ts-jest for tests, ESLint 9 flat config.

## Commands

```bash
npm install            # install deps
npm run dev            # dev server via tsx watch (port 3000)
npm run build          # tsc → dist/
npm run start          # node dist/index.js
npm run seed           # seed test data via tsx
npm run lint           # eslint .
npm run lint:fix       # eslint . --fix
npm run typecheck      # tsc --noEmit
npm test               # jest
npm run test:watch     # jest --watch
npm run test:coverage  # jest --coverage (text + lcov + html)
```

To run a single test file: `npx jest path/to/file.spec.ts`.

## Architecture

- `src/index.ts` → imports `reflect-metadata`, then `./server` (starts Express).
- `src/app.ts` — `createApp()` builds the Express app: JSON/URL-encoded middleware, `/health`, feature routes under `/api/*`, pattern-demo routes under `/patterns/*`, error handler last.
- `src/server.ts` — binds to `PORT` (default 3000).
- `src/features/{user,product,order,payment,notification}/` — MVC per domain: `routes.ts`, `{Entity}Controller.ts`, `dto.ts`, `repository.ts` (or `service.ts`).
- `src/patterns/` — one folder per pattern, each with `routes.ts` and its implementation. `factory/` has a registry (`UserFactory`, `OrderFactory`, `ProductFactory`).
- `src/shared/` — `errors.ts` (AppError hierarchy, incl. `CircuitBreakerOpenError` 503), `logger.ts` (winston), `utils.ts`.
- `src/config/index.ts` — Singleton Config.
- `src/database/client.ts` — Prisma client singleton; `seed.ts` — seed script.
- `src/middleware/error-handler.ts` — global Express error handler.
- `src/cache/` — in-memory Map-based cache (no Redis needed).
- `tests/` — `setup.ts` (global setup), spec files under `tests/{circuit-breaker,factory,repository,strategy}/`.

## Database

- Prisma schema in `prisma/schema.prisma`. **No migrations directory** — schema is applied with `npx prisma db push --accept-data-loss --skip-generate`, never `prisma migrate deploy`.
- Tests connect to a **real Postgres** via `prisma.$connect()` in `beforeAll` (no DB mocking). Local dev: `docker-compose up -d` (Postgres 16, db `design_patterns`, user/password `postgres/postgres`). `.env` sets `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/design_patterns"`.
- CI runs Postgres 16 as a service container with the same credentials.

## Testing

- `tests/setup.ts` runs before each test file.
- `npm run test:cov` generates `coverage/` (text summary + HTML + lcov).
- The Circuit Breaker tests (`tests/circuit-breaker/CircuitBreaker.spec.ts`) directly mutate internal state via `(breaker as any).state = CircuitState.OPEN` to force states — this is intentional.

## CI

`.github/workflows/ci.yml` runs on push/PR to `main`: Lint, Typecheck, Build (uploads `dist/`), Test matrix (Node 20 + 22 with Postgres 16 service container, uploads `coverage/`), and a summary status job. All must pass.

## Notes

- ESLint 9 flat config in `eslint.config.mjs` (typescript-eslint v8). Lint currently emits 19 `no-explicit-any` **warnings** (not errors) — CI passes, but reducing them is a known cleanup item.
- The repo's main branch is `main`; feature work goes on branches like `feat/add-ci`. Commit messages end with `Co-Authored-By: Claude Code <noreply@anthropic.com>`.
- `package.json` `engines.node: ">=20.0.0"`. CI uses Node 20 and 22.
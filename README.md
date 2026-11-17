# Design Patterns Backend

A TypeScript Express backend demonstrating 10 design patterns at a foundational level.

## 📚 Design Patterns Covered

| # | Pattern | Purpose |
|---|---------|---------|
| 1 | **Repository** | Data access abstraction with interfaces |
| 2 | **Factory** | Object creation with registry pattern |
| 3 | **Singleton** | Single instance management (Config, Logger) |
| 4 | **Strategy** | Payment method selection at runtime |
| 5 | **Observer** | Event-driven notifications |
| 6 | **Builder** | Complex object construction step-by-step |
| 7 | **Adapter** | Integration with external payment gateways |
| 8 | **Decorator** | Cross-cutting concerns (Logging, Caching, Metrics) |
| 9 | **CQRS** | Separate command and query handling |
| 10 | **Circuit Breaker** | Failure protection for external services |

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL (docker)
docker-compose up -d

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Seed test data
npm run seed

# 5. Start development server
npm run dev
```

Server: http://localhost:3000

## 🏗️ Project Structure

```
src/
├── app.ts           # Express app with routes
├── server.ts        # Server entry point
├── config/          # Configuration (Singleton)
├── shared/          # Utils, errors, logger
├── database/        # Prisma client, seed
├── common/          # Controllers, services
├── features/        # User, Product, Order, Payment
├── patterns/        # 10 patterns implementation
│   ├── repository/  # Repository pattern
│   ├── factory/     # Factory pattern
│   ├── singleton/   # Singleton pattern
│   ├── strategy/    # Strategy pattern
│   ├── observer/    # Observer pattern
│   ├── builder/     # Builder pattern
│   ├── adapter/     # Adapter pattern
│   ├── decorator/   # Decorator pattern
│   ├── cqrs/        # CQRS pattern
│   └── circuit-breaker/  # Circuit Breaker pattern
└── middleware/      # Error handler
```

## 📖 API Endpoints

### Core APIs
- `GET /health` — Health check
- `POST /api/users` — Create user
- `GET /api/users` — List users
- `GET /api/users/:id` — Get user by ID
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

### Pattern Demos

| Pattern | Endpoint | Description |
|---------|----------|-------------|
| Strategy | `POST /patterns/strategy/checkout` | Process payment with different strategies |
| Observer | `POST /patterns/observer/notify` | Notify multiple observers |
| Builder | `POST /patterns/builder/user|product|order` | Build entities step by step |
| Adapter | `POST /patterns/adapter/mock\|stripe\|paypal` | Use different payment gateways |
| Decorator | `GET /patterns/decorator/user/:id` | User with logging, caching, metrics |
| CQRS | `POST /patterns/cqrs/command` | Execute commands |
| CQRS | `POST /patterns/cqrs/query` | Execute queries |
| Circuit Breaker | `POST /patterns/circuit-breaker/safe-payment` | Protected external calls |
| Singleton | `GET /patterns/singleton/config\|logger` | Singleton instances |

## 🧪 Testing

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 📖 Documentation

Each pattern has detailed documentation in `docs/patterns/`:

- `01-repository.md` — Repository Pattern
- `02-factory.md` — Factory Pattern
- `03-singleton.md` — Singleton Pattern
- `04-strategy.md` — Strategy Pattern
- `05-observer.md` — Observer Pattern
- `06-builder.md` — Builder Pattern
- `07-adapter.md` — Adapter Pattern
- `08-decorator.md` — Decorator Pattern
- `09-cqrs.md` — CQRS Pattern
- `10-circuit-breaker.md` — Circuit Breaker Pattern

## 🏃 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server (tsx) |
| `npm run build` | TypeScript compilation |
| `npm run start` | Production server |
| `npm run seed` | Seed test data |
| `npm test` | Run tests |

## 🐳 Docker

```bash
docker-compose up -d postgres
```

## 🤝 Example Pattern Usage

### Strategy Pattern - Payment
```bash
curl -X POST http://localhost:3000/patterns/strategy/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": 100, "method": "CREDIT_CARD"}'
```

### Observer Pattern - Notifications
```bash
curl -X POST http://localhost:3000/patterns/observer/notify \
  -H "Content-Type: application/json" \
  -d '{"orderId": 1}'
```

## 📝 Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express 4.x
- **Language**: TypeScript 5
- **ORM**: Prisma 5
- **Database**: PostgreSQL
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Validation**: class-validator
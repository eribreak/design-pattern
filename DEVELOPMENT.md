# Development Guide

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL database
docker-compose up -d postgres

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Seed test data (optional)
npm run seed

# 6. Start development server
npm run dev
```

Server: http://localhost:3000

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with tsx watch |
| `npm run build` | Build TypeScript to dist/ |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with test data |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |

## Testing

```bash
# Run all tests
npm test

# Run specific pattern test
npx jest tests/strategy/Strategy.spec.ts
npx jest tests/circuit-breaker/CircuitBreaker.spec.ts
npx jest tests/repository/UserRepository.spec.ts
npx jest tests/factory/UserFactory.spec.ts
```

## Database Schema

Entities:
- **User**: id, email, name, age, createdAt, updatedAt
- **Product**: id, name, description, price, stock
- **Order**: id, userId, status, total
- **OrderItem**: orderId, productId, quantity, unitPrice
- **Payment**: id, userId, orderId, amount, method, status

## API Examples

### Health Check
```bash
curl http://localhost:3000/health
```

### CRUD Operations
```bash
# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","age":30}'

# List users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

### Pattern Demo Endpoints

#### Strategy Pattern - Payment
```bash
curl -X POST http://localhost:3000/patterns/strategy/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": 100, "method": "CREDIT_CARD"}'
```

#### Observer Pattern
```bash
curl -X POST http://localhost:3000/patterns/observer/notify \
  -H "Content-Type: application/json" \
  -d '{"orderId": 1}'
```

#### Builder Pattern
```bash
curl -X POST http://localhost:3000/patterns/builder/user \
  -H "Content-Type: application/json" \
  -d '{"email":"builder@test.com","name":"Builder"}'
```

#### Adapter Pattern
```bash
curl -X POST http://localhost:3000/patterns/adapter/mock \
  -H "Content-Type: application/json" \
  -d '{"amount": 50}'
```

#### Decorator Pattern
```bash
curl http://localhost:3000/patterns/decorator/user/1
curl http://localhost:3000/patterns/decorator/metrics
```

#### CQRS Pattern
```bash
# Command
curl -X POST http://localhost:3000/patterns/cqrs/command \
  -H "Content-Type: application/json" \
  -d '{"type":"CREATE_USER","email":"cqrs@test.com","name":"CQRS User"}'

# Query
curl -X POST http://localhost:3000/patterns/cqrs/query \
  -H "Content-Type: application/json" \
  -d '{"type":"GET_USER_BY_ID","id": 1}'
```

#### Circuit Breaker Pattern
```bash
curl -X POST http://localhost:3000/patterns/circuit-breaker/safe-payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'
```

#### Singleton Pattern
```bash
curl http://localhost:3000/patterns/singleton/config
```

## Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server entry point
├── index.ts                  # Bootstrap
├── config/                   # Configuration (Singleton)
├── shared/                   # Utils, errors, logger
├── database/                 # Prisma client, seed
├── features/                 # Feature controllers (user, product, order, payment)
├── patterns/                 # 10 design patterns
│   ├── repository/          # Repository pattern
│   ├── factory/             # Factory pattern
│   ├── singleton/           # Singleton pattern
│   ├── strategy/            # Strategy pattern
│   ├── observer/            # Observer pattern
│   ├── builder/             # Builder pattern
│   ├── adapter/             # Adapter pattern
│   ├── decorator/           # Decorator pattern
│   ├── cqrs/                # CQRS pattern
│   └── circuit-breaker/     # Circuit breaker pattern
└── middleware/              # Error handling
```

## Design Patterns Documentation

All pattern documentation is in `docs/patterns/`:
1. `01-repository.md`
2. `02-factory.md`
3. `03-singleton.md`
4. `04-strategy.md`
5. `05-observer.md`
6. `06-builder.md`
7. `07-adapter.md`
8. `08-decorator.md`
9. `09-cqrs.md`
10. `10-circuit-breaker.md`
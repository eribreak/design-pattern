# Repository Pattern

## What is it?

The Repository pattern mediates between domain and data mapping layers, providing a collection-like interface for accessing domain objects.

## Problem it solves

- Decouples domain/business logic from data access logic
- Provides a collection-like interface (find, add, remove, etc.)
- Enables easy testing with mock repositories
- Supports Unit of Work pattern for transactions

## Structure

```
Interface (IUserRepository)
    ↑
Repository (UserRepository)
```

## Implementation

### 1. Define Repository Interface
```typescript
export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: {...}): Promise<User>;
  update(id: number, data: {...}): Promise<User>;
  delete(id: number): Promise<void>;
}
```

### 2. Implement Repository
```typescript
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  // ... other methods
}
```

### 3. Use in Controller
```typescript
const userRepository = new UserRepository(prisma);
const user = await userRepository.findById(id);
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## Key Benefits

1. **Separation of Concerns**: Domain logic is separate from persistence logic
2. **Testability**: Easy to mock repositories for unit tests
3. **Domain Focus**: Controllers/services work with domain concepts, not database details
4. **Transaction Support**: Can combine multiple operations in a Unit of Work

## When to use

- When you need clean separation between business logic and data access
- When you want to easily swap data sources (SQL, NoSQL, API)
- When you need to mock data access in tests

## Files

- `src/patterns/repository/interfaces.ts` — Repository interfaces
- `src/patterns/repository/UserRepository.ts` — User implementation
- `src/patterns/repository/ProductRepository.ts` — Product implementation
- `src/features/user/UserController.ts` — Controller using repository
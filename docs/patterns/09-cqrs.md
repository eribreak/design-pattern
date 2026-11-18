# CQRS Pattern

## What is it?

Command Query Responsibility Segregation (CQRS) separates the collection of commands (writes) from the collection of queries (reads), using different models for read and write operations.

## Problem it solves

- Separate read and write concerns
- Optimize reads vs writes differently
- Handle high write/read traffic differently
- Use different data models for reading and writing
- Scale reads and writes independently

## Structure

```
Command Bus    Query Bus
    │               │
    ▼               ▼
Commands     Queries
    │               │
    ▼               ▼
Handlers     Handlers
```

## Implementation

### 1. Command
```typescript
// Commands are immutable, have no return value
export class CreateUserCommand implements Command {
  constructor(
    public readonly type: string = "CREATE_USER",
    public readonly email: string,
    public readonly name: string,
    public readonly age?: number
  ) {}
}
```

### 2. Query
```typescript
// Queries return data, are side-effect free
export class GetUserByIdQuery implements Query {
  constructor(
    public readonly type: string = "GET_USER_BY_ID",
    public readonly id: number
  ) {}
}
```

### 3. Command Bus
```typescript
export class CommandBus {
  private handlers = new Map<string, CommandHandler>();

  register<T extends Command>(type: string, handler: CommandHandler<T>): void {
    this.handlers.set(type, handler as CommandHandler);
  }

  async dispatch<T extends Command>(command: T): Promise<void> {
    const handler = this.handlers.get(command.type);
    if (!handler) throw new Error(`No handler for: ${command.type}`);
    await handler(command);
  }
}
```

### 4. Query Bus
```typescript
export class QueryBus {
  private handlers = new Map<string, QueryHandler>();

  register<T extends Query, R = unknown>(type: string, handler: QueryHandler<T, R>): void {
    this.handlers.set(type, handler as QueryHandler);
  }

  async dispatch<T extends Query, R = unknown>(query: T): Promise<R> {
    const handler = this.handlers.get(query.type);
    if (!handler) throw new Error(`No handler for: ${query.type}`);
    return await handler(query as T);
  }
}
```

### 5. Handler Registration
```typescript
// Command Handler
commandBus.register("CREATE_USER", async (cmd: CreateUserCommand) => {
  await userRepository.create({ email: cmd.email, name: cmd.name, age: cmd.age });
});

// Query Handler
queryBus.register("GET_USER_BY_ID", async (query: GetUserByIdQuery) => {
  return await userRepository.findById(query.id);
});
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patterns/cqrs/command` | Execute a command |
| POST | `/patterns/cqrs/query` | Execute a query |

## Example Requests

```bash
# Execute command
curl -X POST http://localhost:3000/patterns/cqrs/command \
  -H "Content-Type: application/json" \
  -d '{"type":"CREATE_USER","email":"test@example.com","name":"Test"}'

# Execute query
curl -X POST http://localhost:3000/patterns/cqrs/query \
  -H "Content-Type: application/json" \
  -d '{"type":"GET_USER_BY_ID","id": 1}'
```

## Key Benefits

1. **Clean Separation**: Commands (write) vs Queries (read)
2. **Optimized Models**: Different models for reads and writes
3. **Scalability**: Scale reads and writes independently
4. **Complex Logic**: Handle complex command validation and business rules

## When to use

- High traffic applications
- Complex domain logic
- Need different read/write optimizations
- Event sourcing architecture

## Files

- `src/patterns/cqrs/CommandBus.ts` — Command bus
- `src/patterns/cqrs/QueryBus.ts` — Query bus
- `src/patterns/cqrs/commands.ts` — Command definitions
- `src/patterns/cqrs/queries.ts` — Query definitions
- `src/patterns/cqrs/routes.ts` — API endpoints
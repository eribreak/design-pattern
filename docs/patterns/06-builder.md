# Builder Pattern

## What is it?

The Builder Pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations.

## Problem it solves

- Complex object initialization with many options
- Step-by-step object construction
- Avoid telescoping constructors
- Make code more readable and maintainable

## Structure

```
Builder (UserBuilder, OrderBuilder, ProductBuilder)
    │
    ├─ withXxx() → returns builder (fluent interface)
    │
    └─ build() → returns final object
         │
         └─ Director (BuilderDirector)
               coordinates builders
```

## Implementation

### 1. Builder Pattern
```typescript
export class UserBuilder {
  private user: Partial<User> = {};

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  withAge(age: number): UserBuilder {
    this.user.age = age;
    return this;
  }

  build(): User {
    return this.user as User;
  }

  reset(): UserBuilder {
    this.user = {};
    return this;
  }
}
```

### 2. Fluent Interface Usage
```typescript
const user = new UserBuilder()
  .withEmail("john@example.com")
  .withName("John Doe")
  .withAge(30)
  .build();
```

### 3. Director (optional)
```typescript
export class BuilderDirector {
  buildUser(email: string, name: string, age?: number): User {
    return this.userBuilder.reset()
      .withEmail(email)
      .withName(name)
      .withAge(age!)
      .build();
  }
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patterns/builder/user` | Build user |
| POST | `/patterns/builder/product` | Build product |
| POST | `/patterns/builder/order` | Build order |

## Example Request

```bash
curl -X POST http://localhost:3000/patterns/builder/user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

## Key Benefits

1. **Readability**: Chainable methods make code expressive
2. **Immutability**: Build object step by step
3. **Flexibility**: Optional parameters handled easily
4. **Reusability**: Builder can be reused after `reset()`

## When to use

- Objects with many optional parameters
- Complex initialization sequences
- Need to create different representations
- Readable object construction

## Files

- `src/patterns/builder/UserBuilder.ts` — User builder
- `src/patterns/builder/ProductBuilder.ts` — Product builder
- `src/patterns/builder/OrderBuilder.ts` — Order builder
- `src/patterns/builder/BuilderDirector.ts` — Director coordination

## Relationship with Factory

Builder + Factory = powerful combination:
```typescript
// Factory creates builder
// Builder constructs object
// Factory returns built object
const user = EntityFactory.createUser({ email, name, age });
// Actually: UserFactory uses UserBuilder under the hood
```
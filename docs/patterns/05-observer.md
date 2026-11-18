# Observer Pattern

## What is it?

The Observer Pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

## Problem it solves

- Need to notify multiple systems when an event occurs
- Decoupling event producers from event consumers
- Allow dynamic addition/removal of listeners
- Avoid tight coupling between components

## Structure

```
Subject (INotificationSubject)
    │
    ├─ attaches observers
    │
    └─ notifies on event
         │
         └─ Observer Interface (IObserver)
              │
              ├─ EmailObserver
              ├─ SmsObserver
              └─ SlackObserver
```

## Implementation

### 1. Observer Interface
```typescript
export interface IObserver {
  handle(eventType: EventType, data: EventData): Promise<void>;
}
```

### 2. Subject Interface
```typescript
export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(eventType: EventType, data: EventData): Promise<void>;
}
```

### 3. Concrete Subject
```typescript
export class NotificationSubject implements ISubject {
  private observers: IObserver[] = [];

  attach(observer: IObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: IObserver): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  async notify(eventType: EventType, data: EventData): Promise<void> {
    await Promise.all(
      this.observers.map(observer => observer.handle(eventType, data))
    );
  }
}
```

### 4. Concrete Observers
```typescript
export class EmailObserver implements IObserver {
  async handle(eventType: EventType, data: EventData): Promise<void> {
    console.log(`Sending email: ${eventType}`, data);
    // Send actual email
  }
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patterns/observer/notify` | Notify all observers |
| POST | `/patterns/observer/simulate` | Simulate an event |
| POST | `/patterns/observer/add-observer` | Add new observer type |

## Example Request

```bash
curl -X POST http://localhost:3000/patterns/observer/notify \
  -H "Content-Type: application/json" \
  -d '{"orderId": 1}'
```

## Key Benefits

1. **Loose Coupling**: Subject and observers are independent
2. **Notification Broadcast**: One-to-many communication
3. **Dynamic**: Add/remove observers at runtime
4. **Single Responsibility**: Each observer handles one notification type

## When to use

- Event-driven architecture
- Need to notify multiple systems of changes
- Decoupling is important
- Dynamic notification requirements

## Files

- `src/patterns/observer/interfaces.ts` — Observer and Subject interfaces
- `src/patterns/observer/Subject.ts` — NotificationSubject
- `src/patterns/observer/observers.ts` — Concrete observers
- `src/patterns/observer/routes.ts` — API endpoints
# Singleton Pattern

## What is it?

The Singleton Pattern ensures a class has only one instance and provides a global point of access to it.

## Problem it solves

- Need exactly one instance of a class (e.g., Logger, Config)
- Need a globally shared resource
- Need to control access to shared state

## Structure

```
Singleton (private constructor)
    └─ getInstance() → returns single instance
```

## Implementation

### 1. Singleton Registry Pattern
```typescript
export class ConfigManager {
  private static instance: ConfigManager | null = null;

  private constructor() {
    // Private constructor prevents external instantiation
    this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  get(key: string): string {
    return this.config[key];
  }
}
```

### 2. Logger Singleton
```typescript
export class Logger {
  private static instance: Logger | null = null;

  private constructor() {
    this.winston = winston.createLogger({...});
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}
```

### 3. Usage
```typescript
// Always get the same instance
const logger = Logger.getInstance();
logger.info("Message"); // Same instance everywhere
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patterns/singleton/config` | Get all config |
| GET | `/patterns/singleton/logger` | Logger info |
| POST | `/patterns/singleton/log` | Log a message |

## Key Benefits

1. **Single Instance**: Guaranteed one instance
2. **Lazy Initialization**: Instance created only when needed
3. **Global Access**: Available from anywhere in the application
4. **Memory Efficient**: No multiple instances wasted

## When to use

- Configuration managers
- Logging services
- Database connection pools
- Cache managers

## ⚠️ When NOT to use

- Overuse leads to hidden dependencies
- Makes testing harder
- Can introduce global state
- Violates Single Responsibility in some cases

## Files

- `src/patterns/singleton/ConfigManager.ts` — Config singleton
- `src/patterns/singleton/Logger.ts` — Logger singleton
- `src/patterns/singleton/SingletonRegistry.ts` — Combined access
- `src/patterns/singleton/routes.ts` — API endpoints
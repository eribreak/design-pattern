import "reflect-metadata";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

dotenvConfig({ path: resolve(process.cwd(), ".env") });

export interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  logLevel: string;
}

export class ConfigManager {
  private static instance: ConfigManager | null = null;
  private readonly config: Config;

  private constructor() {
    this.config = {
      port: Number(process.env.PORT) || 3000,
      nodeEnv: process.env.NODE_ENV || "development",
      databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/design_patterns",
      jwtSecret: process.env.JWT_SECRET || "change-me",
      logLevel: process.env.LOG_LEVEL || "info",
    };
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  get<T extends keyof Config>(key: T): Config[T] {
    return this.config[key];
  }

  all(): Config {
    return { ...this.config };
  }
}

export const config = ConfigManager.getInstance();
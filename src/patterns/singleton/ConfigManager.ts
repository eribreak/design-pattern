// Singleton: ConfigManager
export class ConfigManager {
  private static instance: ConfigManager | null = null;
  private config: Record<string, string> = {};

  private constructor() {
    // Private constructor prevents direct creation
    this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): void {
    this.config = {
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/design_patterns",
      PORT: process.env.PORT || "3000",
      NODE_ENV: process.env.NODE_ENV || "development",
    };
  }

  get(key: string): string {
    return this.config[key] || "";
  }

  getAll(): Record<string, string> {
    return { ...this.config };
  }
}
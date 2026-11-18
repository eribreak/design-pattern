import { ConfigManager } from "./ConfigManager";
import { Logger } from "./Logger";

// Registry to export all singletons
export class SingletonRegistry {
  static getConfig(): ConfigManager {
    return ConfigManager.getInstance();
  }

  static getLogger(): Logger {
    return Logger.getInstance();
  }
}
import winston from "winston";

// Singleton: Custom Logger
export class Logger {
  private static instance: Logger | null = null;
  private readonly winston: winston.Logger;

  private constructor() {
    this.winston = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.winston.info(message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.winston.error(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.winston.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.winston.debug(message, meta);
  }
}
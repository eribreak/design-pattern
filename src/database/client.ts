import { PrismaClient } from "@prisma/client";
import { logger } from "../shared/logger";

export class DatabaseConnection {
  private static instance: PrismaClient | null = null;

  static getConnection(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient({
        log: ["query", "info", "warn", "error"],
      });
    }
    return DatabaseConnection.instance;
  }

  static async disconnect(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.$disconnect();
      DatabaseConnection.instance = null;
      logger.info("Database connection closed");
    }
  }
}

// Singleton export
export const prisma = DatabaseConnection.getConnection();
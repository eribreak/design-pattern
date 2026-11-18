import { createApp } from "./app";
import { config } from "./config";
import { DatabaseConnection } from "./database/client";
import { logger } from "./shared/logger";

const app = createApp();
const port = config.get("port");

async function startServer(): Promise<void> {
  try {
    await DatabaseConnection.getConnection().$connect();
    logger.info("Database connected");

    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing server");
  await DatabaseConnection.disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, closing server");
  await DatabaseConnection.disconnect();
  process.exit(0);
});
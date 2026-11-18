import { Router, Request, Response } from "express";
import { ConfigManager } from "./ConfigManager";
import { Logger } from "./Logger";

const router = Router();

// Singleton endpoints to demonstrate the pattern
export class SingletonController {
  async getConfig(req: Request, res: Response): Promise<Response> {
    const config = ConfigManager.getInstance().getAll();
    return res.json({
      success: true,
      data: config,
      note: "Same ConfigManager instance returned every time (Singleton)",
    });
  }

  async getLoggerInfo(req: Request, res: Response): Promise<Response> {
    const logger = Logger.getInstance();
    return res.json({
      success: true,
      message: "Logger instance accessed (Singleton)",
      timestamp: new Date().toISOString(),
    });
  }

  async logMessage(req: Request, res: Response): Promise<Response> {
    const logger = Logger.getInstance();
    const { level = "info", message } = req.body;

    switch (level.toLowerCase()) {
      case "error":
        logger.error(message);
        break;
      case "warn":
        logger.warn(message);
        break;
      case "debug":
        logger.debug(message);
        break;
      case "info":
      default:
        logger.info(message);
        break;
    }

    return res.json({
      success: true,
      message: `Message logged at ${level.toUpperCase()} level`,
    });
  }
}

const controller = new SingletonController();
router.get("/config", (req, res) => controller.getConfig(req, res));
router.get("/logger", (req, res) => controller.getLoggerInfo(req, res));
router.post("/log", (req, res) => controller.logMessage(req, res));

export default router;
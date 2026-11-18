import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../shared/errors";
import { logger } from "../shared/logger";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  logger.error("Error occurred", { error: err.message, stack: err.stack });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      success: false,
      error: "InternalServerError",
      message: "An unexpected error occurred",
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: "UnknownError",
    message: "An unknown error occurred",
  });
}
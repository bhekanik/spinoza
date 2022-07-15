import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "./logger";

export interface ErrorCommon {
  status?: number;
  success?: boolean;
  message?: string;
  stack?: string;
}

export function handleApiError(
  error: ErrorCommon,
  res: NextApiResponse,
  req: NextApiRequest
) {
  if (error.status) {
    res.status(error.status as number);
  } else {
    res.status(500);
  }

  const loggerMetadata = {
    traceId: req.headers["x-trace-id"] ?? "",
    url: req.url,
    method: req.method,
  };

  logger.error("\nAPI Error", {
    ...loggerMetadata,
    message: error.message || typeof error === "string" ? error : "",
    stack: process.env.NODE_ENV === "production" ? "" : error.stack,
  });

  res.json({
    message: error.message || typeof error === "string" ? error : "",
    stack: process.env.NODE_ENV === "production" ? "" : error.stack,
    success: false,
  });
}

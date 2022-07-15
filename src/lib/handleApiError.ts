import { NextApiRequest, NextApiResponse } from "next";
import { getContext } from "./getContext";
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
  const context = getContext(req, res);
  if (error.status) {
    res.status(error.status as number);
  } else {
    res.status(500);
  }

  logger.error("\nAPI Error", {
    traceId: context.traceId,
    tracePath: context.tracePath,
    method: req.method,
    message: error.message || typeof error === "string" ? error : "",
    stack: process.env.NODE_ENV === "production" ? "" : error.stack,
  });

  res.json({
    message: error.message || typeof error === "string" ? error : "",
    stack: process.env.NODE_ENV === "production" ? "" : error.stack,
    success: false,
  });
}

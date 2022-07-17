// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../lib/config";
import { getContext } from "../../lib/getContext";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";
import { logger } from "../../lib/logger";
import { applyCommonMiddleware } from "../../lib/middleware/applyCommonMiddleware";

type Data = {
  status: string;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await applyCommonMiddleware(req, res);
  const context = getContext(req, res);

  try {
    if (req.method === "POST") {
      const { url } = JSON.parse(req.body);

      const headers = {
        "Ocp-Apim-Subscription-Key": config.key,
      };

      logger.info(`Getting synth status`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
        url,
      });

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const { status } = await response.json();

      logger.info(`Getting voices succeeded`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
        status,
      });

      res.status(200).json({ status, url });
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../lib/config";
import { getContext } from "../../lib/getContext";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";
import { logger } from "../../lib/logger";
import { applyCommonMiddleware } from "../../lib/middleware/applyCommonMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await applyCommonMiddleware(req, res);
  const context = getContext(req, res);

  try {
    if (req.method === "POST") {
      const { id } = JSON.parse(req.body);

      const url = `https://${config.region}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/${id}/`;
      const headers = {
        "Ocp-Apim-Subscription-Key": config.key,
      };

      logger.info(`Deleting synth result starting`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
        id,
      });

      const response = await fetch(url, {
        method: "DELETE",
        headers,
      });

      const data = await response;

      if (data.status >= 400) {
        throw new Error("Something went wrong");
      }

      logger.info(`Deleting synth result succeeded`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
        id,
      });

      res.status(200).json({ id });
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

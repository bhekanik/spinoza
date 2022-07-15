// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../lib/config";
import { getContext } from "../../lib/getContext";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";
import { logger } from "../../lib/logger";
import { applyCommonMiddleware } from "../../lib/middleware/applyCommonMiddleware";

export interface Voice {
  createdDateTime: string;
  description: string;
  gender: string;
  locale: string;
  properties: { publicAvailable: boolean };
  voiceName: string;
  label?: string;
}

type Data = {
  success: boolean;
  data: Voice[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await applyCommonMiddleware(req, res);
  const context = getContext(req, res);

  try {
    if (req.method === "GET") {
      const url = `https://${config.region}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/voices`;
      const headers = {
        "Ocp-Apim-Subscription-Key": config.key,
      };

      logger.info(`Getting voices starting`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
      });

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const { values } = await response.json();

      logger.info(`Getting voices succeeded`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
      });

      res.status(200).json(values);
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../lib/config";
import { getContext } from "../../lib/getContext";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";
import { logger } from "../../lib/logger";
import { applyCommonMiddleware } from "../../lib/middleware/applyCommonMiddleware";

type Data = {
  downloadUrl: string;
  id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await applyCommonMiddleware(req, res);
  const context = getContext(req, res);

  try {
    if (req.method === "POST") {
      const { id } = JSON.parse(req.body);

      const url = `https://${config.region}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/${id}/files`;
      const headers = {
        "Ocp-Apim-Subscription-Key": config.key,
      };

      logger.info(`Getting files`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
        id,
      });

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const { values } = await response.json();

      logger.info(`Getting files succeeded`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
        id,
        downloadUrl: values[1].links.contentUrl,
      });

      res.status(200).json({ id, downloadUrl: values[1].links.contentUrl });
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

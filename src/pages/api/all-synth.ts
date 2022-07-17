// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../lib/config";
import { getContext } from "../../lib/getContext";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";
import { logger } from "../../lib/logger";
import { applyCommonMiddleware } from "../../lib/middleware/applyCommonMiddleware";

export interface SynthRequest {
  models: [
    {
      id: string;
      voiceName: string;
    }
  ];
  properties: {
    outputFormat: string;
    concatenateResult: false;
    totalDuration: string;
    billableCharacterCount: number;
  };
  id: string;
  lastActionDateTime: string;
  status: string;
  createdDateTime: string;
  locale: string;
  displayName: string;
  description: string;
}

type Data = {
  values: SynthRequest[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await applyCommonMiddleware(req, res);
  const context = getContext(req, res);

  try {
    if (req.method === "GET") {
      const url = `https://${config.region}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis`;
      const headers = {
        "Ocp-Apim-Subscription-Key": config.key,
      };

      logger.info(`Getting all synth requests`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
      });

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const { values } = await response.json();

      logger.info(`Getting all synth results succeeded`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
      });

      res.status(200).json(values);
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

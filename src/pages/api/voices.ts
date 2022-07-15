// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../lib/config";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";

type Data = {
  success: boolean;
  data: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "GET") {
      const url = `https://${config.region}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/voices`;
      const headers = {
        "Ocp-Apim-Subscription-Key": config.key,
      };

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      res.status(200).json({ success: true, data });
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

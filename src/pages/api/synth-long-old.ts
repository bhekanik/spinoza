// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { logger } from "src/lib/logger";
import { config } from "../../lib/config";
import { getContext } from "../../lib/getContext";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";
import { applyCommonMiddleware } from "../../lib/middleware/applyCommonMiddleware";

type Data = {
  success: boolean;
  data: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await applyCommonMiddleware(req, res);
  const context = getContext(req, res);
  try {
    if (req.method === "POST") {
      logger.info("Files", {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        files: req.files,
        traceId: context.traceId,
        tracePath: context.tracePath,
      });

      const inputFilePath = "<input_file_path>";
      const locale = "<locale>";

      const url = `https://${config.region}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis`;
      const headers = {
        "Ocp-Apim-Subscription-Key": config.key,
      };

      const voiceIdentities = [
        {
          voicename: "en-US-JennyNeural",
        },
      ];

      const payload = {
        displayname: "long audio synthesis sample",
        description: "sample description",
        locale: locale,
        voices: JSON.stringify(voiceIdentities),
        outputformat: "riff-16khz-16bit-mono-pcm",
        concatenateresult: true,
      };

      // filename = ntpath.basename(inputFilePath);
      // files = {
      //   script: (filename, open(inputFilePath, "rb"), "text/plain"),
      // };

      // const a = await axios.post(url, body, { headers});

      // const response = await fetch(url, {
      //   body: JSON.stringify(payload),
      //   method: "POST",
      //   headers,
      // });

      // const data = await response.json();

      res.status(200).json({ success: true, data: [] });
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

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
    if (req.method === "POST") {
      const inputFilePath = "<input_file_path>";
      const locale = "<locale>";

      const url = `https://${config.region}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis`;
      const headers = {
        "Ocp-Apim-Subscription-Key": config.key,
      };

      const voiceIdentities = [
        {
          voicename: "<voice_name>",
        },
      ];

      const body = {
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

      const response = await fetch(url, {
        body: JSON.stringify(body),
        method: "POST",
        headers,
      });

      const data = await response.json();

      res.status(200).json({ success: true, data });
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}
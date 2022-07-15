// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ReadStream } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";
import { logger } from "../../lib/logger";
import { synthesize, SynthesizeOptions } from "../../lib/synthesize";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "POST") {
      const {
        body: { text, voice, filename },
      } = req;

      if (!text) {
        throw new Error("No text provided");
      }

      const options: SynthesizeOptions = {};

      if (filename) {
        options.filename = filename;
      }

      if (voice) {
        options.voice = voice;
      }

      logger.info(`Synthesizing text: ${text}`);
      const audioStream = await synthesize(text, options);

      // res.set({
      //   "Content-Type": "audio/mpeg",
      //   "Transfer-Encoding": "chunked",
      // });
      (audioStream as ReadStream).pipe(res);

      // res.status(200).json({ success: true });
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

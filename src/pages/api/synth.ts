// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ReadStream } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getContext } from "../../lib/getContext";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";
import { logger } from "../../lib/logger";
import { applyCommonMiddleware } from "../../lib/middleware/applyCommonMiddleware";
import { synthesize, SynthesizeOptions } from "../../lib/synthesize";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await applyCommonMiddleware(req, res);
  const context = getContext(req, res);

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

      logger.info(`Synthesizing text`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
        text,
        voice,
        filename,
      });
      const audioStream = await synthesize(context, text, options);

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Transfer-Encoding", "chunked");
      res.status(200);

      (audioStream as ReadStream).pipe(res);
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

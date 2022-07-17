// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { extractFileFromZip } from "src/lib/extractFileFromZip";
import { Transform } from "stream";
import { getContext } from "../../lib/getContext";
import { ErrorCommon, handleApiError } from "../../lib/handleApiError";
import { logger } from "../../lib/logger";
import { applyCommonMiddleware } from "../../lib/middleware/applyCommonMiddleware";

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
      const { url } = JSON.parse(req.body);

      if (!url) {
        throw new Error("No text provided");
      }

      logger.info(`Getting zip file`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
        url,
      });
      const outputStream = await extractFileFromZip(context, url);

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Transfer-Encoding", "chunked");
      res.status(200);

      logger.info(`Sending stream`, {
        traceId: context.traceId,
        tracePath: context.tracePath,
      });

      (outputStream as Transform).pipe(res);
    }
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
}

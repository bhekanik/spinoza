import axios from "axios";
import JSZip from "jszip";
import { PassThrough, Transform } from "stream";
import { logger } from "./logger";
import { Context } from "./types";

export const extractFileFromZip = async (
  context: Context,
  url: string
): Promise<Transform | null> => {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });

  logger.info(`Extracting file from zip`, {
    traceId: context.traceId,
    tracePath: context.tracePath,
  });

  const jszip = new JSZip();

  const result = await jszip.loadAsync(data);

  let content: Buffer | null = null;
  const file = result.files["output.mp3"];
  const buffer = await file.async("arraybuffer");

  content = Buffer.from(buffer);

  const bufferStream = new PassThrough();

  bufferStream.end(content);

  logger.info(`Processing output file`, {
    traceId: context.traceId,
    tracePath: context.tracePath,
  });

  return bufferStream;
};

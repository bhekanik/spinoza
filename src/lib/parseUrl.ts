import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { logger } from "./logger";
import { Context } from "./types";

export interface Article {
  title: string;
  byline: string;
  id?: string;
  dir: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  siteName: string;
  url?: string;
  synthStatusUrl?: string;
  status?: string;
  downloadUrl?: string;
}

export const parseUrl = async (
  context: Context,
  url: string
): Promise<Article | null> => {
  const response = await fetch(url);
  const data = await response.text();
  const { document } = new JSDOM(data, { url }).window;

  logger.info("Parsing URL", {
    traceId: context.traceId,
    tracePath: context.tracePath,
    url,
  });
  const reader = new Readability(document);

  const article = reader.parse();
  return article;
};

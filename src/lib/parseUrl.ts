import { Readability } from "@mozilla/readability";

export const parseUrl = async (url: string) => {
  const reader = new Readability(document);
  const article = reader.parse();
  console.log("article", article);
};

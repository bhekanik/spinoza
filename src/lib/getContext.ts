import { NextApiRequest, NextApiResponse } from "next";

export const getContext = (req: NextApiRequest, res: NextApiResponse) => {
  return {
    req,
    res,
    traceId: req.headers["x-trace-id"] ?? "",
    tracePath: `${req.headers["x-trace-path"] ?? ""}${req.url}`,
  };
};

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import FormData from "form-data";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import fetch from "node-fetch";
import { getContext } from "src/lib/getContext";
import { ErrorCommon, handleApiError } from "src/lib/handleApiError";
import { logger } from "src/lib/logger";
import { parseUrl } from "src/lib/parseUrl";
import { config as appConfig } from "../../lib/config";

// Default Req and Res are IncomingMessage and ServerResponse
// You may want to pass in NextApiRequest and NextApiResponse
const router = createRouter<NextApiRequest, NextApiResponse>();

// create a handler from router with custom
// onError and onNoMatch
export default router.handler({
  onError: (err: unknown, req: NextApiRequest, res: NextApiResponse) => {
    console.error((err as Error).stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

router.post(async (req, res) => {
  try {
    const context = getContext(req, res);
    const { body } = req;
    const { voice, url } = JSON.parse(body);

    const article = await parseUrl(context, url);

    if (!article) {
      throw new Error("Article is not found");
    }

    const { title, textContent, length, siteName } = article;

    logger.info("Parsing URL Completed", {
      traceId: context.traceId,
      tracePath: context.tracePath,
      title,
      length,
      siteName,
      url,
    });

    const synthUrl = `https://${appConfig.region}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis`;

    const voiceIdentities = [
      {
        voicename: voice ?? "en-US-JennyNeural",
      },
    ];

    const formData = new FormData();
    const buff = Buffer.from(textContent, "utf8");
    formData.append("script", buff, {
      contentType: "text/plain",
      filename: "script.txt",
    });

    formData.append("displayname", "long audio synthesis sample");
    formData.append("description", "sample description");
    formData.append("locale", "en-US");
    formData.append("voices", JSON.stringify(voiceIdentities));
    formData.append("outputformat", "audio-16khz-128kbitrate-mono-mp3");
    formData.append("concatenateresult", "true");

    const headers = {
      "Ocp-Apim-Subscription-Key": appConfig.key,
      "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
    };

    const response = await fetch(synthUrl, {
      body: formData,
      method: "POST",
      headers,
    });

    const res1 = await response;
    console.log("data:", res1);
    const data = res1.headers.get("location");

    console.log("data:", data);

    logger.info("Synth Completed", {
      traceId: context.traceId,
      tracePath: context.tracePath,
      title,
      length,
      siteName,
      url,
      synthStatusUrl: data,
    });

    res.status(200).json({
      success: true,
      article: {
        title,
        textContent,
        length,
        siteName,
        url,
        synthStatusUrl: data,
        status: "NotStarted",
      },
    });
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
});

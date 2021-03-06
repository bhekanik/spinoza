// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import FormData from "form-data";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import fetch from "node-fetch";
import { getContext } from "src/lib/getContext";
import { ErrorCommon, handleApiError } from "src/lib/handleApiError";
import { logger } from "src/lib/logger";
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.use(multer().any());

router.post(async (req, res) => {
  const context = getContext(req, res);
  try {
    const { body } = req;
    const { voice, title } = body;

    const url = `https://${appConfig.region}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis`;

    const voiceIdentities = [
      {
        voicename: voice ?? "en-US-JennyNeural",
      },
    ];

    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const file = req.files[0];
    formData.append("script", file.buffer, {
      contentType: file.mimetype,
      filename: file.originalname,
    });

    const locale = voice.split("-").slice(0, -1).join("-");

    formData.append("displayname", title || new Date().toISOString());
    formData.append("description", "Uploaded via file upload");
    formData.append("locale", locale || "en-US");
    formData.append("voices", JSON.stringify(voiceIdentities));
    formData.append("outputformat", "audio-16khz-128kbitrate-mono-mp3");
    formData.append("concatenateresult", "true");

    const headers = {
      "Ocp-Apim-Subscription-Key": appConfig.key,
      "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
    };

    const response = await fetch(url, {
      body: formData,
      method: "POST",
      headers,
    });

    const data = await response;

    if (data.status >= 400) {
      throw new Error("Something went wrong");
    }

    const synthStatusUrl = data.headers.get("location");

    const id =
      synthStatusUrl?.split("/")[synthStatusUrl?.split("/").length - 1];

    logger.info("Synth Completed", {
      traceId: context.traceId,
      tracePath: context.tracePath,
      id,
      title: title || "",
      length: 0,
      siteName: "",
      url: "",
      synthStatusUrl,
      status: "NotStarted",
    });

    res.status(200).json({
      success: true,
      article: {
        title: title || "",
        textContent: "",
        id,
        length: 0,
        siteName: "",
        url: "",
        synthStatusUrl,
        status: "NotStarted",
      },
    });
  } catch (error: unknown) {
    handleApiError(error as ErrorCommon, res, req);
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

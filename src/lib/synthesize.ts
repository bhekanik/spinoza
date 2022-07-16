import fs from "fs";
import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";
import { config } from "./config";
import { logger } from "./logger";
import { Context } from "./types";

export interface SynthesizeOptions {
  filename?: string;
  voice?: string;
}

export const synthesize = (
  context: Context,
  text: string,
  options: SynthesizeOptions = {}
) => {
  const { traceId, tracePath } = context;

  const audioFile = null;

  const speechConfig = SpeechConfig.fromSubscription(config.key, config.region);
  speechConfig.speechSynthesisOutputFormat = 5; // mp3

  let audioConfig = undefined;

  if (audioFile) {
    audioConfig = AudioConfig.fromAudioFileOutput(audioFile);
  }

  // The language of the voice that speaks.
  speechConfig.speechSynthesisVoiceName = options.voice ?? "en-US-JennyNeural";

  // Create the speech synthesizer.
  let synthesizer: SpeechSynthesizer | null = new SpeechSynthesizer(
    speechConfig,
    audioConfig
  );

  return new Promise((resolve, reject) => {
    if (synthesizer) {
      logger.info(`Synthesis synthesis starting`, {
        traceId,
        tracePath,
      });
      synthesizer.speakTextAsync(
        text,
        (result) => {
          logger.info(`Synthesis result`, {
            traceId,
            tracePath,
            resultReason: result.reason,
          });

          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            const { audioData } = result;

            synthesizer?.close();

            if (audioFile) {
              // return stream from file
              const audio = fs.createReadStream(audioFile);
              resolve(audio);
            } else {
              // return stream from memory
              const bufferStream = new PassThrough();
              bufferStream.end(Buffer.from(audioData));
              resolve(bufferStream);
            }
          } else {
            logger.info(
              `Speech synthesis canceled, ${result.errorDetails}\nDid you set the speech resource key and region values?`,
              {
                traceId,
                tracePath,
              }
            );
            reject(result.errorDetails);
          }
        },
        (err) => {
          console.trace("err - " + err);

          logger.info(`Error: ${err}`, {
            traceId,
            tracePath,
          });
          synthesizer?.close();
          synthesizer = null;
          reject(err);
        }
      );
    }
  });
};

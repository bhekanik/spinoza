import sdk, { SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";

var key = process.env.KEY || "";
var region = process.env.REGION || "";

export interface SynthesizeOptions {
  filename?: string;
}

export const synthesize = (text: string, options: SynthesizeOptions = {}) => {
  var audioFile = `${options.filename ?? new Date().toISOString()}.wav`;

  const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

  // The language of the voice that speaks.
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

  // Create the speech synthesizer.
  let synthesizer: SpeechSynthesizer | null = new sdk.SpeechSynthesizer(
    speechConfig,
    audioConfig
  );

  if (synthesizer) {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
        } else {
          console.error(
            "Speech synthesis canceled, " +
              result.errorDetails +
              "\nDid you set the speech resource key and region values?"
          );
        }
        synthesizer?.close();
        synthesizer = null;
      },
      (err) => {
        console.trace("err - " + err);
        synthesizer?.close();
        synthesizer = null;
      }
    );
    console.log("Now synthesizing to: " + audioFile);
  }
};

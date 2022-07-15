import React, { useEffect, useState } from "react";
import { useQueueLongFormSynth } from "src/hooks/useQueueLongFormSynth";
import { FileUploader } from "./Form/UploadFile";
import { SelectVoice } from "./SelectVoice";

export const LongFormSynth = () => {
  const ref = React.useRef<HTMLAudioElement>(null);
  const [showAudio, setShowAudio] = useState(false);

  const { queueSynth, data } = useQueueLongFormSynth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await queueSynth(formData);
  };

  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(data);

      if (ref.current) {
        ref.current.src = url;
        setShowAudio(true);
        ref.current.play();
      }
    }
  }, [data]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SelectVoice />
        <div className="relative flex mb-4 gap-2 justify-center items-center w-full flex-col">
          {/* <input
            placeholder="What should I say?"
            type="text"
            id="text"
            name="text"
            className="w-full max-w-md px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          /> */}
          <FileUploader />
          <button
            type="submit"
            className="px-6 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
          >
            Synthesize
          </button>
        </div>
      </form>
      {showAudio && (
        <audio
          className="w-full"
          ref={ref}
          id="serverAudioStream"
          controls
          preload="none"
        ></audio>
      )}
    </>
  );
};

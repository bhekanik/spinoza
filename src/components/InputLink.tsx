import React from "react";
import { generateTraceId } from "../lib/generateTraceId";
import { SelectVoice } from "./SelectLanguage";
import { UploadFile } from "./UploadFile";

export const InputLink = () => {
  const ref = React.useRef<HTMLAudioElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/synth-long", {
      method: "POST",
      body: formData,
      headers: {
        "x-trace-id": generateTraceId(),
        "x-trace-path": "spinoza-web",
      },
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    if (ref.current) {
      ref.current.src = url;
      ref.current.play();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SelectVoice />
        <div className="relative flex mb-4 space-x-3 ">
          <input
            placeholder="What should I say?"
            type="text"
            id="text"
            name="text"
            className="w-full max-w-md px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <UploadFile />
          <button
            type="submit"
            className="px-6 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
          >
            Add Article
          </button>
        </div>
      </form>
      <audio ref={ref} id="serverAudioStream" controls preload="none"></audio>
    </>
  );
};

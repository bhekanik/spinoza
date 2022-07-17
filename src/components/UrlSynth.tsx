import React, { useEffect, useRef } from "react";
import { useQueueUrlSynth } from "src/hooks/useQueueUrlSynth";
import { useStore } from "src/stores/articles";
import { SelectVoice } from "./SelectVoice";

export const UrlSynth = () => {
  const { queueSynth, data, isLoading, isSuccess } = useQueueUrlSynth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    await queueSynth({ url: values.url, voice: values.voice });
  };

  const addArticle = useStore((state) => state.addArticle);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSuccess && ref.current) {
      if (data) {
        addArticle(data.article);
      }

      ref.current.value = "";
      ref.current.focus();
    }
  }, [isSuccess, data, addArticle]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SelectVoice />
        <div className="relative flex mb-4 gap-2 justify-center items-center w-full">
          <input
            ref={ref}
            placeholder="URL"
            type="url"
            id="url"
            name="url"
            className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            disabled={isLoading}
            type="submit"
            className="px-6 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
          >
            Synthesize
          </button>
        </div>
      </form>
    </>
  );
};

import React, { useEffect, useRef } from "react";
import { useQueueLongFormSynth } from "src/hooks/useQueueLongFormSynth";
import { useStore } from "src/stores/articles";
import { FileUploader } from "./Form/UploadFile";
import { SelectVoice } from "./SelectVoice";

export const LongFormSynth = () => {
  const { queueSynth, data, error, isError, isLoading, isSuccess } =
    useQueueLongFormSynth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await queueSynth(formData);
  };

  const addArticle = useStore((state) => state.addArticle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSuccess && inputRef.current) {
      if (data) {
        addArticle(data.article);
      }

      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [isSuccess, data, addArticle]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SelectVoice />
        <div className="relative flex mb-4 gap-2 justify-center items-center w-full flex-col">
          <FileUploader />
          <input
            placeholder="Title of your article"
            type="text"
            id="title"
            name="title"
            className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            ref={inputRef}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
          >
            Synthesize
          </button>
        </div>

        {isError && (
          <p className="mb-4">
            <span className="text-red-500">{(error as Error).message}</span>
          </p>
        )}
      </form>
    </>
  );
};

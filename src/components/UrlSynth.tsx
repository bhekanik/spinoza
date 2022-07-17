import { Button, Input } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useQueueUrlSynth } from "src/hooks/useQueueUrlSynth";
import { useStore } from "src/stores/articles";
import { SelectVoice } from "./SelectVoice";

export const UrlSynth = () => {
  const { queueSynth, data, error, isError, isLoading, isSuccess } =
    useQueueUrlSynth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    await queueSynth({ url: values.url, voice: values.voice });
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
        <div className="relative flex gap-2 justify-center items-center w-full">
          <Input
            ref={inputRef}
            placeholder="Enter URL"
            type="url"
            id="url"
            name="url"
          />
          <Button colorScheme="teal" isDisabled={isLoading} type="submit">
            Synthesize
          </Button>
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

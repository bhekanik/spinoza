import { Button, Flex, Input } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useQueueLongFormSynth } from "src/hooks/useQueueLongFormSynth";
import { useStore } from "src/stores/articles";
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
        <Flex gap={2} justifyContent="center" alignItems="center" w="full">
          <Input
            type="file"
            name="file"
            w="full"
            flex={1}
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
            justifySelf="center"
          />

          <Input
            flex={1}
            placeholder="Title of your article"
            type="text"
            id="title"
            name="title"
            className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            ref={inputRef}
          />
          <Button type="submit" isDisabled={isLoading} colorScheme="teal">
            Synthesize
          </Button>
        </Flex>

        {isError && (
          <p className="mb-4">
            <span className="text-red-500">{(error as Error).message}</span>
          </p>
        )}
      </form>
    </>
  );
};

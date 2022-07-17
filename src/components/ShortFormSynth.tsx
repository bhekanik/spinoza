import { Button, Input } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useQueueSynth } from "src/hooks/useQueueSynth";
import { SelectVoice } from "./SelectVoice";

export const ShortFormSynth = () => {
  const ref = React.useRef<HTMLAudioElement>(null);

  const { queueSynth, data } = useQueueSynth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    await queueSynth({ text: values.text, voice: values.voice });
  };

  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(data);

      if (ref.current) {
        ref.current.src = url;
        ref.current.play();
      }
    }
  }, [data]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SelectVoice />
        <div className="relative flex mb-4 gap-2 justify-center items-center w-full">
          <Input
            placeholder="What should I say?"
            type="text"
            id="text"
            name="text"
          />
          <Button colorScheme="teal" type="submit">
            Synthesize
          </Button>
        </div>
      </form>
      <audio
        className="w-full"
        ref={ref}
        id="serverAudioStream"
        controls
        preload="none"
      ></audio>
    </>
  );
};

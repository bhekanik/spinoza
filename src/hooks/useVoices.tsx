import { useMemo } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { generateTraceId } from "src/lib/generateTraceId";
import { Voice } from "src/pages/api/voices";

interface CategorizedVoices {
  female: Voice[];
  male: Voice[];
}

export const useVoices = (): Omit<UseQueryResult, "data"> &
  CategorizedVoices => {
  const { data, ...rest } = useQuery<Voice[]>("voices", () =>
    fetch("/api/voices", {
      headers: {
        "x-trace-id": generateTraceId(),
        "x-trace-path": "spinoza-web",
      },
    }).then((res) => res.json())
  );

  const voices = useMemo(() => {
    if (data) {
      return data.reduce(
        (acc: CategorizedVoices, voice: Voice) => {
          const voiceWithLabel = {
            ...voice,
            label: voice.voiceName
              .replace(voice.locale, "")
              .replace("-", "")
              .replace("Neural", ""),
          };

          acc[voice.gender.toLowerCase() as "female" | "male"].push(
            voiceWithLabel
          );

          return acc;
        },
        { male: [], female: [] }
      );
    }
  }, [data]);

  return { male: voices?.male ?? [], female: voices?.female ?? [], ...rest };
};

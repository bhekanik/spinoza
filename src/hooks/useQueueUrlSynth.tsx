import {
  UseMutateFunction,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import { Article } from "src/lib/parseUrl";
import { generateTraceId } from "../lib/generateTraceId";

interface InputValues {
  url: FormDataEntryValue;
  voice: FormDataEntryValue;
  locale?: FormDataEntryValue;
}

interface ReturnType {
  article: Article;
}

export const useQueueUrlSynth = (): Omit<
  UseMutationResult<ReturnType, unknown, InputValues, unknown>,
  "mutate"
> & {
  queueSynth: UseMutateFunction<ReturnType, unknown, InputValues, unknown>;
} => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation(
    async (values: InputValues) => {
      const res = await fetch("/api/synth-url", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "x-trace-id": generateTraceId(),
          "x-trace-path": "spinoza-web",
        },
      });

      if (res.status >= 400) {
        throw new Error("Failed to queue synth. Please try again.");
      }
      return res.json();
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("synth", {
          refetchActive: true,
          refetchInactive: true,
        });
      },
      onError: (error: unknown) => {
        console.error("error:", error);
      },
    }
  );

  return { queueSynth: mutate, ...rest };
};

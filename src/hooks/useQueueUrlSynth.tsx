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
    (values: InputValues) => {
      return fetch("/api/synth-url", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "x-trace-id": generateTraceId(),
          "x-trace-path": "spinoza-web",
        },
      }).then((res) => res.json());
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("synth", {
          refetchActive: true,
          refetchInactive: true,
        });
      },
      onError: (error: unknown) => {
        console.log("error:", error);
      },
    }
  );

  return { queueSynth: mutate, ...rest };
};

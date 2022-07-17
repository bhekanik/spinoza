import {
  UseMutateFunction,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import { generateTraceId } from "../lib/generateTraceId";

interface InputValues {
  text: FormDataEntryValue;
  voice: FormDataEntryValue;
}

export const useQueueSynth = (): Omit<
  UseMutationResult<Blob, unknown, InputValues, unknown>,
  "mutate"
> & {
  queueSynth: UseMutateFunction<Blob, unknown, InputValues, unknown>;
} => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation(
    async (values: InputValues) => {
      const res = await fetch("/api/synth", {
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

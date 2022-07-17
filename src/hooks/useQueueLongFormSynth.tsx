import {
  UseMutateFunction,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import { generateTraceId } from "../lib/generateTraceId";

export const useQueueLongFormSynth = (): Omit<
  UseMutationResult<Blob, unknown, FormData, unknown>,
  "mutate"
> & {
  queueSynth: UseMutateFunction<Blob, unknown, FormData, unknown>;
} => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation(
    async (formData: FormData) => {
      const res = await fetch("/api/synth-long", {
        method: "POST",
        body: formData,
        headers: {
          "x-trace-id": generateTraceId(),
          "x-trace-path": "spinoza-web",
        },
      });

      if (res.status >= 400) {
        throw new Error("Failed to queue long form synth. Please try again.");
      }
      return res.json();
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("long-form-synth", {
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

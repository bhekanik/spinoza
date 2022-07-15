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
    (formData: FormData) => {
      return fetch("/api/synth-long", {
        method: "POST",
        body: formData,
        headers: {
          "x-trace-id": generateTraceId(),
          "x-trace-path": "spinoza-web",
        },
      }).then((res) => res.blob());
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("long-form-synth", {
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

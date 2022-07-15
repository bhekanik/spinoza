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
    (values: InputValues) => {
      console.log("values:", values);
      return fetch("/api/synth", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "x-trace-id": generateTraceId(),
          "x-trace-path": "spinoza-web",
        },
      }).then((res) => res.blob());
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

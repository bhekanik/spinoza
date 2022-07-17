import {
  UseMutateFunction,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import { generateTraceId } from "../lib/generateTraceId";

export const useGetFiles = (): Omit<
  UseMutationResult<unknown, unknown, string, unknown>,
  "mutate"
> & {
  getFiles: UseMutateFunction<unknown, unknown, string, unknown>;
} => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation(
    (url: string) => {
      return fetch("/api/get-files", {
        method: "POST",
        body: JSON.stringify({ url }),
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

  return { getFiles: mutate, ...rest };
};

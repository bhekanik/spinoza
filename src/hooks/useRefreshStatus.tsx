import {
  UseMutateFunction,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import { generateTraceId } from "../lib/generateTraceId";

export const useRefreshStatus = (): Omit<
  UseMutationResult<unknown, unknown, string, unknown>,
  "mutate"
> & {
  refreshStatus: UseMutateFunction<unknown, unknown, string, unknown>;
} => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation(
    (url: string) => {
      return fetch("/api/status", {
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

  return { refreshStatus: mutate, ...rest };
};

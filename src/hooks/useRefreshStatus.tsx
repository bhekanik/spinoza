import {
  UseMutateFunction,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import { useStore } from "src/stores/articles";
import { generateTraceId } from "../lib/generateTraceId";

export const useRefreshStatus = (): Omit<
  UseMutationResult<unknown, unknown, string, unknown>,
  "mutate"
> & {
  refreshStatus: UseMutateFunction<unknown, unknown, string, unknown>;
} => {
  const queryClient = useQueryClient();
  const setStatus = useStore((state) => state.setStatus);

  const { mutate, ...rest } = useMutation(
    async (url: string) => {
      const res = await fetch("/api/status", {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
          "x-trace-id": generateTraceId(),
          "x-trace-path": "spinoza-web",
        },
      });

      if (res.status >= 400) {
        throw new Error("Failed to get status. Please try again.");
      }
      return res.json();
    },
    {
      onSuccess: async ({ status, url }) => {
        setStatus(url, status);
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

  return { refreshStatus: mutate, ...rest };
};

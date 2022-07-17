import {
  UseMutateFunction,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import { generateTraceId } from "../lib/generateTraceId";

export const useDeleteSynthRequest = (): Omit<
  UseMutationResult<unknown, unknown, string, unknown>,
  "mutate"
> & {
  deleteRequest: UseMutateFunction<unknown, unknown, string, unknown>;
} => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation(
    async (id: string) => {
      const res = await fetch("/api/delete-request", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          "x-trace-id": generateTraceId(),
          "x-trace-path": "spinoza-web",
        },
      });
      if (res.status >= 400) {
        throw new Error("Failed to delete synth request. Please try again.");
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

  return { deleteRequest: mutate, ...rest };
};

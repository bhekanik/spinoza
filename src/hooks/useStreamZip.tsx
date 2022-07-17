import { UseMutateFunction, useMutation, UseMutationResult } from "react-query";
import { generateTraceId } from "../lib/generateTraceId";

export const useStreamZip = (): Omit<
  UseMutationResult<Blob, unknown, string, unknown>,
  "mutate"
> & {
  stream: UseMutateFunction<Blob, unknown, string, unknown>;
} => {
  const { mutate, ...rest } = useMutation(
    async (downloadUrl: string) => {
      const res = await fetch("/api/stream-zip", {
        method: "POST",
        body: JSON.stringify({ url: downloadUrl }),
        headers: {
          "x-trace-id": generateTraceId(),
          "x-trace-path": "spinoza-web",
        },
      });
      if (res.status >= 400) {
        throw new Error("Failed to get stream. Please try again.");
      }
      return res.blob();
    },
    {
      onSuccess: async () => {
        //
      },
      onError: (error: unknown) => {
        console.error("error:", error);
      },
    }
  );

  return { stream: mutate, ...rest };
};

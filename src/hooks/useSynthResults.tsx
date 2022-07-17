import { useQuery, UseQueryResult } from "react-query";
import { generateTraceId } from "src/lib/generateTraceId";
import { SynthRequest } from "src/pages/api/all-synth";
import { useStore } from "src/stores/articles";

interface ReturnValue {
  synthResults: SynthRequest[];
}

export const useSynthResults = (): Omit<UseQueryResult, "data"> &
  ReturnValue => {
  const setStatusFromSynthRequests = useStore(
    (state) => state.setStatusFromSynthRequests
  );

  const { data, ...rest } = useQuery<SynthRequest[]>(
    "synth",
    async () => {
      const res = await fetch("/api/all-synth", {
        headers: {
          "x-trace-id": generateTraceId(),
          "x-trace-path": "spinoza-web",
        },
      });

      if (res.status >= 400) {
        throw new Error("Failed to get synth results. Please try again.");
      }
      return res.json();
    },
    {
      onSuccess: async (data) => {
        setStatusFromSynthRequests(data);
      },
      onError: (error: unknown) => {
        console.error("error:", error);
      },
    }
  );

  return { synthResults: data || [], ...rest };
};

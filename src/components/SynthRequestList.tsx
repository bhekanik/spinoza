import { useSynthResults } from "src/hooks/useSynthResults";
import { SynthRequestCard } from "./SynthRequestCard";

export const SynthRequestList = () => {
  const { synthResults } = useSynthResults();

  return (
    <div className="flex flex-1 flex-col border p-2">
      <h2 className="my-2 text-3xl font-bold">Synth Requests</h2>
      <ul className="flex flex-col gap-2">
        {synthResults.length === 0 && (
          <li className="text-center p-4 border-r-2k border-solid border-gray-500 border">
            <p className="text-gray-500">You have no synthesis requests.</p>
          </li>
        )}

        {synthResults.map((synthRequest) => (
          <SynthRequestCard
            synthRequest={synthRequest}
            key={`${synthRequest.id}`}
          />
        ))}
      </ul>
    </div>
  );
};

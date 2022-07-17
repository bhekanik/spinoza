import { formatRelative } from "date-fns";
import { useDeleteSynthRequest } from "src/hooks/useDeleteSythRequest";
import { useRefreshStatus } from "src/hooks/useRefreshStatus";
import { SynthRequest } from "src/pages/api/all-synth";

interface Props {
  synthRequest: SynthRequest;
}

const statusColors: Record<string, string> = {
  NotStarted: "bg-yellow-100",
  Running: "bg-orange-100",
  Succeeded: "bg-green-100",
  Failed: "bg-red-100",
};

export const SynthRequestCard = ({ synthRequest }: Props) => {
  const { refreshStatus } = useRefreshStatus();
  const {
    deleteRequest,
    error: deleteError,
    isError: isDeleteError,
  } = useDeleteSynthRequest();

  return (
    <li
      className={`p-4 border-r-2k border-solid border-gray-500 border ${
        statusColors[synthRequest.status ?? "NotStarted"]
      }`}
    >
      <h3 className="text-2xl">
        {synthRequest.displayName || synthRequest.createdDateTime}
      </h3>
      <p>{`Billable Character Length: ${synthRequest.properties.billableCharacterCount} characters`}</p>
      <p>{`Locale: ${synthRequest.locale}`}</p>
      <p>{`Created: ${formatRelative(
        new Date(synthRequest.createdDateTime),
        new Date()
      )}`}</p>
      <p className={`${statusColors[synthRequest.status ?? "NotStarted"]}}`}>
        {`Status: ${synthRequest.status ?? "NotStarted"}`}
      </p>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex gap-2">
          {synthRequest.status !== "Succeeded" && (
            <button
              className="block w-full px-4 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
              onClick={() =>
                refreshStatus(
                  `https://eastus.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/${
                    synthRequest.id ?? ""
                  }`
                )
              }
            >
              Refresh Status
            </button>
          )}

          {(synthRequest.status === "Succeeded" ||
            synthRequest.status === "Failed") && (
            <button
              className="block w-full px-4 py-2 text-lg text-white bg-red-500 border-0 rounded focus:outline-none hover:bg-red-600"
              onClick={() => deleteRequest(synthRequest.id ?? "")}
            >
              Delete
            </button>
          )}
        </div>

        {isDeleteError && (
          <p className="mb-4">
            <span className="text-red-500">
              {(deleteError as Error).message}
            </span>
          </p>
        )}
      </div>
    </li>
  );
};

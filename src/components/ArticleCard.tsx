import { useEffect, useRef } from "react";
import { useDeleteSynthRequest } from "src/hooks/useDeleteSythRequest";
import { useGetFiles } from "src/hooks/useGetFiles";
import { useRefreshStatus } from "src/hooks/useRefreshStatus";
import { useStreamZip } from "src/hooks/useStreamZip";
import { Article } from "src/lib/parseUrl";
import { useStore } from "src/stores/articles";

interface Props {
  article: Article;
}

const statusColors: Record<string, string> = {
  NotStarted: "bg-yellow-100",
  Running: "bg-orange-100",
  Succeeded: "bg-green-100",
  Failed: "bg-red-100",
};

export const ArticleCard = ({ article }: Props) => {
  const { refreshStatus } = useRefreshStatus();
  const { getFiles } = useGetFiles();
  const { stream, data } = useStreamZip();
  const { deleteRequest } = useDeleteSynthRequest();
  const deleteArticle = useStore((state) => state.deleteArticle);

  useEffect(() => {
    let id: NodeJS.Timer | undefined;
    if (article.status !== "Succeeded") {
      id = setInterval(() => {
        refreshStatus(article.synthStatusUrl ?? "");
      }, 30000);
    } else if (!article.downloadUrl) {
      getFiles(article.id ?? article.synthStatusUrl?.split("/").at(-1) ?? "");
    }

    return () => {
      if (id !== undefined) clearInterval(id);
    };
  }, [article, refreshStatus, getFiles]);

  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(data);

      if (ref.current) {
        ref.current.src = url;
        // ref.current.play();
      }
    }
  }, [data]);

  return (
    <li
      className={`p-4 border-r-2k border-solid border-gray-500 border ${
        statusColors[article.status ?? "NotStarted"]
      }`}
    >
      <h3 className="text-2xl">{article.title || article.url}</h3>
      <a
        href={article.url}
        className="text-indigo-500 hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {article.title || article.url}
      </a>
      <p>{`Length: ${article.length} characters`}</p>
      <p className={`${statusColors[article.status ?? "NotStarted"]}}`}>
        {`Status: ${article.status ?? "NotStarted"}`}
      </p>
      <div className="flex flex-col gap-2 my-2">
        <div className="flex gap-2">
          {article.status !== "Succeeded" && (
            <button
              className="block w-full px-4 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
              onClick={() => refreshStatus(article.synthStatusUrl ?? "")}
            >
              Refresh Status
            </button>
          )}

          {article.status === "Succeeded" && !article.downloadUrl && (
            <button
              className="block w-full px-4 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
              onClick={() =>
                getFiles(
                  article.id ?? article.synthStatusUrl?.split("/").at(-1) ?? ""
                )
              }
            >
              Get files
            </button>
          )}
        </div>
        {article.downloadUrl && (
          <div className="flex gap-2">
            <button
              disabled={Boolean(!article.downloadUrl)}
              className="block w-full px-4 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
            >
              <a href={article.downloadUrl} download>
                Download
              </a>
            </button>

            <button
              disabled={Boolean(!article.downloadUrl)}
              className="block w-full px-4 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
              onClick={() => {
                stream(article.downloadUrl ?? "");
              }}
            >
              Load Audio
            </button>

            <button
              className="block w-full px-4 py-2 text-lg text-white bg-red-500 border-0 rounded focus:outline-none hover:bg-red-600"
              onClick={() => {
                const id =
                  article.id ?? article.synthStatusUrl?.split("/").at(-1) ?? "";
                deleteArticle(id);
                deleteRequest(id);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <audio
        className="w-full"
        ref={ref}
        id="serverAudioStream"
        controls
        preload="none"
      ></audio>
    </li>
  );
};

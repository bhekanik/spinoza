import { useGetFiles } from "src/hooks/useGetFiles";
import { useRefreshStatus } from "src/hooks/useRefreshStatus";
import { useStore } from "src/stores/articles";

const statusColors: Record<string, string> = {
  NotStarted: "text-yellow-500",
  Running: "text-orange-500",
  Succeeded: "text-green-500",
  Failed: "text-red-500",
};

export const ArticleList = () => {
  const articles = useStore((state) => state.articles);
  console.log("articles:", articles);

  const { refreshStatus } = useRefreshStatus();
  const { getFiles } = useGetFiles();

  return (
    <>
      <h2 className="my-8 text-3xl font-bold">Your Articles</h2>
      <ul>
        {articles.map((article, index) => (
          <li key={`${article.title}-${index}`}>
            <div className="p-4 border-solid border-gray-500 border">
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
                {article.status ?? "NotStarted"}
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex gap-2">
                  <button
                    className="block w-full px-4 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
                    onClick={() => refreshStatus(article.synthStatusUrl ?? "")}
                  >
                    Refresh Status
                  </button>

                  <button
                    className="block w-full px-4 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
                    onClick={() => getFiles(article.synthStatusUrl ?? "")}
                  >
                    Get files
                  </button>
                </div>
                <button
                  disabled={Boolean(!article.downloadUrl)}
                  className="block w-full px-4 py-2 text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
                >
                  <a href={article.downloadUrl} download>
                    Download
                  </a>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

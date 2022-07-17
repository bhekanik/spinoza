import { useEffect } from "react";
import { useStore } from "src/stores/articles";
import { ArticleCard } from "./ArticleCard";

export const ArticleList = () => {
  const articles = useStore((state) => state.articles);
  const addArticles = useStore((state) => state.addArticles);

  useEffect(() => {
    const storedArticles =
      typeof window !== "undefined"
        ? JSON.parse(window.localStorage.getItem("articles") || "[]")
        : [];
    addArticles(storedArticles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col border p-2">
      <h2 className="my-2 text-3xl font-bold">Your Articles</h2>
      <ul className="flex flex-col gap-2">
        {articles.length === 0 && (
          <li className="text-center p-4 border-r-2k border-solid border-gray-500 border">
            <p className="text-gray-500">You have no articles.</p>
          </li>
        )}

        {articles.map((article, index) => (
          <ArticleCard article={article} key={`${article.title}-${index}`} />
        ))}
      </ul>
    </div>
  );
};

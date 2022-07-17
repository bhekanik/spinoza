import { Flex, Text } from "@chakra-ui/react";
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
    <Flex flexDir="column">
      <Text className="my-2 text-3xl font-bold">Your Articles</Text>
      <ul className="flex flex-col gap-2">
        {articles.length === 0 && (
          <li className="text-center p-4 border-r-2k border-solid border-gray-500 border">
            <Text className="text-gray-500">You have no articles.</Text>
          </li>
        )}

        {articles.map((article, index) => (
          <ArticleCard article={article} key={`${article.title}-${index}`} />
        ))}
      </ul>
    </Flex>
  );
};

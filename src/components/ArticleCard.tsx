import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDeleteSynthRequest } from "src/hooks/useDeleteSythRequest";
import { useGetFiles } from "src/hooks/useGetFiles";
import { useRefreshStatus } from "src/hooks/useRefreshStatus";
import { useStreamZip } from "src/hooks/useStreamZip";
import { Article } from "src/lib/parseUrl";
import { useStore } from "src/stores/articles";

interface Props {
  article: Article;
}

export const statusColors: Record<string, string> = {
  NotStarted: "yellow.100",
  Running: "orange.100",
  Succeeded: "green.100",
  Failed: "red.100",
};

export const statusColorsDark: Record<string, string> = {
  NotStarted: "yellow.900",
  Running: "orange.900",
  Succeeded: "teal.800",
  Failed: "red.900",
};

export const ArticleCard = ({ article }: Props) => {
  const { refreshStatus } = useRefreshStatus();
  const { getFiles } = useGetFiles();
  const { stream, data } = useStreamZip();
  const { deleteRequest } = useDeleteSynthRequest();
  const deleteArticle = useStore((state) => state.deleteArticle);

  const [src, setSrc] = useState<string>("");

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

  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(data);
      setSrc(url);
    }
  }, [data]);

  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (src) {
      if (ref.current) {
        ref.current.play();
      }
    }
  }, [src]);

  return (
    <Flex
      p={4}
      flexDir="column"
      border="1px solid"
      borderColor="gray.500"
      borderRadius={6}
      bg={`${statusColors[article.status ?? "NotStarted"]}`}
      _dark={{
        bg: `${statusColorsDark[article.status ?? "NotStarted"]}`,
      }}
    >
      <Text className="text-2xl">{article.title || article.url}</Text>
      <Link
        display="flex"
        gap={2}
        alignItems="center"
        color="teal.500"
        _dark={{
          color: "teal.100",
        }}
        target="_blank"
        href={article.url ?? ""}
      >
        {article.title || article.url || ""}
        <ExternalLinkIcon w={3} h={3} />
      </Link>
      <Text>{`Length: ${article.length} characters`}</Text>
      <Text className={`${statusColors[article.status ?? "NotStarted"]}}`}>
        {`Status: ${article.status ?? "NotStarted"}`}
      </Text>
      <Flex flexDir="column" gap={2} my={2} w="full">
        <Flex gap={2}>
          {article.status !== "Succeeded" && (
            <Button
              colorScheme="teal"
              onClick={() => refreshStatus(article.synthStatusUrl ?? "")}
            >
              Refresh Status
            </Button>
          )}

          {article.status === "Succeeded" && !article.downloadUrl && (
            <Button
              colorScheme="teal"
              onClick={() =>
                getFiles(
                  article.id ?? article.synthStatusUrl?.split("/").at(-1) ?? ""
                )
              }
            >
              Get files
            </Button>
          )}
        </Flex>
        {article.downloadUrl && (
          <Flex gap={2} w="full" justifyContent="end">
            <Button
              as="a"
              colorScheme="teal"
              isDisabled={Boolean(!article.downloadUrl)}
              href={article.downloadUrl}
              download
            >
              Download
            </Button>

            {!src && (
              <Button
                colorScheme="teal"
                isDisabled={Boolean(!article.downloadUrl)}
                onClick={() => {
                  stream(article.downloadUrl ?? "");
                }}
              >
                Play
              </Button>
            )}

            <Button
              colorScheme="red"
              onClick={() => {
                const id =
                  article.id ?? article.synthStatusUrl?.split("/").at(-1) ?? "";
                deleteArticle(id);
                deleteRequest(id);
              }}
            >
              Delete
            </Button>
          </Flex>
        )}
      </Flex>

      {src && (
        <audio
          className="w-full"
          id="serverAudioStream"
          ref={ref}
          controls
          src={src}
          preload="none"
        ></audio>
      )}
    </Flex>
  );
};

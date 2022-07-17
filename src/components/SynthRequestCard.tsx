import { Button, Flex, Text } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import { useDeleteSynthRequest } from "src/hooks/useDeleteSythRequest";
import { useRefreshStatus } from "src/hooks/useRefreshStatus";
import { SynthRequest } from "src/pages/api/all-synth";
import { statusColors, statusColorsDark } from "./ArticleCard";

interface Props {
  synthRequest: SynthRequest;
}

export const SynthRequestCard = ({ synthRequest }: Props) => {
  const { refreshStatus } = useRefreshStatus();
  const {
    deleteRequest,
    error: deleteError,
    isError: isDeleteError,
  } = useDeleteSynthRequest();

  return (
    <Flex
      p={4}
      flexDir="column"
      border="1px solid"
      borderColor="gray.500"
      borderRadius={6}
      bg={`${statusColors[synthRequest.status ?? "NotStarted"]}`}
      _dark={{
        bg: `${statusColorsDark[synthRequest.status ?? "NotStarted"]}`,
      }}
    >
      <Text className="text-2xl">
        {synthRequest.displayName || synthRequest.createdDateTime}
      </Text>
      <Text>{`Billable Character Length: ${synthRequest.properties.billableCharacterCount} characters`}</Text>
      <Text>{`Locale: ${synthRequest.locale}`}</Text>
      <Text>{`Created: ${formatRelative(
        new Date(synthRequest.createdDateTime),
        new Date()
      )}`}</Text>
      <Text className={`${statusColors[synthRequest.status ?? "NotStarted"]}}`}>
        {`Status: ${synthRequest.status ?? "NotStarted"}`}
      </Text>
      <Flex flexDir="column" gap={2} mt={2}>
        <Flex gap={2}>
          {synthRequest.status !== "Succeeded" && (
            <Button
              colorScheme="teal"
              onClick={() =>
                refreshStatus(
                  `https://eastus.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/${
                    synthRequest.id ?? ""
                  }`
                )
              }
            >
              Refresh Status
            </Button>
          )}

          {(synthRequest.status === "Succeeded" ||
            synthRequest.status === "Failed") && (
            <Button
              colorScheme="red"
              onClick={() => deleteRequest(synthRequest.id ?? "")}
            >
              Delete
            </Button>
          )}
        </Flex>

        {isDeleteError && (
          <Text mb={4} textColor="red.500">
            {(deleteError as Error).message}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

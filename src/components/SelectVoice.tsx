import { Flex, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { Select } from "src/components/Form/Select";
import { useVoices } from "src/hooks/useVoices";

type Gender = "male" | "female";

export const SelectVoice = () => {
  const { male, female } = useVoices();

  const [gender, setGender] = useState<Gender>("male");

  return (
    <Flex mb={2} gap={2} alignItems="center">
      <RadioGroup
        name="gender"
        onChange={(nextValue: Gender) => setGender(nextValue)}
        value={gender}
      >
        <Stack direction="row">
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
        </Stack>
      </RadioGroup>
      {gender === "male" ? (
        <Select
          data={male.map((m) => ({
            value: m.voiceName,
            label: `${m.label} (${m.locale})` ?? "",
          }))}
          defaultValue="en-US-GuyNeural"
          name="voice"
        />
      ) : (
        <Select
          data={female.map((f) => ({
            value: f.voiceName,
            label: `${f.label} (${f.locale})` ?? "",
          }))}
          defaultValue="en-GB-LibbyNeural"
          name="voice"
        />
      )}
    </Flex>
  );
};

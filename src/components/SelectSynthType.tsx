import { useState } from "react";
import { Select } from "src/components/Form/Select";
import { useVoices } from "src/hooks/useVoices";

type Gender = "male" | "female";

export const SelectSynthType = () => {
  const { male, female } = useVoices();

  const [gender, setGender] = useState<Gender>("male");

  return (
    <div className="flex justify-end mb-8">
      <div className="relative inline-flex self-center gap-2">
        <Select
          data={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          name="gender"
        />
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
      </div>
    </div>
  );
};

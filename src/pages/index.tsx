import type { NextPage } from "next";
import { useState } from "react";
import { Select } from "src/components/Form/Select";
import { ShortFormSynth } from "src/components/ShortFormSynth";
import { ArticleList } from "../components/ArticleList";
import { LongFormSynth } from "../components/LongFormSynth";

export type SynthType = "short" | "long";

const Home: NextPage = () => {
  const [synthType, setSynthType] = useState("short");

  return (
    <main className="px-6 pt-8">
      <div className="flex justify-end">
        <div className="relative inline-flex self-center gap-2">
          <Select
            data={[
              { value: "short", label: "Short Form Synth" },
              { value: "long", label: "Long Form Synth" },
            ]}
            defaultValue="short"
            value={synthType}
            onChange={(e) => setSynthType(e.target.value as SynthType)}
            name="synthType"
          />
        </div>
      </div>

      {synthType === "short" ? <ShortFormSynth /> : <LongFormSynth />}
      <ArticleList />
    </main>
  );
};

export default Home;

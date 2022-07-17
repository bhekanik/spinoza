import type { NextPage } from "next";
import { useState } from "react";
import { Select } from "src/components/Form/Select";
import { ShortFormSynth } from "src/components/ShortFormSynth";
import { SynthRequestList } from "src/components/SynthRequestList";
import { UrlSynth } from "src/components/UrlSynth";
import { ArticleList } from "../components/ArticleList";
import { LongFormSynth } from "../components/LongFormSynth";

export type SynthType = "short" | "long" | "url";

const Home: NextPage = () => {
  const [synthType, setSynthType] = useState("url");

  return (
    <main className="px-6 pt-8">
      <div className="flex justify-end">
        <div className="relative inline-flex self-center gap-2">
          <Select
            data={[
              { value: "short", label: "Short Form Synth" },
              { value: "url", label: "URL Synth" },
              { value: "long", label: "Long Form Synth" },
            ]}
            value={synthType}
            onChange={(e) => setSynthType(e.target.value as SynthType)}
            name="synthType"
          />
        </div>
      </div>

      {synthType === "long" && <LongFormSynth />}
      {synthType === "short" && <ShortFormSynth />}
      {synthType === "url" && <UrlSynth />}
      <div className="flex gap-2 w-full mt-2">
        <ArticleList />
        <SynthRequestList />
      </div>
    </main>
  );
};

export default Home;

import {
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useMediaQuery,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import { ShortFormSynth } from "src/components/ShortFormSynth";
import { SynthRequestList } from "src/components/SynthRequestList";
import { UrlSynth } from "src/components/UrlSynth";
import { AppLayout } from "src/layouts/App";
import { ArticleList } from "../components/ArticleList";
import { LongFormSynth } from "../components/LongFormSynth";

export type SynthType = "short" | "long" | "url";

const Home: NextPage = () => {
  const [synthType, setSynthType] = useState("long");
  const [isLessThan768] = useMediaQuery("(max-width: 768px)");

  return (
    <AppLayout p={isLessThan768 ? 4 : 16}>
      <RadioGroup
        name="gender"
        onChange={(nextValue: SynthType) => setSynthType(nextValue)}
        value={synthType}
      >
        <Stack direction="row">
          <Radio value="short">Short</Radio>
          <Radio value="long">Long</Radio>
          <Radio value="url">URL</Radio>
        </Stack>
      </RadioGroup>

      {synthType === "long" && <LongFormSynth />}
      {synthType === "short" && <ShortFormSynth />}
      {synthType === "url" && <UrlSynth />}
      <Tabs>
        <TabList>
          <Tab>Articles</Tab>
          <Tab>Syth Requests</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ArticleList />
          </TabPanel>
          <TabPanel>
            <SynthRequestList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </AppLayout>
  );
};

export default Home;

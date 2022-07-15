import type { NextPage } from "next"
import { ArticleList } from "../components/ArticleList"
import { InputLink } from "../components/InputLink"
import { SelectLanguage } from "../components/SelectLanguage"

const Home: NextPage = () => {
  return (
    <main className="px-6 py-10">
      <SelectLanguage />
      <InputLink />
      <ArticleList />
    </main>
  )
}

export default Home

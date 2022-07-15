import type { NextPage } from "next"
import { ArticleList } from "../components/ArticleList"
import { InputLink } from "../components/InputLink"
import { SelectLanguage } from "../components/SelectLanguage"
import { UploadFile } from "../components/UploadFile"

const Home: NextPage = () => {
  return (
    <main className="px-6 py-10">
      <SelectLanguage />
      <InputLink />
      <UploadFile />
      <ArticleList />
    </main>
  )
}

export default Home

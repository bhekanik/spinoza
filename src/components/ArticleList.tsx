import React from "react"

interface Article {
  title: string
  status: string
  streamUrl: string
}

export const ArticleList = () => {
  const articles: Article[] = [
    { title: "Art", status: "processing", streamUrl: "https://guidefari.com" },
    { title: "yo", status: "ready", streamUrl: "https://guidefari.com" },
    { title: "third", status: "error", streamUrl: "https://guidefari.com" },
  ]

  return (
    <>
      <h2 className="my-8 text-3xl font-bold">Your Articles</h2>
      <ul>
        {articles.map((article, index) => (
          <li key={`${article.title}-${index}`}>{article.title}</li>
        ))}
      </ul>
    </>
  )
}

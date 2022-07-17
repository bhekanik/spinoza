import { Article } from "src/lib/parseUrl";
import create from "zustand";

interface ArticlesState {
  articles: Article[];
  addArticle: (article: Article) => void;
  setStatus: (url: string, status: string) => void;
  setDownloadUrl: (inputUrl: string, downloadUrl: string) => void;
}

export const useStore = create<ArticlesState>((set) => ({
  articles: [],
  addArticle: (article: Article) =>
    set((state) => ({
      articles: [...state.articles, article],
    })),
  setStatus: (url: string, status: string) =>
    set((state) => ({
      articles: state.articles.map((article: Article) => {
        if (article.synthStatusUrl === url) {
          return { ...article, status };
        }
        return article;
      }),
    })),
  setDownloadUrl: (inputUrl: string, downloadUrl: string) =>
    set((state) => ({
      articles: state.articles.map((article: Article) => {
        if (article.synthStatusUrl === inputUrl) {
          return { ...article, downloadUrl };
        }
        return article;
      }),
    })),
}));

import { Article } from "src/lib/parseUrl";
import { SynthRequest } from "src/pages/api/all-synth";
import create from "zustand";
import { devtools } from "zustand/middleware";
interface ArticlesState {
  articles: Article[];
  addArticle: (article: Article) => void;
  addArticles: (articles: Article[]) => void;
  deleteArticle: (id: string) => void;
  setStatus: (url: string, status: string) => void;
  setDownloadUrl: (inputUrl: string, downloadUrl: string) => void;
  setStatusFromSynthRequests: (synthRequests: SynthRequest[]) => void;
}

export const useStore = create(
  devtools<ArticlesState>((set) => ({
    articles: [],
    deleteArticle: (id: string) =>
      set((state) => {
        const newState = state.articles.filter((article) => article.id !== id);
        window.localStorage.setItem("articles", JSON.stringify(newState));
        return {
          articles: newState,
        };
      }),
    addArticles: (articles: Article[]) =>
      set(() => {
        const newState = [...articles];
        window.localStorage.setItem("articles", JSON.stringify(newState));
        return {
          articles: newState,
        };
      }),
    addArticle: (article: Article) =>
      set((state) => {
        const newState = [...state.articles, article];
        window.localStorage.setItem("articles", JSON.stringify(newState));
        return {
          articles: newState,
        };
      }),
    setStatusFromSynthRequests: (synthRequests: SynthRequest[]) =>
      set((state) => {
        const newState = state.articles.map((article: Article) => {
          let newArticle = { ...article };
          synthRequests.forEach((synthRequest) => {
            if (article.id === synthRequest.id) {
              newArticle = { ...article, status: synthRequest.status };
            }
          });
          return newArticle;
        });
        window.localStorage.setItem("articles", JSON.stringify(newState));
        return {
          articles: newState,
        };
      }),
    setStatus: (url: string, status: string) =>
      set((state) => {
        const newState = state.articles.map((article: Article) => {
          if (article.synthStatusUrl === url) {
            return { ...article, status };
          }
          return article;
        });
        window.localStorage.setItem("articles", JSON.stringify(newState));
        return {
          articles: newState,
        };
      }),
    setDownloadUrl: (id: string, downloadUrl: string) =>
      set((state) => {
        const newState = state.articles.map((article: Article) => {
          if (article.id === id) {
            return { ...article, downloadUrl };
          }
          return article;
        });
        window.localStorage.setItem("articles", JSON.stringify(newState));
        return {
          articles: newState,
        };
      }),
  }))
);

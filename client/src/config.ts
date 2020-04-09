import { routePaths } from "./constants";

interface IPageMeta {
  titlePrefix: string;
  description?: string;
  index: boolean;
}

export default {
  api: {
    root: process.env.REACT_APP_API_ROOT ? process.env.REACT_APP_API_ROOT : window.location.origin
  },
  siteUrl: "https://monopoly-money.nitratine.net",
  pageMeta: {
    [routePaths.home]: {
      titlePrefix: "",
      description:
        "Monopoly Money helps you manage your finances in a game of monopoly from the browser.",
      index: true
    },
    [routePaths.join]: {
      titlePrefix: "Join Game",
      description: "Join a Monopoly Money game",
      index: true
    },
    [routePaths.newGame]: {
      titlePrefix: "New Game",
      description: "Create a new Monopoly Money game",
      index: true
    },
    [routePaths.funds]: {
      titlePrefix: "Funds",
      index: false
    },
    [routePaths.bank]: {
      titlePrefix: "Bank",
      description: "TODO",
      index: false
    },
    [routePaths.history]: {
      titlePrefix: "History",
      index: false
    },
    [routePaths.settings]: {
      titlePrefix: "Settings",
      index: false
    }
  }
} as {
  api: {
    root: string;
  };
  siteUrl: string;
  pageMeta: Record<string, IPageMeta>;
};

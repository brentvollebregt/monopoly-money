import { IPageMeta } from "./components/MetaTags";

export const siteUrl = "https://monopoly-money.nitratine.net";

export const bankName = "🏦 Bank";
export const freeParkingName = "🚗 Free Parking";

export const routePaths = {
  home: "/",
  join: "/join",
  newGame: "/new-game",
  funds: "/funds",
  bank: "/bank",
  history: "/history",
  settings: "/settings",
  help: "/help"
};

export const pageMeta: Record<string, IPageMeta> = {
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
    titlePrefix: "Manage Funds",
    index: false
  },
  [routePaths.bank]: {
    titlePrefix: "Bank",
    index: false
  },
  [routePaths.history]: {
    titlePrefix: "History",
    index: false
  },
  [routePaths.settings]: {
    titlePrefix: "Settings",
    index: false
  },
  [routePaths.help]: {
    titlePrefix: "Help",
    index: false
  }
};

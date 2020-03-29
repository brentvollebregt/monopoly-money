export default {
  api: {
    root: process.env.REACT_APP_API_ROOT ? process.env.REACT_APP_API_ROOT : window.location.origin
  },
  siteUrl: "https://monopoly-money.nitratine.net",
  routeDescriptions: {
    "/": "Monopoly Money helps you manage your finances in a game of monopoly from the browser."
  },
  noIndexRoutes: ["/funds", "/bank", "/transactions", "/game"]
} as {
  api: {
    root: string;
  };
  siteUrl: string;
  routeDescriptions: Record<string, string>;
  noIndexRoutes: string[];
};

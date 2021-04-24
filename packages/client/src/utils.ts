import { IGameStatePlayer } from "@monopoly-money/game-state";

export const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export const sortPlayersByName = (players: IGameStatePlayer[]) =>
  players.slice().sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

// gtag.js integration

interface WindowWithGTag extends Window {
  gtag: (...args: any) => void;
}

const getWindowWithGTag = () => {
  return (window as unknown) as WindowWithGTag;
};

export const trackPageView = () => {
  getWindowWithGTag().gtag("event", "page_view", {
    page_location: window.location.origin + window.location.pathname,
    page_path: window.location.pathname,
    page_title: document.title
  });
};

export const trackUnexpectedServerDisconnection = () => {
  getWindowWithGTag().gtag("event", "Unexpected server disconnection", {
    event_category: "Network",
    non_interaction: true
  });
};

import { IGameStatePlayer } from "@monopoly-money/game-state";

export const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export const sortPlayersByName = (players: IGameStatePlayer[]) =>
  players.slice().sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

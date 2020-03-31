import { Event } from "../../src/gameStore/types";

export interface IGameState {
  gameId: string;
  userId: string;
  isBanker: boolean;
  events: Event[];
}

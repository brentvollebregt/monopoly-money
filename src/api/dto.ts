import { Event } from "../gameStore/types";

// REST HTTP Types

export interface ICreateGameRequest {
  name: string;
}

export interface IJoinGameRequest {
  name: string;
}

export interface IJoinGameResponse {
  gameId: string;
  userToken: string; // A user id is used to identify a user
}

export interface IDoesGameExistRequest {
  gameId: string;
  userToken: string;
}

export interface IGameStatusSummary {
  createdTime: string; // ISO DateTime string
  players: Record<string, number>; // Players and balances
}

// Websocket Incoming Message Types

export type IncomingMessage =
  | IAuthMessage
  | IBankerGiveToPlayerMessage
  | IBankerTakeFromPlayerMessage;

export interface IAuthMessage {
  type: "auth";
  gameId: string;
  userToken: string;
}

export interface IBankerGiveToPlayerMessage {
  type: "bankerGiveToPlayer";
}

export interface IBankerTakeFromPlayerMessage {
  type: "bankerTakeFromPlayer";
}

// Websocket Outgoing Message Types

export type OutgoingMessage = IInitialEventArrayMessage;

export interface IInitialEventArrayMessage {
  type: "initialEventArray";
  events: Event[];
}

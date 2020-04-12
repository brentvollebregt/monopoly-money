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

// Websocket Incoming Message Types (server <= client)

export type IncomingMessage = IAuthMessage | IProposeEventMessage;

export interface IAuthMessage {
  type: "auth";
  gameId: string;
  userToken: string;
}

export interface IProposeEventMessage {
  type: "proposeEvent";
  event: Event;
}

// Websocket Outgoing Message Types (server => client)

export type OutgoingMessage = IInitialEventArrayMessage | INewEventMessage;

export interface IInitialEventArrayMessage {
  type: "initialEventArray";
  events: Event[];
}

export interface INewEventMessage {
  type: "newEvent";
  event: Event;
}

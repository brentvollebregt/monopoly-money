import * as websocket from "ws";
import { DateTime } from "luxon";

export type Event =
  | IPlayerJoinEvent
  | IPlayerDeleteEvent
  | IPlayerNameChangeEvent
  | IPlayerBankerStatusChange
  | ITransactionEvent;

export interface IGame {
  code: string; // The code associated with the game instance
  open: boolean; // Whether the game is open to people joining
  events: Event[]; // Events in this game
  subscribedWebsockets: websocket[]; // Players listening to events
  bankers: string[]; // Ids of those players who have banker privileges
  userTokenToPlayers: Record<string, string>; // A mapping of ids only known by a user to match to a player
}

export interface IEvent {
  time: DateTime;
  actionedBy: "system" | "banker" | string;
}

export interface IPlayerJoinEvent extends IEvent {
  type: "playerJoin";
  id: string;
  name: string;
}

export interface IPlayerDeleteEvent extends IEvent {
  type: "playerDelete";
  id: string;
}

export interface IPlayerNameChangeEvent extends IEvent {
  type: "playerNameChange";
  id: string;
  name: string;
}

export interface IPlayerBankerStatusChange extends IEvent {
  type: "playerBankerStatusChange";
  id: string;
  isBanker: boolean;
}

export interface ITransactionEvent extends IEvent {
  type: "transaction";
  from: "banker" | "freeParking" | string;
  to: "banker" | "freeParking" | string;
  amount: number;
}

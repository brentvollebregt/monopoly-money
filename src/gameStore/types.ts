import * as websocket from "ws";

type PlayerId = string;

export interface IGame {
  code: string; // The code associated with the game instance
  open: boolean; // Whether the game is open to people joining
  events: Event[]; // Events in this game
  subscribedWebSockets: websocket[]; // Players listening to events
  bankers: PlayerId[]; // Ids of those players who have banker privileges
  userTokenToPlayers: Record<string, PlayerId>; // A mapping of ids only known by a user to match to a player
}

export type Event =
  | IPlayerJoinEvent
  | IPlayerDeleteEvent
  | IPlayerNameChangeEvent
  | IPlayerBankerStatusChangeEvent
  | ITransactionEvent
  | IGameOpenStateChangeEvent;

export interface IEvent {
  time: string; // ISO string
  actionedBy: "system" | "banker" | PlayerId;
}

export interface IPlayerJoinEvent extends IEvent {
  type: "playerJoin";
  playerId: PlayerId;
  name: string;
}

export interface IPlayerDeleteEvent extends IEvent {
  type: "playerDelete";
  playerId: PlayerId;
}

export interface IPlayerNameChangeEvent extends IEvent {
  type: "playerNameChange";
  playerId: PlayerId;
  name: string;
}

export interface IPlayerBankerStatusChangeEvent extends IEvent {
  type: "playerBankerStatusChange";
  playerId: PlayerId;
  isBanker: boolean;
}

export interface ITransactionEvent extends IEvent {
  type: "transaction";
  from: "banker" | "freeParking" | PlayerId;
  to: "banker" | "freeParking" | PlayerId;
  amount: number;
}

export interface IGameOpenStateChangeEvent extends IEvent {
  type: "gameOpenStateChange";
  open: boolean;
}

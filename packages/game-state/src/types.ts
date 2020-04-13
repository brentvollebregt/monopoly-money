export type PlayerId = string;

// Game state

export interface IGameStatePlayer {
  playerId: PlayerId;
  name: string;
  banker: boolean;
  balance: number;
}

export interface IGameState {
  players: IGameStatePlayer[];
  freeParkingBalance: number;
  open: boolean;
}

// Game events

export type GameEvent =
  | IPlayerJoinEvent
  | IPlayerDeleteEvent
  | IPlayerNameChangeEvent
  | IPlayerBankerStatusChangeEvent
  | ITransactionEvent
  | IGameOpenStateChangeEvent;

export interface IGameEvent {
  time: string; // ISO string
  actionedBy: "system" | "banker" | PlayerId;
}

export interface IPlayerJoinEvent extends IGameEvent {
  type: "playerJoin";
  playerId: PlayerId;
  name: string;
}

export interface IPlayerDeleteEvent extends IGameEvent {
  type: "playerDelete";
  playerId: PlayerId;
}

export interface IPlayerNameChangeEvent extends IGameEvent {
  type: "playerNameChange";
  playerId: PlayerId;
  name: string;
}

export interface IPlayerBankerStatusChangeEvent extends IGameEvent {
  type: "playerBankerStatusChange";
  playerId: PlayerId;
  isBanker: boolean;
}

export interface ITransactionEvent extends IGameEvent {
  type: "transaction";
  from: "banker" | "freeParking" | PlayerId;
  to: "banker" | "freeParking" | PlayerId;
  amount: number;
}

export interface IGameOpenStateChangeEvent extends IGameEvent {
  type: "gameOpenStateChange";
  open: boolean;
}

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

export interface IGameStatus {
  createdTime: Date;
  players: Record<string, number>; // Players and balances
}

// Websocket Incoming Message Types

export type IncomingMessage = IBankerGiveToPlayerMessage | IBankerTakeFromPlayerMessage;

export interface IBankerGiveToPlayerMessage {
  type: "bankerGiveToPlayer";
}

export interface IBankerTakeFromPlayerMessage {
  type: "bankerTakeFromPlayer";
}

// Websocket Outgoing Message Types

export type OutgoingMessage = ITemp1;

export interface ITemp1 {
  type: "ITemp1";
}

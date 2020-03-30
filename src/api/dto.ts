// REST HTTP Types

export interface ICreateGameRequest {
  name: string;
}

export interface IJoinGameRequest {
  gameId: string;
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

export interface IDoesGameExistResponse {
  createdTime: Date;
  players: Record<string, number>; // Players and balances
}

// Websocket Incoming Message Types

export type IncomingMessage = ICreateGameMessage | IDoesGameExistMessage | IJoinGameMessage;

export interface ICreateGameMessage {
  type: "createGame";
  bankerName: string;
}

export interface IDoesGameExistMessage {
  type: "doesGameExist";
  gameId: string;
}

export interface IJoinGameMessage {
  type: "joinGame";
  gameId: string;
  name: string;
}

// Websocket Outgoing Message Types

export type OutgoingMessage = IDoesGameExistResponseMessage;

export interface IDoesGameExistResponseMessage {
  type: "doesGameExistResponse";
  gameId: string;
  exists: boolean;
}

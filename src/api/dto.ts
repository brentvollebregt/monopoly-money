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

export type OutgoingMessage = IDoesGameExistResponseMessage;

export interface IDoesGameExistResponseMessage {
  type: "doesGameExistResponse";
  gameId: string;
  exists: boolean;
}

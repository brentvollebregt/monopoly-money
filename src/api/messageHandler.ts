import * as websocket from "ws";
import { IUserData } from "./index";
import GameStore from "../gameStore";

const gameStore = new GameStore();

interface ICreateGameMessage {
  type: "createGame";
  bankerName: string;
}

const createGame = (ws: websocket, { bankerName }: ICreateGameMessage) => {
  gameStore.createGame(ws, bankerName);
};

interface IDoesGameExistMessage {
  type: "doesGameExist";
  gameId: string;
}

interface IDoesGameExistResponseMessage {
  type: "doesGameExistResponse";
  gameId: string;
  exist: boolean;
}

const doesGameExist = ({ gameId }: IDoesGameExistMessage): IDoesGameExistResponseMessage => {
  return {
    type: "doesGameExistResponse",
    gameId,
    exist: true
  };
};

interface IJoinGameMessage {
  type: "joinGame";
  gameId: string;
  name: string;
}

const joinGame = (ws: websocket, { gameId, name }: IJoinGameMessage) => {};

type IncomingMessage = ICreateGameMessage | IDoesGameExistMessage | IJoinGameMessage;

const handleMessage = (ws: websocket, userData: IUserData, messageString: string) => {
  const message = JSON.parse(messageString) as IncomingMessage;

  switch (message.type) {
    case "createGame":
      createGame(ws, message);
      return;
    case "doesGameExist":
      const response = doesGameExist(message);
      ws.send(JSON.stringify(response));
      return;
    case "joinGame":
      joinGame(ws, message);
      return;
  }
};

export default handleMessage;

import * as websocket from "ws";
import { IUserData } from "./index";
import GameStore from "../gameStore";
import { IncomingMessage, IDoesGameExistResponseMessage } from "./dto";

export type MessageHandler = (ws: websocket, userData: IUserData, message: IncomingMessage) => void;

const gameStore = new GameStore();

export const createGame: MessageHandler = (ws, userData, message) => {
  if (message.type === "createGame") {
    const { gameId, playerId } = gameStore.createGame(ws, message.bankerName);
    userData.gameId = gameId;
    userData.playerId = playerId;
  }
};

export const doesGameExist: MessageHandler = (ws, userData, message) => {
  if (message.type === "doesGameExist") {
    const exists = gameStore.doesGameExist(message.gameId);
    const outgoingMessage: IDoesGameExistResponseMessage = {
      type: "doesGameExistResponse",
      gameId: message.gameId,
      exists
    };
    ws.send(JSON.stringify(outgoingMessage));
  }
};

const joinGame: MessageHandler = (ws, userData, message) => {};

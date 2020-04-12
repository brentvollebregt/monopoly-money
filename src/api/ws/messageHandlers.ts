import * as websocket from "ws";
import gameStore from "../../gameStore";
import { IncomingMessage, IInitialEventArrayMessage } from "../dto";
import { IUserData } from "../types";

const isAuthenticated = (ws: websocket, { gameId, userToken }: IUserData): boolean => {
  // If the user has not sent an IAuthMessage
  if (gameId === null || userToken === null) {
    ws.close();
    return false;
  }
  // If the game does no longer exist
  if (!gameStore.doesGameExist(gameId)) {
    ws.close();
    return false;
  }
  // If user is not in the game
  if (!gameStore.isUserInGame(gameId, userToken)) {
    ws.close();
    return false;
  }
  return true;
};

const isBanker = ({ gameId, userToken }: IUserData): boolean => {
  return gameStore.isUserABanker(gameId, userToken);
};

export type MessageHandler = (ws: websocket, userData: IUserData, message: IncomingMessage) => void;

export const authMessage: MessageHandler = (ws, userData, message) => {
  if (message.type === "auth") {
    // If the game does no longer exist or the user is not in the game, end the connection
    if (
      !gameStore.doesGameExist(message.gameId) ||
      !gameStore.isUserInGame(message.gameId, message.userToken)
    ) {
      ws.close();
      return false;
    }

    // Setup user data
    userData.gameId = message.gameId;
    userData.userToken = message.userToken;

    // Subscribe this websocket to game events
    gameStore.subscribeWebSocketToEvents(userData.gameId, ws);

    // Send initial events
    const outgoingMessage: IInitialEventArrayMessage = {
      type: "initialEventArray",
      events: gameStore.getGameEvents(userData.gameId)
    };
    ws.send(JSON.stringify(outgoingMessage));
  }
};

export const proposeEvent: MessageHandler = (ws, userData, message) => {
  if (message.type === "proposeEvent") {
    if (!isAuthenticated(ws, userData)) {
      return;
    }
    const isPlayerBanker = isBanker(userData);
    const event = message.event;

    // TODO handle event (check for validity)
  }
};

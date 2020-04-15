import * as websocket from "ws";
import gameStore from "../../gameStore";
import { IncomingMessage } from "../dto";
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
  const game = gameStore.getGame(gameId);
  if (!game.isUserInGame(userToken)) {
    ws.close();
    return false;
  }
  return true;
};

export type MessageHandler = (ws: websocket, userData: IUserData, message: IncomingMessage) => void;

export const authMessage: MessageHandler = (ws, userData, message) => {
  if (message.type === "auth") {
    // If the game does no longer exist or the user is not in the game, end the connection
    if (!gameStore.doesGameExist(message.gameId)) {
      ws.close();
      return false;
    }
    const game = gameStore.getGame(message.gameId);
    if (!game.isUserInGame(message.userToken)) {
      ws.close();
      return false;
    }

    // Setup user data
    userData.gameId = message.gameId;
    userData.userToken = message.userToken;

    // Subscribe this websocket to game events
    game.subscribeWebSocketToEvents(ws);
  }
};

export const proposeEvent: MessageHandler = (ws, { gameId, userToken }, message) => {
  if (message.type === "proposeEvent") {
    if (!isAuthenticated(ws, { gameId, userToken })) {
      return;
    }
    if (gameId === null || userToken === null) {
      throw new Error("Invalid state. isBanker check made when gameId/userToken is null");
    }
    const game = gameStore.getGame(gameId);
    const isPlayerBanker = game.isUserABanker(userToken);
    const playerId = game.getPlayerId(userToken);
    const event = message.event;

    // Authorization filtering
    switch (event.type) {
      case "transaction":
        if ((event.from === "bank" || event.from === "freeParking") && !isPlayerBanker) {
          return; // Only bankers can send money from the bank or free parking
        } else if (
          event.from !== "bank" &&
          event.from !== "freeParking" &&
          event.from !== playerId
        ) {
          return; // If a user is not a banker, they cannot send money from anyone but themselves
        }
        break;
      case "playerNameChange":
        if (!isPlayerBanker && playerId !== event.playerId) {
          return; // Only a banker or the modified player can change their name
        }
        break;
      case "playerDelete":
        if (!isPlayerBanker && playerId !== event.playerId) {
          return; // Only a banker or the player themselves can remove a player from the game
        }
        break;
    }

    game.addEvent(event, playerId);
  }
};

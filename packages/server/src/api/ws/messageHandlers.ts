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

export const onMessageStreamClosed = (ws: websocket, userData: IUserData) => {
  if (userData.gameId !== null && userData.userToken !== null && isAuthenticated(ws, userData)) {
    const game = gameStore.getGame(userData.gameId);
    const playerId = game.getPlayerId(userData.userToken);
    game.removePlayerWebSocket(playerId);

    // Tell the game that this player is now disconnected
    game.playerConnectionStatusChange(playerId, false);
  }
};

export type MessageHandler = (ws: websocket, userData: IUserData, message: IncomingMessage) => void;

export const authMessage: MessageHandler = (ws, userData, message) => {
  if (message.type === "auth") {
    // If the game does no longer exist or the user is not in the game, end the connection
    if (!gameStore.doesGameExist(message.gameId)) {
      ws.close();
      return;
    }
    const game = gameStore.getGame(message.gameId);
    if (!game.isUserInGame(message.userToken)) {
      ws.close();
      return;
    }

    // Setup user data
    userData.gameId = message.gameId;
    userData.userToken = message.userToken;

    // Subscribe this websocket to game events
    const playerId = game.getPlayerId(userData.userToken);
    game.subscribeWebSocketToEvents(ws, playerId);
  }
};

export const proposeEvent: MessageHandler = (ws, { gameId, userToken }, message) => {
  if (message.type === "proposeEvent") {
    if (!isAuthenticated(ws, { gameId, userToken })) {
      return;
    }
    if (gameId === null || userToken === null) {
      throw new Error("Invalid state. proposeEvent continued when gameId/userToken is null");
    }
    const game = gameStore.getGame(gameId);
    const isPlayerBanker = game.isUserABanker(userToken);
    const playerId = game.getPlayerId(userToken);
    const event = message.event;

    // Authorization filtering
    switch (event.type) {
      case "transaction":
        if (event.amount <= 0) {
          return; // All transactions must have an amount greater than 0
        }
        if ((event.from === "bank" || event.from === "freeParking") && !isPlayerBanker) {
          return; // Only bankers can send money from the bank or free parking
        } else if (
          event.from !== "bank" &&
          event.from !== "freeParking" &&
          event.from !== playerId &&
          !isPlayerBanker
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
      case "playerConnectionChange":
        if (event.playerId !== playerId) {
          return; // Players can only update their own connection status
        }
    }

    game.addEvent(event, playerId);
  }
};

export const proposeEndGame: MessageHandler = (ws, { gameId, userToken }, message) => {
  if (message.type === "proposeEndGame") {
    if (!isAuthenticated(ws, { gameId, userToken })) {
      return;
    }
    if (gameId === null || userToken === null) {
      throw new Error("Invalid state. proposeEndGame continued when gameId/userToken is null");
    }
    const game = gameStore.getGame(gameId);
    const isPlayerBanker = game.isUserABanker(userToken);

    if (isPlayerBanker) {
      game.endGame();
    }
  }
};

export const heartBeat: MessageHandler = (ws, { gameId, userToken }, message) => {
  if (message.type === "heartBeat") {
    // No operations required
    return;
  }
};

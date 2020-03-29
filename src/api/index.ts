import * as http from "http";
import * as https from "https";
import * as websocket from "ws";
import { MessageHandler, createGame, doesGameExist } from "./messageHandlers";
import { IncomingMessage } from "./dto";

export interface IUserData {
  gameId: string | null;
  playerId: string | null;
}

// Function that take a message and decide whether to act on it
const messageHandlers: MessageHandler[] = [createGame, doesGameExist];

// TODO Some identifier so connections can be re-established to a player

// Setup the websocket API
export const setupWebsocketAPI = (server: http.Server | https.Server) => {
  const wss = new websocket.Server({ server, path: "/" });

  wss.on("connection", (ws: websocket) => {
    const userData: IUserData = {
      gameId: null,
      playerId: null
    };

    ws.on("message", (message: string) => {
      const incomingMessage = JSON.parse(message) as IncomingMessage;
      messageHandlers.forEach(messageHandler => {
        messageHandler(ws, userData, incomingMessage);
      });
    });

    ws.on("close", (code: number, reason: string) => {
      // TODO Handle clients leaving
    });
  });
};

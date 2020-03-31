import * as http from "http";
import * as https from "https";
import * as websocket from "ws";
import { MessageHandler, bankerGiveToPlayer, bankerTakeFromPlayer } from "./messageHandlers";
import { IncomingMessage } from "../dto";
import { IUserData } from "../types";

// Function that take a message and decide whether to act on it
const messageHandlers: MessageHandler[] = [bankerGiveToPlayer, bankerTakeFromPlayer];

// Setup the websocket API
const setupWebsocketAPI = (server: http.Server | https.Server) => {
  const wss = new websocket.Server({ server, path: "/api/events" });

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

export default setupWebsocketAPI;

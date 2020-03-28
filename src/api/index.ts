import * as http from "http";
import * as https from "https";
import * as websocket from "ws";
import handleMessage from "./messageHandler";

export interface IUserData {
  gameId: string | null;
  playerId: string | null;
}

// Setup the websocket API
export const setupWebsocketAPI = (server: http.Server | https.Server) => {
  const wss = new websocket.Server({ server, path: "/" });

  wss.on("connection", (ws: websocket) => {
    const userData: IUserData = {
      gameId: null,
      playerId: null
    };

    ws.on("message", (message: string) => {
      handleMessage(ws, userData, message);
    });
  });
};

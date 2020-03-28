import * as http from "http";
import * as https from "https";
import * as websocket from "ws";

// Setup the websocket API
export const setupWebsocketAPI = (server: http.Server | https.Server) => {
  const wss = new websocket.Server({ server, path: "/" });

  wss.on("connection", (ws: websocket) => {
    console.log("new!");
    ws.on("message", msg => {
      console.log(msg);
      ws.send(`Got: ${msg}`);
    });
  });
};

import dotenv from "dotenv";
dotenv.config(); // Setup .env

import express from "express";
import * as http from "http";
import Config from "./config";
import { setupCors, setupFrontendServing } from "./http";
import { setupWebsocketAPI } from "./api";

const app = express();
const server = http.createServer(app);

setupCors(app);
setupFrontendServing(app);
setupWebsocketAPI(server);

server.listen(Config.server.port, () => {
  console.log(`Listening on ${Config.server.port}`);
});

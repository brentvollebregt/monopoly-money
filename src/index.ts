import dotenv from "dotenv";
dotenv.config(); // Setup .env

import express from "express";
import expressWs from "express-ws";
import path from "path";
import Config from "./config";

const expressApp = express();
const { app } = expressWs(expressApp);

// CORS
app.use((req, res, next) => {
  const origin = req.get("origin") || req.get("referrer");
  if (Config.server.allowed_origins.indexOf(origin) !== -1) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Static files from the React app
const clientBuildDirectory = path.join(__dirname, Config.client.relative_build_directory);
app.use(express.static(clientBuildDirectory)); // Non-index.html files
Config.client.routes.forEach(route =>
  app.use(route, express.static(path.join(clientBuildDirectory, "index.html")))
);

app.ws("/", function(ws, req) {
  ws.send("Connected");

  ws.on("message", function(msg) {
    console.log(msg);
    ws.send(`Got: ${msg}`);
  });
});

app.listen(Config.server.port, () => {
  console.log(`Listening on ${Config.server.port}`);
});

import express, { Express } from "express";
import path from "path";
import Config from "../config";

// Setup CORS as per server.allowed_origins
export const setupCors = (app: Express) => {
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
};

// Setup the serving of the frontend React app
export const setupFrontendServing = (app: Express) => {
  const clientBuildDirectory = path.join(__dirname, Config.client.relative_build_directory);
  app.use(express.static(clientBuildDirectory)); // Non-index.html files
  Config.client.routes.forEach(route =>
    app.use(route, express.static(path.join(clientBuildDirectory, "index.html")))
  );
};

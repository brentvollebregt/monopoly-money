import express from "express";
import gameStore from "../../gameStore";
import {
  ICreateGameRequest,
  IDoesGameExistRequest,
  IJoinGameRequest,
  IJoinGameResponse,
  IDoesGameExistResponse
} from "../dto";

export const subRoute = "/api/game";

const router = express.Router();

// Create a new game
router.post("/", (req, res) => {
  const { name } = req.body as ICreateGameRequest;

  const { gameId, userToken } = gameStore.createGame(name);

  const response: IJoinGameResponse = { gameId, userToken };
  res.json(response);
  res.end();
});

// Join a game
router.get("/:gameId", (req, res) => {
  const { gameId, name } = req.body as IJoinGameRequest;

  if (!gameStore.doesGameExist(gameId)) {
    res.status(404).send("Game does not exist");
  } else if (!gameStore.isGameOpen(gameId)) {
    res.status(403).send("Game is not open");
  } else {
    const userToken = gameStore.addPlayer(gameId, name);

    const response: IJoinGameResponse = { gameId, userToken };
    res.json(response);
  }

  res.end();
});

// Check if a game still exists
router.post("/:gameId", (req, res) => {
  const { gameId, userToken } = req.body as IDoesGameExistRequest;

  if (!gameStore.doesGameExist(gameId)) {
    res.status(404).send("Game does not exist");
  } else if (!gameStore.isUserInGame(gameId, userToken)) {
    res.status(401).send("You are not permitted to make this operation");
  } else {
    const state = gameStore.gameStatus(gameId); // TODO

    const response: IDoesGameExistResponse = {
      createdTime: new Date(),
      players: {}
    };
    res.json(response);
  }

  res.end();
});

export default router;

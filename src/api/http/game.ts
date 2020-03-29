import express from "express";
import gameStore from "../../gameStore";

export const subRoute = "/api/game";

const router = express.Router();

// Create a new game
router.post("/", (req, res) => {
  console.log("POST /api/game");
  // TODO
  res.end();
});

// Check if a game still exists
router.get("/:gameId", (req, res) => {
  console.log("GET /api/game/" + req.params.gameId);
  // TODO
  res.end();
});

// Join a game
router.post("/:gameId", (req, res) => {
  console.log("POST /api/game/" + req.params.gameId);
  // TODO
  res.end();
});

export default router;

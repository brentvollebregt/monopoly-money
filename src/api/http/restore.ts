import express from "express";
import gameStore from "../../gameStore";

export const subRoute = "/api/restore";

const router = express.Router();

// Restore a game
router.post("/", (req, res) => {
  console.log("POST /api/restore");
  // TODO
  res.end();
});

export default router;

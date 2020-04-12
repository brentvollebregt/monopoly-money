import { useState, useEffect } from "react";
import GameHandler from "../logic/GameHandler";
import { IGameState } from "../../../src/gameStore/calculateState";
import { Event } from "../../../src/gameStore/types";

export interface IGameHandlerAuthInfo {
  gameId: string;
  userToken: string;
  playerId: string;
}

export interface IGameHandlerState extends IGameState {
  isBanker: boolean;
  events: Event[];
}

const useGameHandler = (authInfo: IGameHandlerAuthInfo | null): IGameHandlerState | null => {
  const [gameHandler, setGameHandler] = useState<GameHandler | null>(null);

  // Create / destroy the game handler when new new auth is provided
  useEffect(() => {
    if (authInfo === null) {
      setGameHandler(null);
    } else {
      setGameHandler(new GameHandler(authInfo.gameId, authInfo.userToken, authInfo.playerId));
    }
  }, [authInfo]);

  return gameHandler === null
    ? null
    : {
        ...gameHandler.getState(),
        isBanker: gameHandler.amIABanker(),
        events: gameHandler.getEvents()
      };
};

export default useGameHandler;

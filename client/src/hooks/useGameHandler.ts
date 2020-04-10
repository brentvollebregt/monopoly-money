import { useState, useEffect } from "react";
import GameHandler from "../logic/GameHandler";

export interface IGameHandlerAuthInfo {
  gameId: string;
  userToken: string;
}

const useGameHandler = (authInfo: IGameHandlerAuthInfo | null) => {
  const [gameHandler, setGameHandler] = useState<GameHandler | null>(null);

  // Create / destroy the game handler when new new auth is provided
  useEffect(() => {
    console.log(
      "new authInfo in useGameHandler. (make sure this is not called unnecessarily)",
      authInfo
    );
    if (authInfo === null) {
      setGameHandler(null);
    } else {
      setGameHandler(new GameHandler(authInfo.gameId, authInfo.userToken));
    }
  }, [authInfo]);

  return gameHandler === null ? null : gameHandler.getCurrentState();
};

export default useGameHandler;

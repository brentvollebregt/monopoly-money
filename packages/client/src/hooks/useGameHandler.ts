import { useState, useEffect, useCallback } from "react";
import GameHandler from "../logic/GameHandler";
import { GameEvent, IGameState, GameEntity } from "@monopoly-money/game-state";

export interface IGameHandlerAuthInfo {
  gameId: string;
  userToken: string;
  playerId: string;
}

export interface IGameHandlerState extends IGameState {
  isBanker: boolean;
  events: GameEvent[];
  actions: {
    proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
  };
}

const useGameHandler = (authInfo: IGameHandlerAuthInfo | null): IGameHandlerState | null => {
  const [gameHandler, setGameHandler] = useState<GameHandler | null>(null);

  // Used to trigger updates from the GameHandler
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  // Create / destroy the game handler when new new auth is provided
  useEffect(() => {
    if (authInfo === null) {
      setGameHandler(null);
    } else {
      setGameHandler(
        new GameHandler(authInfo.gameId, authInfo.userToken, authInfo.playerId, () => forceUpdate())
      );
    }
  }, [authInfo]);

  return gameHandler === null
    ? null
    : {
        ...gameHandler.getState(),
        isBanker: gameHandler.amIABanker(),
        events: gameHandler.getEvents(),
        actions: {
          proposeTransaction: gameHandler.proposeTransaction.bind(gameHandler)
        }
      };
};

export default useGameHandler;

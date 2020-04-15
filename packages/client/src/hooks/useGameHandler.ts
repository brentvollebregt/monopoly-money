import { useState, useEffect, useCallback } from "react";
import GameHandler from "../logic/GameHandler";
import { GameEvent, IGameState, GameEntity } from "@monopoly-money/game-state";

export interface IGameHandlerAuthInfo {
  gameId: string;
  userToken: string;
  playerId: string;
}

export interface IGameHandlerState extends IGameState {
  gameId: string;
  playerId: string;
  isBanker: boolean;
  events: GameEvent[];
  actions: {
    proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
    proposePlayerNameChange: (playerId: string, name: string) => void;
    proposePlayerDelete: (playerId: string) => void;
    proposeGameOpenStateChange: (open: boolean) => void;
    proposeGameEnd: () => void;
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
      // TODO && gameHandler !== null => stop the socket
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
        gameId: gameHandler.gameId,
        playerId: gameHandler.playerId,
        isBanker: gameHandler.amIABanker(),
        events: gameHandler.getEvents(),
        actions: {
          proposeTransaction: gameHandler.proposeTransaction.bind(gameHandler),
          proposePlayerNameChange: gameHandler.proposePlayerNameChange.bind(gameHandler),
          proposePlayerDelete: gameHandler.proposePlayerDelete.bind(gameHandler),
          proposeGameOpenStateChange: gameHandler.proposeGameOpenStateChange.bind(gameHandler),
          proposeGameEnd: gameHandler.proposeGameEnd.bind(gameHandler)
        }
      };
};

export default useGameHandler;

import { useState, useEffect, useCallback } from "react";
import cogoToast from "cogo-toast";
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

const onDisplayMessage = (message: string) => {
  const { hide } = cogoToast.info(message, {
    position: "bottom-center",
    hideAfter: 10,
    onClick: () => hide && hide()
  });
};

const useGameHandler = (): {
  game: IGameHandlerState | null;
  authInfo: IGameHandlerAuthInfo | null;
  initialize: (auth: IGameHandlerAuthInfo) => void;
  clear: () => void;
} => {
  const [gameHandler, setGameHandler] = useState<GameHandler | null>(null);

  // Used to trigger updates from the GameHandler
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  // Create / destroy the game handler when new new auth is provided
  const initialize = ({ gameId, userToken, playerId }: IGameHandlerAuthInfo) => {
    // If auth has been provided, setup the game handler
    const onGameStateChange = (gameEnded: boolean) => {
      if (gameEnded) {
        setGameHandler(null);
      } else {
        forceUpdate();
      }
    };
    setGameHandler(
      new GameHandler(gameId, userToken, playerId, onGameStateChange, onDisplayMessage)
    );
  };

  // Clear the current game
  const clear = () => {
    if (gameHandler !== null) {
      gameHandler.gameEnd(null);
    }
    setGameHandler(null);
  };

  return {
    initialize,
    clear,
    authInfo:
      gameHandler === null
        ? null
        : {
            gameId: gameHandler.gameId,
            userToken: gameHandler.userToken,
            playerId: gameHandler.playerId
          },
    game:
      gameHandler === null
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
          }
  };
};

export default useGameHandler;

import { IGameState } from "@monopoly-money/game-state";
import useLocalStorage from "@rehooks/local-storage";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { getGameStatus } from "../api";

const storedGamesLocalStorageKey = "storedGames";

interface IStoredGameInLocalStorage {
  gameId: string;
  userToken: string;
  playerId: string;
  time: string;
}

interface IStoredGameInLocalStorageWithStatus extends IStoredGameInLocalStorage {
  status: IGameState | null;
}

export interface IStoredGame extends IStoredGameInLocalStorage {
  status: IGameState | null;
}

const useStoredGamesStatusCache: Record<string, IGameState> = {};

const putGameStatusInCache = (gameId: string, state: IGameState) => {
  useStoredGamesStatusCache[gameId] = state;
};

const getGameStatusFromCache = (gameId: string) => {
  return gameId in useStoredGamesStatusCache ? useStoredGamesStatusCache[gameId] : null;
};

const useStoredGames = (getStatuses: boolean = true) => {
  const [storedGames, setStoredGames] = useLocalStorage<IStoredGameInLocalStorage[]>(
    storedGamesLocalStorageKey,
    []
  );
  const [gameStatuses, setGameStatuses] = useState<IStoredGameInLocalStorageWithStatus[]>([]);

  // Sync storedGames and gameStatuses and fire off requests
  useEffect(() => {
    // If we don't want to fetch the statuses, exit early
    if (!getStatuses) {
      setGameStatuses((storedGames ?? []).map((g) => ({ ...g, status: null })));
      return;
    }

    // Identify games we need to fetch statuses for
    const gamesWithStatusesOrRequesting = gameStatuses.map((g) => g.gameId);
    const gamesToGetStatusesFor = (storedGames ?? []).filter(
      (g) => gamesWithStatusesOrRequesting.indexOf(g.gameId) === -1
    );

    // Remove games from gameStatuses that are not in storedGames
    const storedGameIds = (storedGames ?? []).map((g) => g.gameId);
    setGameStatuses((current) => current.filter((g) => storedGameIds.indexOf(g.gameId) !== -1));

    // Pre-populate statuses with null
    setGameStatuses((current) => {
      const gameIdsToAdd = gamesToGetStatusesFor.map((g) => g.gameId);
      return [
        ...current.filter((g) => !gameIdsToAdd.includes(g.gameId)),
        ...gamesToGetStatusesFor.map((g) => ({
          ...g,
          status: getGameStatusFromCache(g.gameId)
        }))
      ];
    });

    // Fire off requests for statuses
    // TODO This is firing off twice for each game. setGameStatuses is not adding the games with `null` statuses before this useEffect is called for a second time, leading to the below forEach execute a second time with the same array.
    gamesToGetStatusesFor.forEach((game) => {
      getGameStatus(game.gameId, game.userToken, undefined)
        .then((status) => {
          if (status === "DoesNotExist" || status === "Unauthorized") {
            // Remove the game if it no longer exists or you are not allowed to join
            setStoredGames((storedGames ?? []).filter((g) => g.gameId !== game.gameId));
          } else {
            // Add the status
            putGameStatusInCache(game.gameId, status);
            setGameStatuses((current) =>
              current.map((g) => (g.gameId !== game.gameId ? g : { ...game, status }))
            );
          }
        })
        .catch((error) => error?.name === "DOMException" && console.error(error)); // Ignore `DOMException: The user aborted a request.`
    });
  }, [storedGames]);

  const storeGame = (gameId: string, userToken: string, playerId: string) => {
    setStoredGames([
      ...(storedGames ?? []).filter((game) => game.gameId !== gameId), // Remove current instance
      {
        gameId,
        userToken,
        playerId,
        time: DateTime.local().toISO()
      }
    ]);
  };

  return { storedGames: gameStatuses, storeGame };
};

export default useStoredGames;

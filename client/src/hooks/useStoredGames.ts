import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import useLocalStorage from "@rehooks/local-storage";
import { IGameStatus } from "../../../src/api/dto";
import { getGameStatus } from "../api";

const storedGamesLocalStorageKey = "storedGames";

interface IStoredGameInLocalStorage {
  gameId: string;
  userId: string;
  time: DateTime;
}

export interface IStoredGame extends IStoredGameInLocalStorage {
  status: IGameStatus | null;
}

const useStoredGames = () => {
  const [storedGames, setStoredGames] = useLocalStorage<IStoredGameInLocalStorage[]>(
    storedGamesLocalStorageKey,
    []
  );
  const [gameStatuses, setGameStatuses] = useState<Record<string, IGameStatus | null>>({});

  const storeGame = (gameId: string, userId: string) => {
    setStoredGames([
      ...(storedGames ?? []).filter((game) => game.gameId !== gameId), // Remove current instance
      {
        gameId,
        userId,
        time: DateTime.local()
      }
    ]);
  };

  // Identify if we need to fetch some new game data
  useEffect(() => {
    const gamesWithoutStatuses = (storedGames ?? []).filter(
      (game) => Object.keys(gameStatuses).indexOf(game.gameId) === -1
    );

    gamesWithoutStatuses.forEach(({ gameId, userId }) => {
      // Initially insert a null (to stop multiple requests)
      setGameStatuses((current) => ({
        ...current,
        [gameId]: null
      }));

      // Make the request
      getGameStatus(gameId, userId).then((status) => {
        if (status === "DoesNotExist") {
          // Remove the game if it no longer exists
          setStoredGames((storedGames ?? []).filter((g) => g.gameId !== gameId));
          setGameStatuses((current) =>
            Object.keys(current).reduce((acc: Record<string, IGameStatus | null>, curr: string) => {
              if (curr !== gameId) {
                return { ...acc, [gameId]: current[gameId] };
              } else {
                return acc;
              }
            }, {} as Record<string, IGameStatus | null>)
          );
        } else {
          // Add the status
          setGameStatuses((current) => ({
            ...current,
            [gameId]: status
          }));
        }
      });
    });
  }, [storedGames, gameStatuses]);

  // Merge the games and statuses together
  const storedGamesWithDetail: IStoredGame[] = (storedGames ?? []).map((game) => ({
    ...game,
    status: gameStatuses[game.gameId] ?? null
  }));

  return { storedGames: storedGamesWithDetail, storeGame }; // TODO Provide a flush to get the statuses again?
};

export default useStoredGames;

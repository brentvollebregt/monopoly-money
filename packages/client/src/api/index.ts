import config from "../config";
import {
  ICreateGameRequest,
  IJoinGameRequest,
  IJoinGameResponse,
  IGameStatusSummary
} from "../../../src/api/dto";

export const createGame = (name: string): Promise<IJoinGameResponse> => {
  return fetch(`${config.api.root}/api/game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name } as ICreateGameRequest)
  }).then((r) => {
    if (r.status === 200) {
      return r.json() as Promise<IJoinGameResponse>;
    } else {
      throw new Error(`Server Error (HTTP${r.status})`);
    }
  });
};

export const joinGame = async (
  gameId: string,
  name: string
): Promise<IJoinGameResponse | "DoesNotExist" | "NotOpen"> => {
  const response = await fetch(`${config.api.root}/api/game/${gameId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name } as IJoinGameRequest)
  });

  if (response.status === 200) {
    return response.json() as Promise<IJoinGameResponse>;
  } else if (response.status === 404) {
    return Promise.resolve("DoesNotExist");
  } else if (response.status === 403) {
    return Promise.resolve("NotOpen");
  } else {
    throw new Error(`Server Error (HTTP${response.status})`);
  }
};

export const getGameStatus = async (
  gameId: string,
  userToken: string
): Promise<IGameStatusSummary | "DoesNotExist"> => {
  const response = await fetch(`${config.api.root}/api/game/${gameId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: userToken
    }
  });
  if (response.status === 200) {
    return response.json() as Promise<IGameStatusSummary>;
  } else if (response.status === 404) {
    return Promise.resolve("DoesNotExist") as Promise<"DoesNotExist">;
  } else {
    throw new Error(`Server Error (HTTP${response.status})`);
  }
};

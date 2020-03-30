import * as websocket from "ws";
import { createUniqueGameId, generateTimeBasedId } from "./utils";
import { IGame, IPlayerJoinEvent, Event } from "./types";

class GameStore {
  private games: Record<string, IGame> = {};

  public createGame = (bankerName: string) => {
    // Generate a game id
    const gameId = createUniqueGameId(Object.keys(this.games));

    // Create the game
    this.games[gameId] = {
      code: gameId,
      open: true,
      events: [],
      subscribedWebsockets: [],
      bankers: [],
      userTokenToPlayers: {}
    };

    // Add the banker as a player and make them a banker
    const userToken = this.addPlayer(gameId, bankerName);
    const playerId = this.games[gameId].userTokenToPlayers[userToken];
    this.games[gameId].bankers.push(playerId);

    return { gameId, userToken };
  };

  public isUserInGame = (gameId: string, userToken: string) =>
    this.games[gameId].userTokenToPlayers.hasOwnProperty(userToken);

  public doesGameExist = (gameId: string) => this.games.hasOwnProperty(gameId);

  public isGameOpen = (gameId: string) => this.games[gameId].open;

  public getGameEvents = (gameId: string) => this.games[gameId].events;

  public addPlayer = (gameId: string, name: string): string => {
    // Identify id
    const playerId = generateTimeBasedId();
    const userToken = generateTimeBasedId();

    // Add the player
    const event: IPlayerJoinEvent = {
      type: "playerJoin",
      time: new Date(),
      actionedBy: playerId,
      id: playerId,
      name
    };
    this.pushEvent(gameId, event);

    // Map the user token to the player id
    this.games[gameId].userTokenToPlayers[userToken] = playerId;

    return userToken;
  };

  public gameStatus = (gameId: string) => {
    // TODO
  };

  private pushEvent = (gameId: string, event: Event) => {
    this.games[gameId].events.push(event);

    Object.values(this.games[gameId].subscribedWebsockets).forEach(ws => {
      ws.send(JSON.stringify(event));
    });
  };
}

export default new GameStore();

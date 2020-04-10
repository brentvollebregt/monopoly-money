import * as websocket from "ws";
import { createUniqueGameId, generateTimeBasedId } from "./utils";
import { IGame, IPlayerJoinEvent, Event } from "./types";
import { DateTime } from "luxon";

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

  // Check if a game exists
  public doesGameExist = (gameId: string) => this.games.hasOwnProperty(gameId);

  // Check if a game is open
  public isGameOpen = (gameId: string) => this.games[gameId].open;

  // Check if a userToken is in a game
  public isUserInGame = (gameId: string, userToken: string) =>
    this.games[gameId].userTokenToPlayers.hasOwnProperty(userToken);

  // Get all the events from a game
  public getGameEvents = (gameId: string) => this.games[gameId].events;

  // Add a player to a game and get the new userToken
  public addPlayer = (gameId: string, name: string): string => {
    // Identify id
    const playerId = generateTimeBasedId();
    const userToken = generateTimeBasedId();

    // Add the player
    const event: IPlayerJoinEvent = {
      type: "playerJoin",
      time: DateTime.local(),
      actionedBy: playerId,
      id: playerId,
      name
    };
    this.pushEvent(gameId, event);

    // Map the user token to the player id
    this.games[gameId].userTokenToPlayers[userToken] = playerId;

    return userToken;
  };

  // Set a player as a banker
  public setPlayerAsBanker = (gameId: string, userId: string) => {

  }

  public gameStatusSummary = (gameId: string) => {
    // TODO
  };

  private pushEvent = (gameId: string, event: Event) => {
    this.games[gameId].events.push(event);

    Object.values(this.games[gameId].subscribedWebsockets).forEach((ws) => {
      ws.send(JSON.stringify(event));
    });
  };
}

export default new GameStore();

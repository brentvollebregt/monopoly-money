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
      events: [], // All events
      subscribedWebSockets: [], // Anyone part of the game
      bankers: [], // playerId[]
      userTokenToPlayers: {} // userToken => playerId
    };

    // Add the banker as a player and make them a banker
    const userToken = this.addPlayer(gameId, bankerName);
    const playerId = this.games[gameId].userTokenToPlayers[userToken];
    this.setPlayerBankerStatus(gameId, playerId, true);

    // Return the new game id and the users userToken
    return { gameId, userToken };
  };

  // Check if a game exists
  public doesGameExist = (gameId: string) => this.games.hasOwnProperty(gameId);

  // Check if a game is open
  public isGameOpen = (gameId: string) => this.games[gameId].open;

  // Check if a userToken is in a game
  public isUserInGame = (gameId: string, userToken: string) =>
    this.games[gameId].userTokenToPlayers.hasOwnProperty(userToken);

  // Check if a userToken is allowed to make banker actions in a game
  public isUserABanker = (gameId: string, userToken: string) => {
    const playerId = this.games[gameId].userTokenToPlayers[userToken];
    return this.games[gameId].bankers.indexOf(playerId) !== -1;
  };

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
      time: DateTime.local().toISO(),
      actionedBy: playerId,
      playerId,
      name
    };
    this.pushEvent(gameId, event);

    // Map the user token to the player id
    this.games[gameId].userTokenToPlayers[userToken] = playerId;

    return userToken;
  };

  // Set a player as a banker
  public setPlayerBankerStatus = (gameId: string, playerId: string, isBanker: boolean) => {
    if (isBanker && this.games[gameId].bankers.indexOf(playerId) === -1) {
      // If we are setting the player as banker and they are not already in the list, add them
      this.games[gameId].bankers.push(playerId);
    } else if (!isBanker && this.games[gameId].bankers.indexOf(playerId) !== -1) {
      // If we are setting the player as not a banker and they are in the list, remove them
      const currentIndex = this.games[gameId].bankers.indexOf(playerId);
      this.games[gameId].bankers.splice(currentIndex, 1);
    }
  };

  // Subscribe a websocket to get any event updates
  public subscribeWebSocketToEvents = (gameId: string, ws: websocket) => {
    this.games[gameId].subscribedWebSockets.push(ws);
  };

  // Get a brief summary of a running game
  public gameStatusSummary = (gameId: string) => {
    // TODO
  };

  private addEvent = (gameId: string, event: Event) => {
    // TODO All events must be added through here
    // TODO Calculate next state and store in game for easy access
    // TODO Afterwards, this is the only function to call this.pushEvent
  };

  private pushEvent = (gameId: string, event: Event) => {
    this.games[gameId].events.push(event);

    Object.values(this.games[gameId].subscribedWebSockets).forEach((ws) => {
      ws.send(JSON.stringify(event));
    });
  };
}

export default new GameStore();

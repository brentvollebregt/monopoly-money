import * as websocket from "ws";
import {
  GameEvent,
  PlayerId,
  IPlayerJoinEvent,
  IPlayerBankerStatusChangeEvent,
  defaultGameState,
  IGameState,
  calculateGameState
} from "@monopoly-money/game-state";
import { generateTimeBasedId, generateRandomId, getCurrentTime } from "./utils";
import {
  INewEventMessage,
  IInitialEventArrayMessage,
  IGameEndMessage,
  OutgoingMessage
} from "../api/dto";

export default class Game {
  private events: GameEvent[] = []; // Events in this game
  private subscribedWebSockets: Record<string, websocket> = {}; // playerId: event websocket
  private userTokenToPlayers: Record<string, PlayerId> = {}; // A mapping of ids only known by a user to match to a player
  private gameState: IGameState = defaultGameState;

  private deleteInstance: () => void;

  constructor(deleteInstance: () => void) {
    this.deleteInstance = deleteInstance;
  }

  // Check if a game is open
  public isGameOpen = () => this.gameState.open;

  // Check if a userToken is in a game
  public isUserInGame = (userToken: string) => this.userTokenToPlayers.hasOwnProperty(userToken);

  // Check if a userToken is allowed to make banker actions in a game
  public isUserABanker = (userToken: string) => {
    const playerId = this.userTokenToPlayers[userToken];
    const player = this.gameState.players.find((p) => p.playerId === playerId);
    return player !== undefined && player.banker;
  };

  public getPlayerId = (userToken: string) => this.userTokenToPlayers[userToken];

  // Add a player to a game and get the new userToken
  public addPlayer = (name: string) => {
    // Identify id
    const playerId = generateTimeBasedId();
    const userToken = generateRandomId();

    // Add the player
    const event: IPlayerJoinEvent = {
      type: "playerJoin",
      time: getCurrentTime(),
      actionedBy: playerId,
      playerId,
      name
    };
    this.pushEvent(event);

    // Map the user token to the player id
    this.userTokenToPlayers[userToken] = playerId;

    return { userToken, playerId };
  };

  // Set a player as a banker
  public setPlayerBankerStatus = (
    playerId: string,
    isBanker: boolean,
    actionedByPlayerId: string
  ) => {
    const event: IPlayerBankerStatusChangeEvent = {
      type: "playerBankerStatusChange",
      time: getCurrentTime(),
      actionedBy: actionedByPlayerId,
      playerId,
      isBanker
    };
    this.pushEvent(event);
  };

  // Subscribe a websocket to get any event updates
  public subscribeWebSocketToEvents = (ws: websocket, playerId: string) => {
    // Add to subscription list
    this.subscribedWebSockets[playerId] = ws;

    // Send out events that have ocurred
    const outgoingMessage: IInitialEventArrayMessage = {
      type: "initialEventArray",
      events: this.events
    };
    ws.send(JSON.stringify(outgoingMessage));
  };

  // Get the game state
  public getGameState = (): IGameState => {
    return this.gameState;
  };

  // Add an event
  public addEvent = (event: GameEvent, actionedBy: PlayerId) => {
    this.pushEvent({
      ...event,
      actionedBy,
      time: getCurrentTime()
    });

    // If a player has been deleted, remove close and remove their websocket
    if (event.type === "playerDelete" && event.playerId in this.subscribedWebSockets) {
      this.subscribedWebSockets[event.playerId].close();
      delete this.subscribedWebSockets[event.playerId];
    }
  };

  // End a game
  public endGame = () => {
    // Send end game notification to all player
    const outgoingMessage: IGameEndMessage = { type: "gameEnd" };
    this.sendMessageToAllInGame(outgoingMessage);

    // Close all sockets and delete them
    Object.values(this.subscribedWebSockets).forEach((ws) => {
      ws.close();
    });

    // Delete the game
    this.deleteInstance();
  };

  private pushEvent = (event: GameEvent) => {
    // Add event
    this.events.push(event);

    // Calculate next state
    this.gameState = calculateGameState([event], this.gameState);

    // Construct message and sent to all players
    const outgoingMessage: INewEventMessage = { type: "newEvent", event };
    this.sendMessageToAllInGame(outgoingMessage);
  };

  // Send a message to all listening websockets
  private sendMessageToAllInGame = (outgoingMessage: OutgoingMessage) => {
    Object.values(this.subscribedWebSockets).forEach((ws) => {
      ws.send(JSON.stringify(outgoingMessage));
    });
  };
}

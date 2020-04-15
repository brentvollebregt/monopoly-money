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
import { generateTimeBasedId, generateRandomId } from "./utils";
import { DateTime } from "luxon";
import { INewEventMessage, IInitialEventArrayMessage } from "../api/dto";

export default class Game {
  private events: GameEvent[] = []; // Events in this game
  private subscribedWebSockets: websocket[] = []; // Players listening to events
  private userTokenToPlayers: Record<string, PlayerId> = {}; // A mapping of ids only known by a user to match to a player
  private gameState: IGameState = defaultGameState;

  private deleteInstance: () => void; // TODO On game delete (fire out events saying game has ended)

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
      time: DateTime.local().toISO(),
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
      time: DateTime.local().toISO(),
      actionedBy: actionedByPlayerId,
      playerId,
      isBanker
    };
    this.pushEvent(event);
  };

  // Subscribe a websocket to get any event updates
  public subscribeWebSocketToEvents = (ws: websocket) => {
    // Add to subscription list
    this.subscribedWebSockets.push(ws);

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
      time: DateTime.local().toISO()
    });
  };

  private pushEvent = (event: GameEvent) => {
    // Add event
    this.events.push(event);

    // Calculate next state
    this.gameState = calculateGameState([event], this.gameState);

    // Construct message
    const outgoingMessage: INewEventMessage = { type: "newEvent", event };

    // Send the event to all listening websockets
    Object.values(this.subscribedWebSockets).forEach((ws) => {
      ws.send(JSON.stringify(outgoingMessage));
    });
  };
}

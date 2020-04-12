import * as websocket from "ws";
import { Event, PlayerId, IPlayerJoinEvent } from "./types";
import { generateTimeBasedId } from "./utils";
import { DateTime } from "luxon";
import { INewEventMessage, IInitialEventArrayMessage } from "../api/dto";

export default class Game {
  private open: boolean = true; // Whether the game is open to people joining
  private events: Event[] = []; // Events in this game
  private subscribedWebSockets: websocket[] = []; // Players listening to events
  private bankers: PlayerId[] = []; // Ids of those players who have banker privileges
  private userTokenToPlayers: Record<string, PlayerId> = {}; // A mapping of ids only known by a user to match to a player

  private deleteInstance: () => void; // TODO On game delete (fire out events saying game has ended)

  constructor(deleteInstance: () => void) {
    this.deleteInstance = deleteInstance;
  }

  // Check if a game is open
  public isGameOpen = () => this.open;

  // Check if a userToken is in a game
  public isUserInGame = (userToken: string) => this.userTokenToPlayers.hasOwnProperty(userToken);

  // Check if a userToken is allowed to make banker actions in a game
  public isUserABanker = (userToken: string) => {
    const playerId = this.userTokenToPlayers[userToken];
    return this.bankers.indexOf(playerId) !== -1;
  };

  public getPlayerId = (userToken: string) => this.userTokenToPlayers[userToken];

  // Add a player to a game and get the new userToken
  public addPlayer = (name: string) => {
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
    this.pushEvent(event);

    // Map the user token to the player id
    this.userTokenToPlayers[userToken] = playerId;

    return { userToken, playerId };
  };

  // Set a player as a banker
  public setPlayerBankerStatus = (playerId: string, isBanker: boolean) => {
    if (isBanker && this.bankers.indexOf(playerId) === -1) {
      // If we are setting the player as banker and they are not already in the list, add them
      this.bankers.push(playerId);
    } else if (!isBanker && this.bankers.indexOf(playerId) !== -1) {
      // If we are setting the player as not a banker and they are in the list, remove them
      const currentIndex = this.bankers.indexOf(playerId);
      this.bankers.splice(currentIndex, 1);
    }
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

  // Get a brief summary of a running game
  public gameStatusSummary = () => {
    // TODO
  };

  private pushEvent = (event: Event) => {
    // Add event
    this.events.push(event);

    // TODO Calculate new state and store in game for easy access

    // Construct message
    const outgoingMessage: INewEventMessage = { type: "newEvent", event };

    Object.values(this.subscribedWebSockets).forEach((ws) => {
      ws.send(JSON.stringify(outgoingMessage));
    });
  };
}

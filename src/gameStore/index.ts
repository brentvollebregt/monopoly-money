import * as websocket from "ws";
import { createUniqueGameId, generatePlayerId } from "./utils";

type Event = IPlayerJoinEvent | IPlayerDeleteEvent | IPlayerNameChangeEvent | ITransactionEvent;

interface IGame {
  code: string; // The code associated with the game instance
  events: Event[];
  playerWebsockets: Record<string, websocket | null>; // Players in this game
  queuedPlayers: IQueuedPlayer[]; // Players waiting to join
  bankers: string[]; // Ids of those who have banker privileges
}

interface IEvent {
  time: Date;
  actionedBy: "system" | "banker" | string;
}

interface IPlayerJoinEvent extends IEvent {
  type: "playerJoin";
  id: string;
  name: string;
}

interface IPlayerDeleteEvent extends IEvent {
  type: "playerDelete";
  id: string;
}

interface IPlayerNameChangeEvent extends IEvent {
  type: "playerNameChange";
  id: string;
  name: string;
}

interface ITransactionEvent extends IEvent {
  type: "transaction";
  from: "banker" | "freeParking" | string;
  to: "banker" | "freeParking" | string;
  amount: number;
}

interface IQueuedPlayer {
  name: string; // The name of this player
  websocket: websocket | null; // Message handling for this player
}

export default class GameStore {
  private games: Record<string, IGame> = {};

  public createGame = (ws: websocket, bankerName: string) => {
    // Generate a game id
    const gameId = createUniqueGameId(Object.keys(this.games));
    // Create the game
    this.games[gameId] = {
      code: gameId,
      events: [],
      playerWebsockets: {},
      queuedPlayers: [],
      bankers: []
    };
    // Add the banker
    const bankerId = this.addPlayer(ws, gameId, bankerName);
    this.games[gameId].bankers.push(bankerId);
  };

  public doesGameExist = (gameId: string) => this.games.hasOwnProperty(gameId);

  public getGameEvents = (gameId: string) => this.games[gameId].events;

  public addPlayer = (ws: websocket, gameId: string, name: string): string => {
    // Identify id
    const playerId = generatePlayerId();

    // Add the player
    const event: IPlayerJoinEvent = {
      type: "playerJoin",
      time: new Date(),
      actionedBy: playerId,
      id: playerId,
      name
    };
    this.games[gameId].events.push(event);

    // Add the players websocket
    this.games[gameId].playerWebsockets[playerId] = ws;

    this.pushEvent(gameId, event);

    console.log(this.games);
    return playerId;
  };

  private pushEvent = (gameId: string, event: IEvent) => {
    Object.values(this.games[gameId].playerWebsockets).forEach(ws => {
      ws.send(JSON.stringify(event));
    });
  };
}

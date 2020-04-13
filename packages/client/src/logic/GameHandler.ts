import { Event } from "../../../src/gameStore/types";
import { IGameState } from "../../../src/gameStore/calculateState";
import config from "../config";
import { IAuthMessage, OutgoingMessage, IProposeEventMessage } from "../../../src/api/dto";

export interface IGameHandlerState {
  events: Event[];
  isBanker: boolean;
}

const defaultGameState: IGameState = {
  players: [],
  freeParkingBalance: 0,
  open: true
};

const calculateState = (events: Event[], currentState: IGameState): IGameState => {
  return currentState;
};

class GameHandler {
  public gameId: string;
  public userToken: string;
  public playerId: string;
  private events: Event[] = [];
  private webSocket: WebSocket;
  private gameState: IGameState = defaultGameState;

  constructor(gameId: string, userToken: string, playerId: string) {
    this.gameId = gameId;
    this.userToken = userToken;
    this.playerId = playerId;

    // Create websocket and assign onmessage
    const webSocketAPIRoot = config.api.root.replace(/http?/g, "ws"); // I couldn't be bothered just making another config value
    this.webSocket = new WebSocket(`${webSocketAPIRoot}/api/events`);

    // Setup on message
    this.webSocket.onmessage = this.onWebSocketMessage.bind(this);

    // Send auth message on websocket open
    this.webSocket.onopen = (event) => {
      const message: IAuthMessage = {
        type: "auth",
        gameId: this.gameId,
        userToken: this.userToken
      };
      this.webSocket.send(JSON.stringify(message));
    };
  }

  // Get data to be used to display the UI
  public getState(): IGameState {
    return this.gameState;
  }

  // Get all events
  public getEvents(): Event[] {
    return this.events;
  }

  // Identify whether this user is a banker
  public amIABanker() {
    return this.gameState.players.find((p) => p.playerId === this.playerId)?.banker ?? false;
  }

  // TODO Actions to call submitEvent

  // On messages from the server
  private onWebSocketMessage(event: MessageEvent) {
    const incomingMessage = JSON.parse(event.data) as OutgoingMessage;

    if (incomingMessage.type === "initialEventArray") {
      this.events = incomingMessage.events;
      this.gameState = calculateState(this.events, this.gameState);
    } else if (incomingMessage.type === "newEvent") {
      this.events.push(incomingMessage.event);
      this.gameState = calculateState([incomingMessage.event], this.gameState);
    }
  }

  // Messages to the server
  private submitEvent(event: Event) {
    const message: IProposeEventMessage = {
      type: "proposeEvent",
      event
    };
    this.webSocket.send(JSON.stringify(message));
  }
}

export default GameHandler;

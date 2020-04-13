import {
  GameEvent,
  IGameState,
  defaultGameState,
  calculateGameState,
  GameEntity,
  ITransactionEvent
} from "@monopoly-money/game-state";
import config from "../config";
import {
  IAuthMessage,
  OutgoingMessage,
  IProposeEventMessage
} from "@monopoly-money/server/build/api/dto";

export interface IGameHandlerState {
  events: GameEvent[];
  isBanker: boolean;
}

class GameHandler {
  public gameId: string;
  public userToken: string;
  public playerId: string;
  private onGameStateChange: () => void;
  private events: GameEvent[] = [];
  private webSocket: WebSocket;
  private gameState: IGameState = defaultGameState;

  constructor(gameId: string, userToken: string, playerId: string, onGameStateChange: () => void) {
    this.gameId = gameId;
    this.userToken = userToken;
    this.playerId = playerId;
    this.onGameStateChange = onGameStateChange;

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
  public getEvents(): GameEvent[] {
    return this.events;
  }

  // Identify whether this user is a banker
  public amIABanker(): boolean {
    const me = this.gameState.players.find((p) => p.playerId === this.playerId);
    return me?.banker ?? false;
  }

  // Propose a transaction
  public proposeTransaction(from: GameEntity, to: GameEntity, amount: number) {
    const event: ITransactionEvent = {
      time: "", // Will be filled in by the server
      actionedBy: "", // Will be filled in by the server
      type: "transaction",
      from,
      to,
      amount
    };
    this.submitEvent(event);
  }

  // TODO Actions to call submitEvent

  // On messages from the server
  private onWebSocketMessage(event: MessageEvent) {
    const incomingMessage = JSON.parse(event.data) as OutgoingMessage;

    if (incomingMessage.type === "initialEventArray") {
      this.events = incomingMessage.events;
      this.gameState = calculateGameState(this.events, this.gameState);
    } else if (incomingMessage.type === "newEvent") {
      this.events.push(incomingMessage.event);
      this.gameState = calculateGameState([incomingMessage.event], this.gameState);
    }

    // Notify the user of this class that a change has been made internally
    this.onGameStateChange();
  }

  // Messages to the server
  private submitEvent(event: GameEvent) {
    const message: IProposeEventMessage = {
      type: "proposeEvent",
      event
    };
    this.webSocket.send(JSON.stringify(message));
  }
}

export default GameHandler;

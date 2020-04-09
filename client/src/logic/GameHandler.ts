import { Event } from "../../../src/gameStore/types";
import config from "../config";
import { IAuthMessage, OutgoingMessage } from "../../../src/api/dto";

class GameHandler {
  public gameId: string;
  public userToken: string;
  public isBanker: boolean = false;
  private events: Event[] = [];
  private webSocket: WebSocket;

  constructor(gameId: string, userToken: string) {
    this.gameId = gameId;
    this.userToken = userToken;

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
  public getCurrentState() {}

  private onWebSocketMessage(event: MessageEvent) {
    const incomingMessage = JSON.parse(event.data) as OutgoingMessage;

    if (incomingMessage.type === "initialEventArray") {
      this.events = incomingMessage.events;
      console.log("initialEventArray", this);
    }
  }
}

export default GameHandler;

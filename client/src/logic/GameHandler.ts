import { Event } from "../../../src/gameStore/types";
import config from "../config";

class GameHandler {
  public gameId: string;
  public userId: string;
  public isBanker: boolean = false;
  private events: Event[] = [];

  constructor(gameId: string, userId: string) {
    this.gameId = gameId;
    this.userId = userId;

    // TODO Create websocket and assign onmessage
    const webSocketAPIRoot = config.api.root.replace(/http?/g, "ws"); // I couldn't be bothered just making another config value
    const webSocket = new WebSocket(`${webSocketAPIRoot}/api/events`);
  }

  public getCurrentState() {}
}

export default GameHandler;

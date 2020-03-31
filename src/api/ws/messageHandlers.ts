import * as websocket from "ws";
import gameStore from "../../gameStore";
import { IncomingMessage } from "../dto";
import { IUserData } from "../types";

export type MessageHandler = (ws: websocket, userData: IUserData, message: IncomingMessage) => void;

export const bankerGiveToPlayer: MessageHandler = (ws, userData, message) => {
  if (message.type === "bankerGiveToPlayer") {
  }
};

export const bankerTakeFromPlayer: MessageHandler = (ws, userData, message) => {
  if (message.type === "bankerTakeFromPlayer") {
  }
};

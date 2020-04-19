import React from "react";
import {
  GameEvent,
  calculateGameState,
  defaultGameState,
  IGameState
} from "@monopoly-money/game-state";
import "./History.scss";
import { formatCurrency } from "../../utils";

interface IHistoryProps {
  events: GameEvent[];
}

const History: React.FC<IHistoryProps> = ({ events }) => {
  let currentGameState = defaultGameState;
  const details = events.map((event) => {
    const nextState = calculateGameState([event], currentGameState);
    const currentEventDetails = getEventDetails(event, currentGameState, nextState);
    currentGameState = nextState;
    return currentEventDetails;
  });

  return (
    <div className="history">
      {details.reverse().map((eventDetail) => (
        <div key={eventDetail.id} className="event mb-2">
          <div className="bar" style={{ background: `var(--${eventDetail.colour})` }} />
          <div className="event-details">
            <div className="title">
              <small>{eventDetail.title}</small>
            </div>
            <div className="detail">{eventDetail.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getEventDetails = (
  event: GameEvent,
  previousState: IGameState,
  nextState: IGameState
): {
  id: string;
  title: string;
  detail: string;
  colour: "blue" | "red" | "orange" | "yellow" | "green" | "cyan"; // https://getbootstrap.com/docs/4.0/getting-started/theming/#all-colors
} => {
  const actioningPlayer =
    event.type !== "playerJoin"
      ? previousState.players.find((p) => p.playerId === event.actionedBy)
      : previousState.players.find((p) => p.playerId === event.actionedBy);

  switch (event.type) {
    case "playerJoin": {
      const player = nextState.players.find((p) => p.playerId === event.playerId)!;
      return {
        id: `${event.type + event.time}`,
        title: "Player Join",
        detail: `${player.name} joined`,
        colour: "cyan"
      };
    }

    case "playerBankerStatusChange": {
      const player = nextState.players.find((p) => p.playerId === event.playerId)!;
      return {
        id: `${event.type + event.time}`,
        title: "Player Banker Status Change",
        detail: `${player.name} was made a banker`,
        colour: "yellow"
      };
    }

    case "transaction": {
      const playerReceiving =
        event.to === "bank"
          ? "Bank"
          : event.to === "freeParking"
          ? "Free Parking"
          : nextState.players.find((p) => p.playerId === event.to)!.name;
      const playerGiving =
        event.from === "bank"
          ? "Bank"
          : event.from === "freeParking"
          ? "Free Parking"
          : nextState.players.find((p) => p.playerId === event.from)!.name;
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      const actionedByNote =
        actionedBy.playerId === event.from ? "" : `(actioned by ${actionedBy.name})`;
      return {
        id: `${event.type + event.time}`,
        title: `Transaction`,
        detail: `${playerGiving} → ${playerReceiving} (${formatCurrency(
          event.amount
        )}) ${actionedByNote}`,
        colour: "green"
      };
    }

    case "playerNameChange": {
      const playerNameBeforeRename = previousState.players.find(
        (p) => p.playerId === event.playerId
      )!.name;
      const playerNameAfterRename = nextState.players.find((p) => p.playerId === event.playerId)!
        .name;
      return {
        id: `${event.type + event.time}`,
        title: "Player Name Change",
        detail: `${playerNameBeforeRename} was renamed to ${playerNameAfterRename}`,
        colour: "orange"
      };
    }

    case "playerDelete": {
      const playerName = previousState.players.find((p) => p.playerId === event.playerId)!.name;
      return {
        id: `${event.type + event.time}`,
        title: "Player Removal",
        detail: `${playerName} was removed from the game`,
        colour: "red"
      };
    }

    case "gameOpenStateChange": {
      return {
        id: `${event.type + event.time}`,
        title: "Game Open State Change",
        detail: `The game is now ${event.open ? "open" : "closed"} to new players`,
        colour: "blue"
      };
    }
  }
};

export default History;

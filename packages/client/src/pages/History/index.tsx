import React from "react";
import {
  GameEvent,
  calculateGameState,
  defaultGameState,
  IGameState
} from "@monopoly-money/game-state";
import "./History.scss";
import { formatCurrency } from "../../utils";
import { bankName, freeParkingName } from "../../constants";
import { DateTime } from "luxon";

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
      {details.reverse().map((eventDetail) =>
        eventDetail === null ? null : (
          <div key={eventDetail.id} className="event mb-2">
            <div className="bar" style={{ background: `var(--${eventDetail.colour})` }} />
            <div className="event-details">
              <div className="top">
                <small>{eventDetail.title}</small>
                <small>
                  {eventDetail.actionedBy !== null && (
                    <span className="mr-2">(✍️ {eventDetail.actionedBy})</span>
                  )}
                  {eventDetail.time}
                </small>
              </div>
              <div className="detail">{eventDetail.detail}</div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

interface IEventDetail {
  id: string;
  title: string;
  actionedBy: string | null;
  time: string;
  detail: string;
  colour: "blue" | "red" | "orange" | "yellow" | "green" | "cyan"; // https://getbootstrap.com/docs/4.0/getting-started/theming/#all-colors
}

const getEventDetails = (
  event: GameEvent,
  previousState: IGameState,
  nextState: IGameState
): IEventDetail | null => {
  const defaults = {
    id: `${event.type + event.time}`,
    time: DateTime.fromISO(event.time).toFormat("h:mm a")
  };
  switch (event.type) {
    case "playerJoin": {
      const player = nextState.players.find((p) => p.playerId === event.playerId)!;
      return {
        ...defaults,
        title: "Player Join",
        actionedBy: null,
        detail: `${player.name} joined`,
        colour: "cyan"
      };
    }

    case "playerBankerStatusChange": {
      const player = nextState.players.find((p) => p.playerId === event.playerId)!;
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      return {
        ...defaults,
        title: "Player Banker Status Change",
        actionedBy: actionedBy.name,
        detail: `${player.name} was made a banker`,
        colour: "yellow"
      };
    }

    case "transaction": {
      const playerReceiving =
        event.to === "bank"
          ? bankName
          : event.to === "freeParking"
          ? freeParkingName
          : nextState.players.find((p) => p.playerId === event.to)!.name;
      const playerGiving =
        event.from === "bank"
          ? bankName
          : event.from === "freeParking"
          ? freeParkingName
          : nextState.players.find((p) => p.playerId === event.from)!.name;
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      return {
        ...defaults,
        title: `Transaction`,
        actionedBy: actionedBy.playerId === event.from ? null : actionedBy.name,
        detail: `${playerGiving} → ${playerReceiving} (${formatCurrency(event.amount)})`,
        colour: "green"
      };
    }

    case "playerNameChange": {
      const playerNameBeforeRename = previousState.players.find(
        (p) => p.playerId === event.playerId
      )!.name;
      const playerNameAfterRename = nextState.players.find((p) => p.playerId === event.playerId)!
        .name;
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      return {
        ...defaults,
        title: "Player Name Change",
        actionedBy: actionedBy.playerId === event.playerId ? null : actionedBy.name,
        detail: `${playerNameBeforeRename} was renamed to ${playerNameAfterRename}`,
        colour: "orange"
      };
    }

    case "playerDelete": {
      const playerName = previousState.players.find((p) => p.playerId === event.playerId)!.name;
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      return {
        ...defaults,
        title: "Player Removal",
        actionedBy: actionedBy.playerId === event.playerId ? null : actionedBy.name,
        detail: `${playerName} was removed from the game`,
        colour: "red"
      };
    }

    case "gameOpenStateChange": {
      const actionedBy = previousState.players.find((p) => p.playerId === event.actionedBy)!;
      return {
        ...defaults,
        title: "Game Open State Change",
        actionedBy: actionedBy.name,
        detail: `The game is now ${event.open ? "open" : "closed"} to new players`,
        colour: "blue"
      };
    }

    case "playerConnectionChange": {
      // Don't show these as they will pollute the history
      // const playerName = previousState.players.find((p) => p.playerId === event.playerId)!.name;
      // return {
      //   id: `${event.type + event.time}`,
      //   title: "Player's Connection",
      //   detail: `${playerName} ${event.connected ? "connected to" : "disconnected from"} the game`,
      //   colour: "teal"
      // };
      return null;
    }
  }
};

export default History;

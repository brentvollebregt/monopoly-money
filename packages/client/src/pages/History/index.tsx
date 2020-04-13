import React from "react";
import { GameEvent } from "@monopoly-money/game-state";
import "./History.scss";

interface IHistoryProps {
  events: GameEvent[];
}

const History: React.FC<IHistoryProps> = ({ events }) => {
  return (
    <div className="history">
      {events.map((event) => (
        <div key={event.type + event.time} className="event">
          <div className="bar"></div>
          <div className="event-details">Event</div>
        </div>
      ))}
    </div>
  );
};

export default History;

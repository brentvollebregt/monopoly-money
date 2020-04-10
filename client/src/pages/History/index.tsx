import React from "react";
import { Event } from "../../../../src/gameStore/types";
import "./History.scss";

interface IHistoryProps {
  events: Event[];
}

const History: React.FC<IHistoryProps> = ({ events }) => {
  return (
    <div className="history">
      {events.map((event, index) => (
        <div key={event.type + event.time} className="event">
          <div className="bar"></div>
          <div className="event-details">Event</div>
        </div>
      ))}
    </div>
  );
};

export default History;

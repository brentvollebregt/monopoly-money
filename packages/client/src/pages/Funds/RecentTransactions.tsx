import React from "react";
import {
  GameEvent,
  ITransactionEvent,
  IGameStatePlayer,
  GameEntity
} from "@monopoly-money/game-state";
import { freeParkingName, bankName } from "../../constants";
import { formatCurrency } from "../../utils";

interface IRecentTransactionsProps {
  amountToShow: number;
  events: GameEvent[];
  players: IGameStatePlayer[];
}

const RecentTransactions: React.FC<IRecentTransactionsProps> = ({
  amountToShow,
  events,
  players
}) => {
  const transactionEvents = events.filter((e): e is ITransactionEvent => e.type === "transaction");
  const lastNTransactions = transactionEvents.slice(
    Math.max(transactionEvents.length - amountToShow, 0)
  );

  const getEntityName = (entity: GameEntity) => {
    if (entity === "freeParking") {
      return freeParkingName;
    } else if (entity === "bank") {
      return bankName;
    } else {
      const player = players.find((p) => p.playerId === entity);
      return player?.name ?? "[Deleted User]";
    }
  };

  return (
    <div className="recent-transactions text-center">
      {lastNTransactions.reverse().map((t) => (
        <small key={t.time} className="d-block">
          {getEntityName(t.from)} → {getEntityName(t.to)} ({formatCurrency(t.amount)})
        </small>
      ))}
    </div>
  );
};

export default RecentTransactions;

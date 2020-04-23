import React, { useEffect, useState } from "react";
import {
  GameEvent,
  ITransactionEvent,
  IGameStatePlayer,
  GameEntity
} from "@monopoly-money/game-state";
import { freeParkingName, bankName } from "../../constants";
import { formatCurrency } from "../../utils";
import { DateTime } from "luxon";

const visibilityDurationMilliseconds = 10000;

interface IRecentTransactionsProps {
  events: GameEvent[];
  players: IGameStatePlayer[];
}

const RecentTransactions: React.FC<IRecentTransactionsProps> = ({ events, players }) => {
  const [displayedTransactions, setDisplayedTransactions] = useState<ITransactionEvent[]>([]);

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

  useEffect(() => {
    const transactions = events.filter((e): e is ITransactionEvent => e.type === "transaction");
    transactions.forEach((transaction) => {
      if (
        -DateTime.fromISO(transaction.time).diffNow().as("milliseconds") <
        visibilityDurationMilliseconds
      ) {
        setDisplayedTransactions((current) => [
          ...current.filter((t) => t.time !== transaction.time),
          transaction
        ]);
        setTimeout(() => {
          setDisplayedTransactions((current) => current.filter((t) => t.time !== transaction.time));
        }, visibilityDurationMilliseconds);
      }
    });
  }, [events.length]); // Have to use events.length as we mutate the events

  return (
    <div className="recent-transactions text-center">
      {displayedTransactions.map((t) => (
        <small key={t.time} className="d-block">
          {getEntityName(t.from)} → {getEntityName(t.to)} ({formatCurrency(t.amount)})
        </small>
      ))}
    </div>
  );
};

export default RecentTransactions;

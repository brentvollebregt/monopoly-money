import {
  GameEntity,
  GameEvent,
  IGameStatePlayer,
  ITransactionEvent
} from "@monopoly-money/game-state";
import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";
import { bankName, freeParkingName } from "../../constants";
import { formatCurrency } from "../../utils";

const visibilityDurationMilliseconds = 40_000;

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
          {getEntityName(t.from)} → {getEntityName(t.to)} ({formatCurrency(t.amount)}){" "}
          <SecondsSinceLabel transactionTime={DateTime.fromISO(t.time)} />
        </small>
      ))}
    </div>
  );
};

interface SecondsSinceLabelProps {
  transactionTime: DateTime;
}

const SecondsSinceLabel = ({ transactionTime }: SecondsSinceLabelProps) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Check duration since every 5s and round down to nearest 5s to display
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const secondsSince = -transactionTime.diffNow().as("seconds");
      setSeconds(Math.floor(secondsSince));
    }, 1_000);

    return () => {
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalRef]);

  return <span className="text-muted">({seconds}s ago)</span>;
};

export default RecentTransactions;

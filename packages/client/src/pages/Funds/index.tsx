import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useModal } from "react-modal-hook";
import { IGameStatePlayer, GameEntity, GameEvent } from "@monopoly-money/game-state";
import SendMoneyModal from "./SendMoneyModal";
import GameCode from "./GameCode";
import { formatCurrency, sortPlayersByName } from "../../utils";
import { bankName, freeParkingName } from "../../constants";
import PlayerCard from "./PlayerCard";
import "./Funds.scss";
import RecentTransactions from "./RecentTransactions";

interface IFundsProps {
  gameId: string;
  playerId: string;
  isGameOpen: boolean;
  players: IGameStatePlayer[];
  freeParkingBalance: number;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
  events: GameEvent[];
}

const Funds: React.FC<IFundsProps> = ({
  gameId,
  playerId,
  isGameOpen,
  players,
  freeParkingBalance,
  proposeTransaction,
  events
}) => {
  const [recipient, setRecipient] = useState<IGameStatePlayer | "freeParking" | "bank" | null>(
    null
  );
  const [showSendMoneyModal, hideSendMoneyModal] = useModal(
    () => (
      <>
        {recipient !== null && (
          <SendMoneyModal
            balance={me?.balance ?? 0}
            playerId={playerId}
            recipient={recipient}
            proposeTransaction={proposeTransaction}
            onClose={() => setRecipient(null)}
          />
        )}
      </>
    ),
    [recipient]
  );

  // Show/hide the send money modal automatically
  useEffect(() => {
    if (recipient !== null) {
      showSendMoneyModal();
    } else {
      hideSendMoneyModal();
    }
  }, [recipient, showSendMoneyModal, hideSendMoneyModal]);

  const me = players.find((p) => p.playerId === playerId);
  const isBanker = me?.banker ?? false;

  return (
    <div className="funds">
      {isGameOpen && <GameCode gameId={gameId} isBanker={isBanker} />}

      <Card className="mb-1 text-center">
        {me !== undefined && (
          <Card.Body className="p-3">
            {me.name}: {formatCurrency(me.balance)}
          </Card.Body>
        )}
      </Card>

      <div className="mb-1 balance-grid">
        {sortPlayersByName(players.filter((p) => p.playerId !== playerId)).map((player) => (
          <PlayerCard
            key={player.playerId}
            name={player.name}
            connected={player.connected}
            balance={player.balance}
            onClick={() => setRecipient(player)}
          />
        ))}
      </div>

      <div className="balance-grid">
        <PlayerCard
          name={freeParkingName}
          connected={null}
          balance={freeParkingBalance}
          onClick={() => setRecipient("freeParking")}
        />
        <PlayerCard
          name={bankName}
          connected={null}
          balance={Number.POSITIVE_INFINITY}
          onClick={() => setRecipient("bank")}
        />
      </div>

      <div className="mt-2">
        <RecentTransactions events={events} players={players} />
      </div>
    </div>
  );
};

export default Funds;

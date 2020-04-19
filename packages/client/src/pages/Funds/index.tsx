import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import "./Funds.scss";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import SendMoneyModal from "./SendMoneyModal";
import { useModal } from "react-modal-hook";
import GameCode from "./GameCode";
import { formatCurrency } from "../../utils";

interface IFundsProps {
  gameId: string;
  playerId: string;
  isGameOpen: boolean;
  players: IGameStatePlayer[];
  freeParkingBalance: number;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
}

const Funds: React.FC<IFundsProps> = ({
  gameId,
  playerId,
  isGameOpen,
  players,
  freeParkingBalance,
  proposeTransaction
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

      <div className="balance-grid">
        {players
          .filter((p) => p.playerId !== playerId)
          .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
          .map((player) => (
            <Card key={player.name} className="text-center">
              <Card.Body className="p-3">
                <div>{player.name}</div>
                <div>{formatCurrency(player.balance)}</div>
                <Button
                  size="sm"
                  variant="outline-dark"
                  className="mt-2"
                  onClick={() => setRecipient(player)}
                >
                  Send Money
                </Button>
              </Card.Body>
            </Card>
          ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: 10 }}>
        <Card className="mt-1 text-center">
          <Card.Body className="p-3">
            <div>Free Parking</div>
            <div>{formatCurrency(freeParkingBalance)}</div>
            <Button
              size="sm"
              variant="outline-dark"
              className="mt-2"
              onClick={() => setRecipient("freeParking")}
            >
              Send Money
            </Button>
          </Card.Body>
        </Card>
        <Card className="mt-1 text-center">
          <Card.Body className="p-3">
            <div>Bank</div>
            <Button
              size="sm"
              variant="outline-dark"
              className="mt-2"
              onClick={() => setRecipient("bank")}
            >
              Send Money
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Funds;

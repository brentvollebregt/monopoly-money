import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import "./Funds.scss";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import SendMoneyModal from "./SendMoneyModal";

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
  const [sendFundsTo, setSendFundsTo] = useState<GameEntity | null>(null);

  const me = players.find((p) => p.playerId === playerId);
  const isBanker = me?.banker ?? false;

  return (
    <>
      {sendFundsTo !== null && (
        <SendMoneyModal
          balance={me?.balance ?? 0}
          playerId={playerId}
          recipient={
            sendFundsTo === "freeParking"
              ? "freeParking"
              : players.find((p) => p.playerId === sendFundsTo)!
          }
          proposeTransaction={proposeTransaction}
          onClose={() => setSendFundsTo(null)}
        />
      )}

      <div className="funds">
        {isGameOpen && (
          <div className="text-center">
            <h1>{gameId}</h1>
            {isBanker && (
              <small className="text-muted">
                You can hide this by closing the game in the settings.
              </small>
            )}
            <hr />
          </div>
        )}

        <Card className="mb-1 text-center">
          {me !== undefined && (
            <Card.Body className="p-3">
              {me.name}: ${me.balance}
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
                  <div>${player.balance}</div>
                  <Button
                    size="sm"
                    variant="outline-dark"
                    className="mt-2"
                    onClick={() => setSendFundsTo(player.playerId)}
                  >
                    Send Money
                  </Button>
                </Card.Body>
              </Card>
            ))}
        </div>

        <Card className="mt-1 text-center">
          <Card.Body className="p-3">
            <div>Free Parking: ${freeParkingBalance}</div>
            <Button
              size="sm"
              variant="outline-dark"
              className="mt-2"
              onClick={() => setSendFundsTo("freeParking")}
            >
              Send Money
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Funds;

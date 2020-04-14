import React from "react";
import { Card, Button } from "react-bootstrap";
import "./Funds.scss";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";

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
  const me = players.find((p) => p.playerId === playerId);
  const isBanker = me?.banker ?? false;

  return (
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
        <Card.Body className="p-3">My Balance: ${me?.balance}</Card.Body>
      </Card>

      <div className="balance-grid">
        {players
          .filter((p) => p.playerId !== playerId)
          .map(({ name, balance }) => (
            <Card key={name} className="text-center">
              <Card.Body className="p-3">
                <div>{name}</div>
                <div>${balance}</div>
                <Button size="sm" variant="outline-dark" className="mt-2">
                  Send Money
                </Button>
              </Card.Body>
            </Card>
          ))}
      </div>

      <Card className="mt-1 text-center">
        <Card.Body className="p-3">Free Parking: ${freeParkingBalance}</Card.Body>
      </Card>
    </div>
  );
};

export default Funds;

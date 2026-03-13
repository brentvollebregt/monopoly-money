import React from "react";
import { Card } from "react-bootstrap";
import ConnectedStateDot from "../../components/ConnectedStateDot";
import { formatCurrency } from "../../utils";

interface IPlayerCardProps {
  name: string;
  connected: boolean | null;
  balance: number | null;
  onClick: () => void;
}

const PlayerCard: React.FC<IPlayerCardProps> = ({ name, connected, balance, onClick }) => {
  return (
    <Card className="player-card text-center">
      {connected !== null && <ConnectedStateDot connected={connected} className="m-2" />}
      <Card.Body className="p-3" onClick={onClick}>
        <div>{name}</div>
        {balance !== null && <div>{Number.isFinite(balance) ? formatCurrency(balance) : "∞"}</div>}
      </Card.Body>
    </Card>
  );
};

export default PlayerCard;

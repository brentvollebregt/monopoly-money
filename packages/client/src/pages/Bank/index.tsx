import React from "react";
import ValuePlayerForm from "./ValuePlayerForm";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import "./Bank.scss";

interface IBankProps {
  players: IGameStatePlayer[];
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
}

const Bank: React.FC<IBankProps> = ({ players, proposeTransaction }) => {
  return (
    <div className="bank">
      <ValuePlayerForm
        label="Give Money To Player"
        submitText="Send"
        players={players}
        onSubmit={(value: number, playerId: string) => proposeTransaction("bank", playerId, value)}
      />
      <ValuePlayerForm
        label="Take Money From Player"
        submitText="Take"
        players={players}
        onSubmit={(value: number, playerId: string) => proposeTransaction("bank", playerId, -value)}
      />

      {/* Move money from player A to player B */}

      {/* Give free parking to a player */}
    </div>
  );
};

export default Bank;

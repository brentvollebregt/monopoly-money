import React from "react";
import ValuePlayerForm from "./ValuePlayerForm";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import "./Bank.scss";
import GiveFreeParking from "./GiveFreeParking";

interface IBankProps {
  players: IGameStatePlayer[];
  freeParkingBalance: number;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
}

const Bank: React.FC<IBankProps> = ({ players, freeParkingBalance, proposeTransaction }) => {
  return (
    <div className="bank">
      <div className="mb-3">
        <ValuePlayerForm
          label="Give Money To Player"
          submitText="Send"
          players={players}
          onSubmit={(value: number, playerId: string) =>
            proposeTransaction("bank", playerId, value)
          }
        />
      </div>

      <div className="mb-3">
        <ValuePlayerForm
          label="Take Money From Player"
          submitText="Take"
          players={players}
          onSubmit={(value: number, playerId: string) =>
            proposeTransaction("bank", playerId, -value)
          }
        />
      </div>

      <div className="mb-3">
        <GiveFreeParking
          players={players}
          freeParkingBalance={freeParkingBalance}
          onSubmit={(playerId: string) =>
            proposeTransaction("freeParking", playerId, freeParkingBalance)
          }
        />
      </div>
    </div>
  );
};

export default Bank;

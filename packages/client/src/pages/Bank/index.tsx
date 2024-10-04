import { GameEntity, IGameStatePlayer } from "@monopoly-money/game-state";
import React from "react";
import "./Bank.scss";
import GiveFreeParking from "./GiveFreeParking";
import InitialiseGame from "./InitialiseGame";
import PlayerPassedGo from "./PlayerPassedGo";
import ValuePlayerForm from "./ValuePlayerForm";

interface IBankProps {
  players: IGameStatePlayer[];
  useFreeParking: boolean;
  freeParkingBalance: number;
  hasATransactionBeenMade: boolean;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
}

const Bank: React.FC<IBankProps> = ({
  players,
  useFreeParking,
  freeParkingBalance,
  hasATransactionBeenMade,
  proposeTransaction
}) => {
  return (
    <div className="bank">
      {!hasATransactionBeenMade && (
        <div className="mb-3">
          <InitialiseGame players={players} proposeTransaction={proposeTransaction} />
        </div>
      )}

      <div className="mb-4">
        <ValuePlayerForm
          label="Give Money To Player"
          submitText="Send"
          players={players}
          onSubmit={(value: number, playerId: string) =>
            proposeTransaction("bank", playerId, value)
          }
        />
      </div>

      <div className="mb-4">
        <PlayerPassedGo
          players={players}
          onSubmit={(value: number, playerId: string) =>
            proposeTransaction("bank", playerId, value)
          }
        />
      </div>

      {useFreeParking && (
        <div className="mb-4">
          <GiveFreeParking
            players={players}
            freeParkingBalance={freeParkingBalance}
            onSubmit={(playerId: string) =>
              proposeTransaction("freeParking", playerId, freeParkingBalance)
            }
          />
        </div>
      )}

      <div className="mb-4">
        <ValuePlayerForm
          label="Take Money From Player"
          submitText="Take"
          players={players}
          onSubmit={(value: number, playerId: string) =>
            proposeTransaction(playerId, "bank", value)
          }
        />
      </div>
    </div>
  );
};

export default Bank;

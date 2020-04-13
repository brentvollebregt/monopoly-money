import React from "react";
import ValuePlayerForm from "./ValuePlayerForm";
import { IGameStatePlayer } from "@monopoly-money/game-state";
import "./Bank.scss";

interface IBankProps {
  players: IGameStatePlayer[];
}

const Bank: React.FC<IBankProps> = ({ players }) => {
  return (
    <div className="bank">
      <ValuePlayerForm
        label="Give Money To Player"
        submitText="Send"
        players={players}
        onSubmit={(value: number, playerId: string) =>
          console.log(`Give ${value} to ${playerId} from bank`)
        }
      />
      <ValuePlayerForm
        label="Take Money From Player"
        submitText="Take"
        players={players}
        onSubmit={(value: number, playerId: string) =>
          console.log(`Take ${value} to ${playerId} and give to the bank`)
        }
      />

      {/* Move money from player A to player B */}

      {/* Give free parking to a player */}
    </div>
  );
};

export default Bank;

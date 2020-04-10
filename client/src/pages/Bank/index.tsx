import React, { useState } from "react";
import { InputGroup, Button, FormControl, DropdownButton, Dropdown } from "react-bootstrap";
import "./Bank.scss";
import ValuePlayerForm from "./ValuePlayerForm";

const Bank: React.FC = () => {
  const players = [
    {
      name: "Brent",
      balance: 50000000,
      playerId: "5hg43-5v34v345v-35v345v34-5v34"
    },
    {
      name: "Robert",
      balance: 52550000,
      playerId: "5hg43-fdsftrge3-gerger-5v34"
    },
    {
      name: "Bob",
      balance: 1000000,
      playerId: "5hg43-5v34v345v-fdsfsdfsd-534tfg434ct"
    }
  ];

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

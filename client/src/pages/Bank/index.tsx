import React, { useState } from "react";
import { InputGroup, Button, FormControl, DropdownButton, Dropdown } from "react-bootstrap";
import "./Bank.scss";

const Bank: React.FC = () => {
  const [giveMoneyToPlayerAmount, setGiveMoneyToPlayerAmount] = useState("");

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
      <label htmlFor="give-money-to-player-value">Give Money To Player</label>
      <InputGroup className="mb-3">
        <FormControl
          id="give-money-to-player-value"
          placeholder="$100000"
          value={giveMoneyToPlayerAmount}
        />
        <DropdownButton
          variant="outline-secondary"
          id="give-money-to-player-player"
          className="mid-dropdown"
          title="Dropdown"
        >
          <Dropdown.Item>Action</Dropdown.Item>
          <Dropdown.Item>Another action</Dropdown.Item>
          <Dropdown.Item>Something else here</Dropdown.Item>
          <Dropdown.Item>Separated link</Dropdown.Item>
        </DropdownButton>
        <InputGroup.Append>
          <Button variant="outline-secondary" disabled={true}>
            Send
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {/* Give money to a player */}
      {/* Take money from a player */}
      {/* Move money from player A to player B */}
      {/* Give free parking to a player */}
      Bank
    </div>
  );
};

export default Bank;

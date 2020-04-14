import React, { useState } from "react";
import { InputGroup, Button, FormControl, DropdownButton, Dropdown } from "react-bootstrap";
import "./Bank.scss";

interface IPlayerSummary {
  name: string;
  balance: number;
  playerId: string;
}

interface IValuePlayerFormProps {
  label: string;
  submitText: string;
  players: IPlayerSummary[];
  onSubmit: (value: number, playerId: string) => void;
}

const ValuePlayerForm: React.FC<IValuePlayerFormProps> = ({
  label,
  submitText,
  players,
  onSubmit
}) => {
  const identifier = label.toLowerCase().replace(" ", "-");
  const [amount, setAmount] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayerSummary | null>(null);

  const valid = amount !== "" && selectedPlayer !== null;

  const onAmountUpdate = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const int = parseInt(value ?? "", 10);
    setAmount(isNaN(int) ? "" : `${int}`);
  };

  const submit = () => {
    if (selectedPlayer !== null) {
      onSubmit(parseInt(amount, 10), selectedPlayer.playerId);
      setAmount("");
      setSelectedPlayer(null);
    }
  };

  return (
    <>
      <label htmlFor={`${identifier}-value`}>{label}</label>
      <InputGroup className="mb-3">
        <FormControl
          type="number"
          id={`${identifier}-value`}
          value={amount}
          onChange={onAmountUpdate}
          className="with-dollar-sign-input-icon"
        />
        <span className="dollar-sign-input-icon">$</span>

        <DropdownButton
          variant="outline-secondary"
          id={`${identifier}-player`}
          className="mid-dropdown"
          title={selectedPlayer?.name ?? "Select Player"}
        >
          {players.map((player) => (
            <Dropdown.Item key={player.playerId} onClick={() => setSelectedPlayer(player)}>
              {player.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={submit} disabled={!valid}>
            {submitText}
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </>
  );
};

export default ValuePlayerForm;

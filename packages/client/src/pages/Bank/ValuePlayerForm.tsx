import React, { useState } from "react";
import { InputGroup, Button, DropdownButton, Dropdown } from "react-bootstrap";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { IGameStatePlayer } from "@monopoly-money/game-state";

interface IValuePlayerFormProps {
  label: string;
  submitText: string;
  players: IGameStatePlayer[];
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
  const [selectedPlayer, setSelectedPlayer] = useState<IGameStatePlayer | null>(null);

  const valid = amount !== "" && selectedPlayer !== null;

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
      <InputGroup>
        <NumberFormat
          thousandSeparator={true}
          prefix="$"
          id={`${identifier}-value`}
          value={amount}
          onValueChange={({ value }: NumberFormatValues) => setAmount(value)}
          className="form-control"
        />
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

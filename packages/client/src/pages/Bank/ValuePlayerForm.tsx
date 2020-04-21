import React, { useState } from "react";
import { InputGroup, Button, DropdownButton, Dropdown, Form, ButtonGroup } from "react-bootstrap";
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const multiply = (multiplier: number) => {
    const value = parseInt(amount, 10);
    if (!isNaN(value)) {
      setAmount(`${multiplier * value}`);
    }
  };

  const submit = () => {
    const numericalAmount = parseInt(amount, 10);
    if (isNaN(numericalAmount)) {
      setSubmitError("Please provide an amount");
    } else if (numericalAmount <= 0) {
      setSubmitError("You must provide sum larger than $0");
    } else if (selectedPlayer === null) {
      setSubmitError("No player is selected");
    } else {
      onSubmit(parseInt(amount, 10), selectedPlayer.playerId);
      setAmount("");
      setSelectedPlayer(null);
      setSubmitError(null);
    }
  };

  return (
    <>
      <label htmlFor={`${identifier}-value`} className="mb-1">
        {label}
      </label>

      <InputGroup>
        <NumberFormat
          allowNegative={false}
          thousandSeparator={true}
          prefix="$"
          id={`${identifier}-value`}
          value={amount}
          onValueChange={({ value }: NumberFormatValues) => setAmount(value)}
          className="form-control"
        />

        <InputGroup.Append>
          <Button variant="warning" onClick={() => multiply(1000000)}>
            M
          </Button>
          <Button variant="primary" onClick={() => multiply(1000)}>
            K
          </Button>
          <Button variant="danger" onClick={() => setAmount("")}>
            C
          </Button>
        </InputGroup.Append>
      </InputGroup>

      <ButtonGroup className="mt-1 player-and-submit-group">
        <DropdownButton
          as={ButtonGroup}
          variant="outline-secondary"
          id={`${identifier}-player`}
          title={selectedPlayer?.name ?? "Select Player"}
        >
          {players.map((player) => (
            <Dropdown.Item key={player.playerId} onClick={() => setSelectedPlayer(player)}>
              {player.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <Button variant="outline-secondary" onClick={submit}>
          {submitText}
        </Button>
      </ButtonGroup>

      <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
    </>
  );
};

export default ValuePlayerForm;

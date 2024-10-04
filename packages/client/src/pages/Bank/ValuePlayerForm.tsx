import { IGameStatePlayer } from "@monopoly-money/game-state";
import React, { useState } from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton, Form } from "react-bootstrap";
import MonopolyAmountInput from "../../components/MonopolyAmountInput";

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
  const [amount, setAmount] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<IGameStatePlayer | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    if (amount === null) {
      setSubmitError("Please provide an amount");
    } else if (amount <= 0) {
      setSubmitError("You must provide sum larger than $0");
    } else if (!Number.isInteger(amount)) {
      setSubmitError("The amount must be a whole number");
    } else if (selectedPlayer === null) {
      setSubmitError("No player is selected");
    } else {
      onSubmit(amount, selectedPlayer.playerId);
      setAmount(null);
      setSelectedPlayer(null);
      setSubmitError(null);
    }
  };

  return (
    <>
      <label htmlFor={identifier} className="mb-1">
        {label}
      </label>

      <MonopolyAmountInput amount={amount} setAmount={setAmount} id={identifier} />

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

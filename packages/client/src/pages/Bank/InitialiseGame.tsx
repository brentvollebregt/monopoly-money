import React, { useState } from "react";
import { InputGroup, Button, Modal, Form } from "react-bootstrap";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import { useModal } from "react-modal-hook";
import NumberFormat, { NumberFormatValues } from "react-number-format";

interface IInitialiseGameProps {
  players: IGameStatePlayer[];
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
}

const InitialiseGame: React.FC<IInitialiseGameProps> = ({ players, proposeTransaction }) => {
  const [showModal, hideModal] = useModal(() => (
    <ValueModal
      submitAmount={(amount: number) => {
        players.forEach((p) => {
          proposeTransaction("bank", p.playerId, amount);
        });
      }}
      onClose={hideModal}
    />
  ));

  return (
    <Button variant="primary" block onClick={showModal}>
      Initialise Player Balances
    </Button>
  );
};

interface IValueModalProps {
  submitAmount: (amount: number) => void;
  onClose: () => void;
}

const ValueModal: React.FC<IValueModalProps> = ({ submitAmount, onClose }) => {
  const [amount, setAmount] = useState("");
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
    } else {
      setSubmitError(null);
      submitAmount(numericalAmount);
    }
  };

  const cancel = () => {
    setSubmitError(null);
    onClose();
  };

  return (
    <Modal show={true} onHide={cancel} size="lg" centered className="send-money-modal">
      <Modal.Header closeButton>
        <Modal.Title>Initialise Balances</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Once you give a player money or initialise balances, you can not initialise balances
          again.
        </p>

        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Amount</InputGroup.Text>
          </InputGroup.Prepend>

          <NumberFormat
            allowNegative={false}
            thousandSeparator={true}
            prefix="$"
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
          </InputGroup.Append>
        </InputGroup>

        <Button block variant="success" className="mt-1" onClick={submit}>
          Initialise
        </Button>

        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default InitialiseGame;

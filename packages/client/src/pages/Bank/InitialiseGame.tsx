import React, { useState } from "react";
import { InputGroup, Button, Modal, FormControl, Form } from "react-bootstrap";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import { useModal } from "react-modal-hook";

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

  const submit = () => {
    if (amount === "") {
      setSubmitError("Please provide an amount");
    } else {
      setSubmitError(null);
      submitAmount(parseInt(amount, 10));
    }
  };

  const cancel = () => {
    setSubmitError(null);
    onClose();
  };

  const onAmountUpdate = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const int = parseInt(value ?? "", 10);
    setAmount(isNaN(int) ? "" : `${int}`);
  };

  return (
    <Modal show={true} onHide={cancel} size="lg" centered className="send-money-modal">
      <Modal.Header closeButton>
        <Modal.Title>Initialise Amount</Modal.Title>
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
          <div className="d-flex">
            <FormControl
              type="number"
              value={amount}
              onChange={onAmountUpdate}
              className="remove-left-border-radius remove-right-border-radius with-dollar-sign-input-icon"
            />
            <span className="dollar-sign-input-icon">$</span>
          </div>
          <Button variant="success" className="remove-left-border-radius" onClick={submit}>
            Send
          </Button>
        </InputGroup>
        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default InitialiseGame;

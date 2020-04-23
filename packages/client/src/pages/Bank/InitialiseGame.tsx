import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import { useModal } from "react-modal-hook";
import MonopolyAmountInput from "../../components/MonopolyAmountInput";

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
  const [amount, setAmount] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    if (amount === null) {
      setSubmitError("Please provide an amount");
    } else if (amount <= 0) {
      setSubmitError("You must provide sum larger than $0");
    } else {
      submitAmount(amount);
      close();
    }
  };

  const close = () => {
    setAmount(null);
    setSubmitError(null);
    onClose();
  };

  return (
    <Modal show={true} onHide={close} size="lg" centered className="send-money-modal">
      <Modal.Header closeButton>
        <Modal.Title>Initialise Balances</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Once you give a player money or initialise balances, you can not initialise balances
          again.
        </p>

        <MonopolyAmountInput amount={amount} setAmount={setAmount} />

        <Button block variant="success" className="mt-1" onClick={submit}>
          Initialise
        </Button>

        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default InitialiseGame;

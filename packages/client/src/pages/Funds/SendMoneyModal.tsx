import React, { useState } from "react";
import { Card, Button, Modal, InputGroup, FormControl, Form } from "react-bootstrap";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";

interface ISendMoneyProps {
  balance: number;
  playerId: string;
  recipientPlayer: IGameStatePlayer;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
  onClose: () => void;
}

const SendMoney: React.FC<ISendMoneyProps> = ({
  balance,
  playerId,
  recipientPlayer,
  proposeTransaction,
  onClose
}) => {
  const [amount, setAmount] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    if (amount === "") {
      setSubmitError("Please provide an amount");
    } else if (parseInt(amount, 10) > balance) {
      setSubmitError(`You do not have enough money ($${balance})`);
    } else {
      setSubmitError(null);
      proposeTransaction(playerId, recipientPlayer.playerId, parseInt(amount, 10));
      onClose();
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
        <Modal.Title>Transfer Funds to {recipientPlayer.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Amount</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl type="number" value={amount} onChange={onAmountUpdate} />
          <Button variant="success" className="submit-button" onClick={submit}>
            ✔️
          </Button>
        </InputGroup>
        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default SendMoney;

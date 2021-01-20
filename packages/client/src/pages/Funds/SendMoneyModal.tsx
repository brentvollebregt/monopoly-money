import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import { formatCurrency } from "../../utils";
import { bankName, freeParkingName } from "../../constants";
import MonopolyAmountInput from "../../components/MonopolyAmountInput";

interface ISendMoneyModalProps {
  balance: number;
  playerId: string;
  recipient: "freeParking" | "bank" | IGameStatePlayer;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
  onClose: () => void;
}

const SendMoneyModal: React.FC<ISendMoneyModalProps> = ({
  balance,
  playerId,
  recipient,
  proposeTransaction,
  onClose
}) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    if (amount === null) {
      setSubmitError("Please provide an amount");
    } else if (amount <= 0) {
      setSubmitError("You must provide sum larger than $0");
    } else if (!Number.isInteger(amount)) {
      setSubmitError("The amount must be a whole number");
    } else if (amount > balance) {
      setSubmitError(`You do not have enough money (${formatCurrency(balance)})`);
    } else {
      proposeTransaction(
        playerId,
        recipient === "freeParking" || recipient === "bank" ? recipient : recipient.playerId,
        amount
      );
      close();
    }
  };

  const close = () => {
    setAmount(null);
    setSubmitError(null);
    onClose();
  };

  const getRecipientName = () => {
    if (recipient === "freeParking") {
      return freeParkingName;
    } else if (recipient === "bank") {
      return bankName;
    } else {
      return recipient.name;
    }
  };

  return (
    <Modal show={true} onHide={close} size="lg" centered className="send-money-modal">
      <Modal.Header closeButton>
        <Modal.Title>Transfer Funds</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">💵 → {getRecipientName()}</p>

        <MonopolyAmountInput amount={amount} setAmount={setAmount} />

        <Button block variant="success" className="mt-1" onClick={submit}>
          Send
        </Button>

        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default SendMoneyModal;

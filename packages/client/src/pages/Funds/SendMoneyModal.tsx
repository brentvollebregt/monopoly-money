import React, { useState } from "react";
import { Button, Modal, InputGroup, Form } from "react-bootstrap";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import { formatCurrency } from "../../utils";
import NumberFormat, { NumberFormatValues } from "react-number-format";

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
  const [amount, setAmount] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    const numericalAmount = parseInt(amount, 10);
    if (isNaN(numericalAmount)) {
      setSubmitError("Please provide an amount");
    } else if (numericalAmount <= 0) {
      setSubmitError("You must provide sum larger than $0");
    } else if (numericalAmount > balance) {
      setSubmitError(`You do not have enough money (${formatCurrency(balance)})`);
    } else {
      proposeTransaction(
        playerId,
        recipient === "freeParking" || recipient === "bank" ? recipient : recipient.playerId,
        parseInt(amount, 10)
      );
      setAmount("");
      setSubmitError(null);
      onClose();
    }
  };

  const cancel = () => {
    setSubmitError(null);
    onClose();
  };

  const getRecipientName = () => {
    if (recipient === "freeParking") {
      return "Free Parking";
    } else if (recipient === "bank") {
      return "Bank";
    } else {
      return recipient.name;
    }
  };

  return (
    <Modal show={true} onHide={cancel} size="lg" centered className="send-money-modal">
      <Modal.Header closeButton>
        <Modal.Title>Transfer Funds to {getRecipientName()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          <Button variant="success" className="remove-left-border-radius" onClick={submit}>
            Send
          </Button>
        </InputGroup>
        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default SendMoneyModal;

import React, { useState } from "react";
import { Button, Modal, InputGroup, Form } from "react-bootstrap";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import { formatCurrency } from "../../utils";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { bankName, freeParkingName } from "../../constants";

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
      return freeParkingName;
    } else if (recipient === "bank") {
      return bankName;
    } else {
      return recipient.name;
    }
  };

  return (
    <Modal show={true} onHide={cancel} size="lg" centered className="send-money-modal">
      <Modal.Header closeButton>
        <Modal.Title>Transfer Funds</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">💵 → {getRecipientName()}</p>

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
            autoComplete="off"
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
          Send
        </Button>

        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default SendMoneyModal;

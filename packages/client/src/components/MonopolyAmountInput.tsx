import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Button } from "react-bootstrap";
import NumberFormat, { NumberFormatValues } from "react-number-format";

interface IMonopolyAmountInputProps {
  amount: number | null;
  setAmount: (amount: number | null) => void;
  id?: string;
}

const MonopolyAmountInput: React.FC<IMonopolyAmountInputProps> = ({ amount, setAmount, id }) => {
  const [inputValue, setInputValue] = useState("");
  const numberInputRef = useRef<HTMLInputElement>(null);

  // When the external amount changes, update the internal
  useEffect(() => {
    setInputValue(amount === 0 || amount === null ? "" : `${amount}`);
  }, [amount]);

  // When the internal amount changes, update the external
  useEffect(() => {
    setAmount(inputValue === "" ? null : parseFloat(inputValue));
  }, [inputValue]);

  const multiply = (multiplier: number) => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      setInputValue(`${multiplier * value}`);
    }

    // Refocus the number input. Since useState is async, we need to wait for the value to be updated
    setTimeout(() => {
      if (numberInputRef.current !== null) {
        numberInputRef.current.focus();
        numberInputRef.current.setSelectionRange(-1, -1);
      }
    }, 50);
  };

  return (
    <InputGroup style={{ display: "grid", gridTemplateColumns: "2fr 7fr 2fr" }}>
      <InputGroup.Prepend>
        <Button block variant="warning" onClick={() => multiply(1000000)}>
          M
        </Button>
      </InputGroup.Prepend>

      <NumberFormat
        allowNegative={false}
        thousandSeparator={true}
        prefix="$"
        id={id}
        value={inputValue}
        onValueChange={({ value }: NumberFormatValues) => setInputValue(value)}
        className="form-control text-center w-100"
        autoComplete="off"
        getInputRef={numberInputRef}
        inputMode="decimal"
      />

      <InputGroup.Append>
        <Button block variant="primary" onClick={() => multiply(1000)}>
          K
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
};

export default MonopolyAmountInput;

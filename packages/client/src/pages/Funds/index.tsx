import React from "react";
import { Card, Button } from "react-bootstrap";
import "./Funds.scss";

const Funds: React.FC = () => {
  const gameId = "456897";
  const isGameOpen = true;

  const balances = [
    {
      name: "Brent",
      balance: 10000000
    },
    {
      name: "Fay",
      balance: 50000
    },
    {
      name: "Jim",
      balance: 355000
    },
    {
      name: "Rob",
      balance: 4868000
    }
  ];

  const myBalance = 1510000;
  const freeParkingBalance = 1000;

  return (
    <div className="funds">
      {isGameOpen && (
        <div className="text-center">
          <h1>{gameId}</h1>
          <small className="text-muted">
            You can hide this by closing the game in the settings.
          </small>
          <hr />
        </div>
      )}

      <Card className="mb-1 text-center">
        <Card.Body className="p-3">My Balance: ${myBalance}</Card.Body>
      </Card>

      <div className="balance-grid">
        {balances.map(({ name, balance }) => (
          <Card key={name} className="text-center">
            <Card.Body className="p-3">
              <div>{name}</div>
              <div>${balance}</div>
              <Button size="sm" variant="outline-dark" className="mt-2">
                Send Money
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Card className="mt-1 text-center">
        <Card.Body className="p-3">Free Parking: ${freeParkingBalance}</Card.Body>
      </Card>
    </div>
  );
};

export default Funds;

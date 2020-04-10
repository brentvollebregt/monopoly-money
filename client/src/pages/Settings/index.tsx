import React from "react";
import { Button, Table } from "react-bootstrap";

const Settings: React.FC = () => {
  const isGameOpen = true;
  const players = [
    {
      name: "Brent",
      balance: 50000000,
      playerId: "5hg43-5v34v345v-35v345v34-5v34"
    },
    {
      name: "Robert",
      balance: 52550000,
      playerId: "5hg43-fdsftrge3-gerger-5v34"
    },
    {
      name: "Bob",
      balance: 1000000,
      playerId: "5hg43-5v34v345v-fdsfsdfsd-534tfg434ct"
    }
  ];

  return (
    <div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Balance</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {players.map(({ name, balance, playerId }) => (
            <tr>
              <td>{name}</td>
              <td>{balance}</td>
              <td>
                <Button variant="outline-secondary" size="sm" title="Rename">
                  ✏️
                </Button>
                <Button variant="outline-danger" size="sm" title="Remove" className="ml-1">
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button block variant="primary">
        {isGameOpen ? "Close" : "Open"} Game To New Players
      </Button>

      <Button block variant="danger">
        End Game
      </Button>
    </div>
  );
};

export default Settings;

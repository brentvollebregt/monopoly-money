import React from "react";
import { Button, Table } from "react-bootstrap";
import { IGameStatePlayer } from "@monopoly-money/game-state";

interface ISettingsProps {
  isGameOpen: boolean;
  players: IGameStatePlayer[];
  proposePlayerNameChange: (playerId: string, name: string) => void;
  proposePlayerDelete: (playerId: string) => void;
  proposeGameOpenStateChange: (open: boolean) => void;
  proposeGameEnd: () => void;
}

const Settings: React.FC<ISettingsProps> = ({
  isGameOpen,
  players,
  proposePlayerNameChange,
  proposePlayerDelete,
  proposeGameOpenStateChange,
  proposeGameEnd
}) => {
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
            <tr key={playerId}>
              <td>{name}</td>
              <td>${balance}</td>
              <td>
                <Button variant="outline-secondary" size="sm" title="Rename">
                  <span role="img" aria-label="Rename">
                    ✏️
                  </span>
                </Button>
                <Button variant="outline-danger" size="sm" title="Remove" className="ml-1">
                  <span role="img" aria-label="Remove">
                    🗑️
                  </span>
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

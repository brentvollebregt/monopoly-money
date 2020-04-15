import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { IGameStatePlayer } from "@monopoly-money/game-state";
import { useModal } from "react-modal-hook";
import RenamePlayer from "./RenamePlayer";
import DeletePlayer from "./DeletePlayer";

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
  const [actioningPlayer, setActioningPlayer] = useState<IGameStatePlayer | null>(null);
  const [showNameChangeModal, hideNameChangeModal] = useModal(
    () => (
      <>
        {actioningPlayer !== null && (
          <RenamePlayer
            player={actioningPlayer}
            proposePlayerNameChange={proposePlayerNameChange}
            onClose={hideNameChangeModal}
          />
        )}
      </>
    ),
    [actioningPlayer]
  );
  const [showDeletePlayerModal, hideDeletePlayerModal] = useModal(
    () => (
      <>
        {actioningPlayer !== null && (
          <DeletePlayer
            player={actioningPlayer}
            proposePlayerDelete={proposePlayerDelete}
            onClose={hideDeletePlayerModal}
          />
        )}
      </>
    ),
    [actioningPlayer]
  );

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
          {players.map((player) => (
            <tr key={player.playerId}>
              <td>{player.name}</td>
              <td>${player.balance}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  title="Rename"
                  onClick={() => {
                    setActioningPlayer(player);
                    showNameChangeModal();
                  }}
                >
                  <span role="img" aria-label="Rename">
                    ✏️
                  </span>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  title="Remove"
                  className="ml-1"
                  onClick={() => {
                    setActioningPlayer(player);
                    showDeletePlayerModal();
                  }}
                >
                  <span role="img" aria-label="Remove">
                    🗑️
                  </span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button block variant="primary" onClick={() => proposeGameOpenStateChange(!isGameOpen)}>
        {isGameOpen ? "Close" : "Open"} Game To New Players
      </Button>

      <Button block variant="danger" onClick={() => proposeGameEnd()}>
        End Game
      </Button>
    </div>
  );
};

export default Settings;

import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { IGameStatePlayer } from "@monopoly-money/game-state";
import { useModal } from "react-modal-hook";
import RenamePlayerModal from "./RenamePlayerModal";
import DeletePlayerModal from "./DeletePlayerModal";
import EndGameConfirmDialog from "./EndGameConfirmDialog";
import { formatCurrency, sortPlayersByName } from "../../utils";
import "./Settings.scss";
import ConnectedStateDot from "../../components/ConnectedStateDot";

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
          <RenamePlayerModal
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
          <DeletePlayerModal
            player={actioningPlayer}
            proposePlayerDelete={proposePlayerDelete}
            onClose={hideDeletePlayerModal}
          />
        )}
      </>
    ),
    [actioningPlayer]
  );
  const [showEndGameConfirmModal, hideEndGameConfirmModal] = useModal(
    () => (
      <>
        <EndGameConfirmDialog proposeGameEnd={proposeGameEnd} onClose={hideEndGameConfirmModal} />
      </>
    ),
    [actioningPlayer]
  );

  return (
    <div className="settings">
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Balance</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortPlayersByName(players).map((player) => (
            <tr key={player.playerId} className="player-row">
              <td>
                <ConnectedStateDot connected={player.connected} />
              </td>
              <td>{player.name}</td>
              <td>{formatCurrency(player.balance)}</td>
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

      <Button block variant="danger" onClick={() => showEndGameConfirmModal()}>
        End Game
      </Button>
    </div>
  );
};

export default Settings;

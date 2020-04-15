import React from "react";
import { Button, Modal } from "react-bootstrap";
import { IGameStatePlayer } from "@monopoly-money/game-state";

interface IDeletePlayerProps {
  player: IGameStatePlayer;
  proposePlayerDelete: (playerId: string) => void;
  onClose: () => void;
}

const DeletePlayer: React.FC<IDeletePlayerProps> = ({ player, proposePlayerDelete, onClose }) => {
  return (
    <Modal show={true} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Remove Player</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to remove {player.name}?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="success"
          className=" ml-1"
          onClick={() => {
            proposePlayerDelete(player.playerId);
            onClose();
          }}
        >
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePlayer;

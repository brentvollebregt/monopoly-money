import React from "react";
import { Button, Modal } from "react-bootstrap";
import { IGameStatePlayer } from "@monopoly-money/game-state";

interface IDeletePlayerModalProps {
  player: IGameStatePlayer;
  proposePlayerDelete: (playerId: string) => void;
  onClose: () => void;
}

const DeletePlayerModal: React.FC<IDeletePlayerModalProps> = ({
  player,
  proposePlayerDelete,
  onClose
}) => {
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

export default DeletePlayerModal;

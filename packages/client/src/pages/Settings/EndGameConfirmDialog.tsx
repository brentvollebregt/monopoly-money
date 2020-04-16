import React from "react";
import { Button, Modal } from "react-bootstrap";

interface IEndGameConfirmDialogProps {
  proposeGameEnd: () => void;
  onClose: () => void;
}

const EndGameConfirmDialog: React.FC<IEndGameConfirmDialogProps> = ({
  proposeGameEnd,
  onClose
}) => {
  return (
    <Modal show={true} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>End Game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to end the game?</p>
        <p>This will kick everyone and you will not be able to re-join the game.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="success"
          className=" ml-1"
          onClick={() => {
            proposeGameEnd();
            onClose();
          }}
        >
          End Game
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EndGameConfirmDialog;

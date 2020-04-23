import React from "react";
import { Button, Modal } from "react-bootstrap";

export interface IMessageModalProps {
  title: string;
  body: JSX.Element;
  onClose: () => void;
}

const MessageModal: React.FC<IMessageModalProps> = ({ title, body, onClose }) => {
  return (
    <Modal show={true} onHide={onClose} size="lg" centered className="send-money-modal">
      <Modal.Header closeButton>
        <Modal.Title> {title} </Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button block variant="primary" onClick={onClose}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;

import React from "react";
import { Button, Modal } from "react-bootstrap";

export interface IMessageModalProps {
  title: string;
  body: JSX.Element;
  onClose: () => void;
  closeButtonText?: string | null;
}

const MessageModal: React.FC<IMessageModalProps> = ({
  title,
  body,
  onClose,
  closeButtonText = "Ok"
}) => {
  return (
    <Modal show={true} onHide={onClose} size="lg" centered className="send-money-modal">
      <Modal.Header
        closeButton
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        placeholder={undefined}
      >
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      {closeButtonText !== null && (
        <Modal.Footer>
          <Button block variant="primary" onClick={onClose}>
            {closeButtonText}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default MessageModal;

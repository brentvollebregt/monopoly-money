import { useState } from "react";
import { useModal } from "react-modal-hook";
import MessageModal, { IMessageModalProps } from "../components/MessageModal";

const useMessageModal = () => {
  const [modalProps, setModalProps] = useState<Omit<IMessageModalProps, "onClose"> | null>(null);
  const [showModal, hideModal] = useModal(
    () => <>{modalProps !== null && <MessageModal {...modalProps} onClose={hideModal} />}</>,
    [modalProps]
  );

  const setupModal = (props: Omit<IMessageModalProps, "onClose">) => {
    setModalProps(props);
    showModal();
  };

  return setupModal;
};

export default useMessageModal;

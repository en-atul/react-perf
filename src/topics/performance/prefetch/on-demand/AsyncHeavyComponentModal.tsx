import Modal from "@/components/Modal";
import HeavyComponent from "./HeavyComponent";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export default function AsyncHeavyComponentModal(props: Props) {
  const { onClose, isOpen } = props;

  return (
    <Modal.Provider
      controlledOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal size="lg" onClose={onClose}>
        <Modal.Header>
          <Modal.Title>Preloaded Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HeavyComponent />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close onClick={onClose}>Close</Modal.Close>
        </Modal.Footer>
      </Modal>
    </Modal.Provider>
  );
}

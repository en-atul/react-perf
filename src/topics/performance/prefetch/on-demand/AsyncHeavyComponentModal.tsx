import { useEffect } from "react";
import Modal from "@/components/Modal";
import HeavyComponent from "./HeavyComponent";
import heavyData from "./titanic-parquet.json";
import { useMemo } from "react";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  onReady?: () => void; // notify when modal content has mounted
}

export default function AsyncHeavyComponentModal(props: Props) {
  const { onClose, isOpen, onReady } = props;

  useEffect(() => {
    onReady?.();
  }, [onReady]);

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
          {/**
           * Touch heavy JSON so it stays in the modal chunk and adds parse time.
           * We compute a simple checksum and counts to ensure it's used.
           */}
          {useMemo(() => {
            const text = JSON.stringify(heavyData);
            let checksum = 0;
            for (let i = 0; i < text.length; i++) checksum = (checksum + text.charCodeAt(i)) % 1000000007;
            const sizeKB = (text.length / 1024).toFixed(1);
            return (
              <div style={{ marginBottom: 12 }}>
                <div><strong>Embedded data size:</strong> ~{sizeKB} KB</div>
                <div><strong>Checksum:</strong> {checksum}</div>
              </div>
            );
          }, [])}
          <HeavyComponent />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close onClick={onClose}>Close</Modal.Close>
        </Modal.Footer>
      </Modal>
    </Modal.Provider>
  );
}

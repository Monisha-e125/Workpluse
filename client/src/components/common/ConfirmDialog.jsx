import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isLoading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>{confirmText}</Button>
      </>
    }
  >
    <p className="text-dark-300">{message}</p>
  </Modal>
);

export default ConfirmDialog;
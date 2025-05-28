const ReleaseTableModalViewModel = ({ onClose, onConfirm }) => {
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return {
    handleClose,
    handleConfirm,
  };
};

export default ReleaseTableModalViewModel;
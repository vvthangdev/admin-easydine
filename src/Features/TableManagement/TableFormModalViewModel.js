import { useForm } from "react-hook-form";
import { useCallback } from "react";

const TableFormModalViewModel = ({ onClose, onSubmit, editingTable }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: editingTable || { table_number: "", capacity: "", area: "" },
  });

  const handleFormSubmit = useCallback(
    (data) => {
      onSubmit(data);
      reset();
    },
    [onSubmit, reset]
  );

  const handleClose = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return {
    control,
    handleSubmit,
    reset,
    handleFormSubmit,
    handleClose,
  };
};

export default TableFormModalViewModel;
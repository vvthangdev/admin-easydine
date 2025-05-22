// VoucherFormModalViewModel.js
import { useState, useCallback, useEffect } from "react";
import { voucherAPI } from "../../../services/apis/Voucher";

const VoucherFormModalViewModel = ({
  form,
  editingVoucher,
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
  onCancel,
}) => {
  const [userSelectModalOpen, setUserSelectModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialForm, setInitialForm] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Lưu trạng thái form ban đầu để kiểm tra thay đổi
  useEffect(() => {
    setInitialForm({ ...form });
  }, [form]);

  // Kiểm tra xem form có thay đổi không
  useEffect(() => {
    const isDirty = Object.keys(form).some(
      (key) => form[key] !== initialForm[key] && key !== "touched"
    );
    setIsFormDirty(isDirty || selectedUsers.length !== initialForm.applicableUsers?.length);
  }, [form, selectedUsers, initialForm]);

  const handleFieldChange = useCallback(
    (field, value) => {
      form.setFieldsValue({ [field]: value });
    },
    [form]
  );

  const updateUsers = useCallback(
    async (userIds, action) => {
      setLoading(true);
      try {
        if (editingVoucher && action === "add") {
          await voucherAPI.addUsersToVoucher(editingVoucher._id, userIds);
        } else if (editingVoucher && action === "remove") {
          await voucherAPI.removeUsersFromVoucher(editingVoucher._id, userIds);
        }
        setSelectedUsers(userIds);
        setSnackbar({
          open: true,
          message: action === "add" ? "Thêm người dùng thành công" : "Xóa người dùng thành công",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `${action === "add" ? "Thêm" : "Xóa"} người dùng thất bại: ${error.message}`,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [editingVoucher, setSelectedUsers, setSnackbar]
  );

  const handleRemoveUser = useCallback(
    async (userId) => {
      const updatedUsers = selectedUsers.filter((id) => id !== userId);
      await updateUsers(updatedUsers, "remove");
    },
    [selectedUsers, updateUsers]
  );

  const handleConfirmUserSelection = useCallback(async () => {
    await updateUsers([...new Set(selectedUsers)], "add");
    setUserSelectModalOpen(false);
  }, [selectedUsers, updateUsers]);

  const handleCancelWithConfirmation = useCallback(() => {
    if (isFormDirty) {
      if (window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy không?")) {
        setSelectedUsers([]);
        setUserSelectModalOpen(false);
        setIsFormDirty(false);
        onCancel();
      }
    } else {
      setSelectedUsers([]);
      setUserSelectModalOpen(false);
      onCancel();
    }
  }, [isFormDirty, setSelectedUsers]);

  return {
    userSelectModalOpen,
    setUserSelectModalOpen,
    handleFieldChange,
    handleRemoveUser,
    handleConfirmUserSelection,
    loading,
    handleCancelWithConfirmation,
  };
};

export default VoucherFormModalViewModel;
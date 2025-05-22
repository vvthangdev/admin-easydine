import { useState, useCallback } from "react";
import { voucherAPI } from "../../../services/apis/Voucher";

const VoucherFormModalViewModel = ({
  form,
  editingVoucher,
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
}) => {
  const [userSelectModalOpen, setUserSelectModalOpen] = useState(false);

  const handleFieldChange = useCallback((field, value) => {
    form.setFieldsValue({ [field]: value });
  }, [form]);

  const handleRemoveUser = useCallback(async (userId) => {
    if (editingVoucher) {
      try {
        await voucherAPI.removeUsersFromVoucher(editingVoucher._id, [userId]);
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        setSnackbar({
          open: true,
          message: "Xóa người dùng khỏi voucher thành công",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Xóa người dùng thất bại: ${error.message}`,
          severity: "error",
        });
      }
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  }, [editingVoucher, selectedUsers, setSelectedUsers, setSnackbar]);

  const handleAddUsers = useCallback(async (userIds) => {
    if (editingVoucher) {
      try {
        await voucherAPI.addUsersToVoucher(editingVoucher._id, userIds);
        setSelectedUsers([...new Set([...selectedUsers, ...userIds])]);
        setSnackbar({
          open: true,
          message: "Thêm người dùng vào voucher thành công",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Thêm người dùng thất bại: ${error.message}`,
          severity: "error",
        });
      }
    } else {
      setSelectedUsers([...new Set([...selectedUsers, ...userIds])]);
    }
  }, [editingVoucher, selectedUsers, setSelectedUsers, setSnackbar]);

  return {
    userSelectModalOpen,
    setUserSelectModalOpen,
    handleFieldChange,
    handleRemoveUser,
    handleAddUsers,
  };
};

export default VoucherFormModalViewModel;
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Plus, RefreshCw } from "lucide-react";
import UserTable from "./UserTable";
import UserFormModalView from "./UserFormModalView";
import UserFormModalViewModel from "./UserFormModalViewModel";
import UserSearch from "./UserSearch";
import UserScreenViewModel from "./UserScreenViewModel";
import {
  dialogStyles,
  buttonStyles,
  progressStyles,
  typography,
  colors,
  boxStyles,
  textStyles,
} from "../../../styles"; // Import styles từ index.js

const UserScreenView = ({ setSnackbar }) => {
  const {
    users,
    filteredUsers,
    isModalVisible,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    editingUser,
    loading,
    searchTerm,
    handleSearch,
    handleEnter,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleToggleActive,
    setIsModalVisible,
    setUsers,
    setFilteredUsers,
    fetchUsers,
  } = UserScreenViewModel({ setSnackbar });

  const {
    form,
    errors,
    avatar,
    handleFieldChange,
    handleRoleChange,
    handleUploadChange,
    handleOk,
    handleCancel,
  } = UserFormModalViewModel({
    editingUser,
    setSnackbar,
  });

  const handleModalOk = async () => {
    try {
      const updatedUser = await handleOk();
      if (updatedUser) {
        if (editingUser) {
          const updatedUsers = users.map((user) =>
            user._id === editingUser._id ? { ...user, ...updatedUser } : user
          );
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
        } else {
          setUsers([...users, updatedUser]);
          setFilteredUsers([...filteredUsers, updatedUser]);
        }
        setIsModalVisible(false);
      }
    } catch (error) {
      // Lỗi đã được xử lý trong UserFormModalViewModel, không cần làm gì thêm
    }
  };

  return (
    <Box>
      <Box sx={boxStyles.header}>
        {" "}
        {/* Sử dụng boxStyles.header */}
        <Typography
          variant="h6"
          sx={{ color: colors.neutral[800], ...typography.h6 }}
        >
          Danh sách người dùng
        </Typography>
        <Box sx={boxStyles.buttonGroup}>
          {" "}
          {/* Sử dụng boxStyles.buttonGroup */}
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={fetchUsers}
            sx={buttonStyles.outlinedPrimary} // Sử dụng buttonStyles.outlinedPrimary
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => {
              handleEdit(null);
              setIsModalVisible(true);
            }}
            sx={buttonStyles.primary} // Sử dụng buttonStyles.primary
          >
            Thêm người dùng
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <UserSearch
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onEnter={handleEnter}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={progressStyles.primary} />{" "}
          {/* Sử dụng progressStyles.primary */}
        </Box>
      ) : (
        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      )}

      <UserFormModalView
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          handleCancel();
          setIsModalVisible(false);
        }}
        form={form}
        editingUser={editingUser}
        avatar={avatar}
        onUploadChange={handleUploadChange}
        handleFieldChange={handleFieldChange}
        handleRoleChange={handleRoleChange}
        errors={errors}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{ sx: dialogStyles.paper }} // Sử dụng dialogStyles.paper
      >
        <DialogTitle sx={dialogStyles.titleError}>
          {" "}
          {/* Sử dụng dialogStyles.titleError */}
          Xác nhận xóa người dùng
        </DialogTitle>
        <DialogContent sx={dialogStyles.content}>
          {" "}
          {/* Sử dụng dialogStyles.content */}
          <Typography
            variant="body1"
            sx={{ color: colors.neutral[800], ...typography.body1 }}
          >
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>{userToDelete?.name}</strong> không?
          </Typography>
          <Typography variant="body2" sx={textStyles.error}>
            {" "}
            {/* Sử dụng textStyles.error */}
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={dialogStyles.actions}>
          {" "}
          {/* Sử dụng dialogStyles.actions */}
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={buttonStyles.outlined} // Sử dụng buttonStyles.outlined
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={confirmDelete}
            sx={buttonStyles.danger} // Sử dụng buttonStyles.danger
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserScreenView;

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
import minioClient from "../../../Server/minioClient";
import { adminAPI } from "../../../services/apis/Admin";
import { message } from "antd";

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
    onSave: async (formData) => {
      try {
        let imageUrl = editingUser?.avatar || "";
        if (formData.avatar) {
          const timestamp = Date.now();
          const fileName = `images/${timestamp}_${formData.avatar.name}`;
          const minioStorage = minioClient.storage.from("test01");
          const { error } = await minioStorage.upload(
            fileName,
            formData.avatar
          );
          if (error) throw new Error(`Không thể upload file: ${error.message}`);
          const { data: publicUrlData } = minioStorage.getPublicUrl(fileName);
          if (!publicUrlData.publicUrl)
            throw new Error("Không thể lấy URL công khai cho ảnh.");
          imageUrl = publicUrlData.publicUrl;
        }

        const userData = {
          id: editingUser?._id,
          email: formData.email,
          username: formData.username,
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          address: formData.address,
          avatar: imageUrl,
          ...(formData.password && { password: formData.password }),
        };

        if (editingUser) {
          await adminAPI.updateUser(userData);
          const updatedUser = {
            ...editingUser,
            ...userData,
            _id: editingUser._id,
          };
          const updatedUsers = users.map((user) =>
            user._id === editingUser._id ? updatedUser : user
          );
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          setSnackbar({
            open: true,
            message: "Cập nhật người dùng thành công",
            severity: "success",
          });
        }
        setIsModalVisible(false);
      } catch (error) {
        message.error(error.message)
      }
    },
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1d1d1f",
            fontWeight: 600,
            fontFamily: '"SF Pro Display", Roboto, sans-serif',
          }}
        >
          Danh sách người dùng
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={fetchUsers}
            sx={{
              borderColor: "#0071e3",
              color: "#0071e3",
              borderRadius: 28,
              px: 3,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#0071e3",
                background: "rgba(0, 113, 227, 0.05)",
              },
              transition: "all 0.2s ease",
            }}
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
            sx={{
              background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
              color: "#ffffff",
              borderRadius: 28,
              px: 3,
              boxShadow: "0 4px 12px rgba(0, 113, 227, 0.2)",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                boxShadow: "0 6px 16px rgba(0, 113, 227, 0.3)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
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
          <CircularProgress sx={{ color: "#0071e3" }} />
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
        onOk={handleOk}
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
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            overflow: "hidden",
            maxWidth: 400,
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            background:
              "linear-gradient(145deg, rgba(255, 59, 48, 0.05) 0%, rgba(255, 59, 48, 0.1) 100%)",
            color: "#1d1d1f",
            fontWeight: 600,
            fontFamily: '"SF Pro Display", Roboto, sans-serif',
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            fontSize: "1.1rem",
          }}
        >
          Xác nhận xóa người dùng
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" sx={{ color: "#1d1d1f" }}>
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>{userToDelete?.name}</strong> không?
          </Typography>
          <Typography variant="body2" sx={{ color: "#ff3b30", mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ p: 3, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}
        >
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={{
              borderColor: "#86868b",
              color: "#86868b",
              borderRadius: 28,
              px: 3,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#1d1d1f",
                color: "#1d1d1f",
                background: "rgba(0, 0, 0, 0.05)",
              },
            }}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{
              background: "linear-gradient(145deg, #ff3b30 0%, #ff9500 100%)",
              color: "#ffffff",
              borderRadius: 28,
              px: 3,
              boxShadow: "0 4px 12px rgba(255, 59, 48, 0.2)",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                background: "linear-gradient(145deg, #ff3b30 0%, #ff9500 100%)",
                boxShadow: "0 6px 16px rgba(255, 59, 48, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
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

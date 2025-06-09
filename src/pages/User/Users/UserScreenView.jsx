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
import { useAppleStyles } from "../../../theme/theme-hooks";

const UserScreenView = ({ setSnackbar }) => {
  const styles = useAppleStyles();
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: styles.spacing(3) }}>
        <Typography
          variant="h6"
          sx={{ color: styles.colors?.neutral?.[800] || '#333', ...styles.components?.text?.heading }}
        >
          Danh sách người dùng
        </Typography>
        <Box sx={{ display: 'flex', gap: styles.spacing(2) }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={fetchUsers}
            sx={styles.button('outline')}
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
            sx={styles.button('primary')}
          >
            Thêm người dùng
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: styles.spacing(3) }}>
        <UserSearch
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onEnter={handleEnter}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: styles.spacing(4) }}>
          <CircularProgress sx={{ color: styles.colors?.primary?.main || '#0071e3' }} />
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
        PaperProps={{ sx: styles.modal?.paper }}
      >
        <DialogTitle sx={{ ...styles.modal?.title, color: styles.colors?.error?.main || '#ff2d55' }}>
          Xác nhận xóa người dùng
        </DialogTitle>
        <DialogContent sx={styles.modal?.content}>
          <Typography
            variant="body1"
            sx={{ color: styles.colors?.neutral?.[800] || '#333', ...styles.components?.text?.body1 }}
          >
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>{userToDelete?.name}</strong> không?
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: styles.colors?.error?.main || '#ff2d55', ...styles.components?.text?.body2, mt: 1 }}
          >
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={styles.modal?.actions}>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={styles.button('outline')}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{ ...styles.button('primary'), backgroundColor: styles.colors?.error?.main || '#ff2d55' }}
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
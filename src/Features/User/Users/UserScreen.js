import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { userAPI } from "../../../services/apis/User.js"; // Giữ để lấy danh sách và tìm kiếm
import { adminAPI } from "../../../services/apis/Admin.js"; // API mới
import minioClient from "../../../Server/minioClient.js";
import UserTable from "./UserTable.js";
import UserFormModal from "./UserFormModal.js";
import UserSearch from "./UserSearch";
import debounce from "lodash.debounce";

const UserScreen = ({ setSnackbar }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [form, setForm] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [avatar, setAvatar] = useState([]);
  const searchCache = useMemo(() => ({}), []); // Cache kết quả tìm kiếm

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUser();
      const data = Array.isArray(response) ? response : [];
      console.log("Fetched users:", data);
      setUsers(data);
      setFilteredUsers(data);
      searchCache[""] = data; // Lưu vào cache cho query rỗng
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi tải danh sách người dùng: " + error.message,
        severity: "error",
      });
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    setLoading(true);
    try {
      // Kiểm tra cache trước
      if (searchCache[query]) {
        console.log("Using cached result for query:", query);
        setFilteredUsers(searchCache[query]);
        setLoading(false);
        return;
      }

      let data;
      if (!query.trim()) {
        const response = await userAPI.getAllUser();
        data = Array.isArray(response) ? response : [];
        console.log("Fetched all users (empty query):", data);
      } else {
        const response = await userAPI.searchUsers(query);
        data = Array.isArray(response) ? response : [];
        console.log("Searched users:", data);
      }
      setFilteredUsers(data);
      searchCache[query] = data; // Lưu vào cache
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi tìm kiếm người dùng: " + error.message,
        severity: "error",
      });
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchTerm(query);
      searchUsers(query);
    }, 800),
    []
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleEnter = (value) => {
    if (!value.trim()) {
      fetchUsers();
    }
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    setForm({
      name: record.name,
      email: record.email,
      username: record.username,
      phone: record.phone,
      address: record.address,
      role: record.role,
      password: "",
    });
    setAvatar(record.avatar ? [{ url: record.avatar, uid: "1" }] : []);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    setUserToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await adminAPI.deleteUser({ id: userToDelete._id });
      const updatedUsers = users.filter(
        (user) => user._id !== userToDelete._id
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setSnackbar({
        open: true,
        message: "Xóa người dùng thành công",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Xóa người dùng không thành công: " + error.message,
        severity: "error",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleToggleActive = async (record) => {
    try {
      const apiCall = record.isActive
        ? adminAPI.deactivateUser
        : adminAPI.activateUser;
      await apiCall({ id: record._id });
      const updatedUsers = users.map((user) =>
        user._id === record._id ? { ...user, isActive: !user.isActive } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setSnackbar({
        open: true,
        message: `${
          record.isActive ? "Khóa" : "Mở khóa"
        } người dùng thành công`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `${
          record.isActive ? "Khóa" : "Mở khóa"
        } người dùng không thành công: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setAvatar(fileList);
  };

  const handleModalOk = async () => {
    const errors = {};
    if (!form.name) errors.name = true;
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = true;
    if (!form.username) errors.username = true;
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) errors.phone = true;
    if (!form.role) errors.role = true;
    if (form.password && form.password.length < 8) errors.password = true;

    setFormTouched(errors);

    if (Object.keys(errors).length > 0) {
      setSnackbar({
        open: true,
        message: "Vui lòng kiểm tra lại các trường thông tin!",
        severity: "error",
      });
      return;
    }

    try {
      let imageUrl = editingUser?.avatar || "";

      if (avatar?.length > 0 && avatar?.[0]?.originFileObj) {
        const timestamp = Date.now();
        const file = avatar[0].originFileObj;
        const fileName = `images/${timestamp}_${file.name}`;

        const minioStorage = minioClient.storage.from("test01");
        const { error } = await minioStorage.upload(fileName, file);

        if (error) {
          throw new Error(`Không thể upload file: ${error.message}`);
        }

        const { data: publicUrlData } = minioStorage.getPublicUrl(fileName);
        if (!publicUrlData.publicUrl) {
          throw new Error("Không thể lấy URL công khai cho ảnh.");
        }

        imageUrl = publicUrlData.publicUrl;
      }

      const userData = {
        id: editingUser._id,
        email: form.email,
        username: form.username,
        name: form.name,
        phone: form.phone,
        role: form.role,
        address: form.address,
        avatar: imageUrl,
        ...(form.password && { password: form.password }),
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
      setForm({});
      setFormTouched({});
      setAvatar([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi cập nhật người dùng";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          Danh sách người dùng
        </h2>
        <UserSearch
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onEnter={handleEnter}
        />
      </div>
      <UserTable
        users={filteredUsers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />
      <UserFormModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setForm({});
          setFormTouched({});
          setAvatar(
            editingUser?.avatar ? [{ url: editingUser.avatar, uid: "1" }] : []
          );
        }}
        form={{
          ...form,
          setFieldsValue: (values) => setForm({ ...form, ...values }),
          touched: formTouched,
        }}
        editingUser={editingUser}
        avatar={avatar}
        onUploadChange={handleUploadChange}
      />
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontSize: "1rem" }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "0.85rem" }}>
            Bạn có chắc muốn xóa người dùng {userToDelete?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={{ fontSize: "0.85rem" }}
          >
            Hủy
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ fontSize: "0.85rem" }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserScreen;

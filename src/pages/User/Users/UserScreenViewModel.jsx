import { useEffect, useState, useCallback, useMemo } from "react";
import { userAPI } from "../../../services/apis/User";
import { adminAPI } from "../../../services/apis/Admin";
import minioClient from "../../../Server/minioClient";
import debounce from "lodash.debounce";

const UserScreenViewModel = ({ setSnackbar }) => {
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
  const searchCache = useMemo(() => ({}), []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUser();
      const data = Array.isArray(response) ? response : [];
      console.log("Fetched users:", data);
      setUsers(data);
      setFilteredUsers(data);
      searchCache[""] = data;
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
  }, [setSnackbar, searchCache]);

  const searchUsers = useCallback(
    async (query) => {
      setLoading(true);
      try {
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
        searchCache[query] = data;
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
    },
    [setSnackbar, searchCache]
  );

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchTerm(query);
      searchUsers(query);
    }, 800),
    [searchUsers, setSearchTerm]
  );

  const handleSearch = useCallback(
    (value) => {
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleEnter = useCallback(
    (value) => {
      if (!value.trim()) {
        fetchUsers();
      }
    },
    [fetchUsers]
  );

  const handleEdit = useCallback((record) => {
    setEditingUser(record);
    setIsModalVisible(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingUser(null); // Đặt editingUser là null để biểu thị thêm người dùng mới
    setIsModalVisible(true);
  }, []);

  const handleDelete = useCallback((record) => {
    setUserToDelete(record);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
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
  }, [userToDelete, users, setSnackbar]);

  const handleToggleActive = useCallback(
    async (record) => {
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
    },
    [users, setSnackbar]
  );

  const handleUploadChange = useCallback(({ fileList }) => {
    setAvatar(fileList);
  }, []);

  const handleModalOk = useCallback(async () => {
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
        id: editingUser?._id,
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
      } else {
        const response = await adminAPI.createUser(userData);
        setUsers([...users, response.data]);
        setFilteredUsers([...filteredUsers, response.data]);
        setSnackbar({
          open: true,
          message: "Thêm người dùng thành công",
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
        "Có lỗi xảy ra khi lưu người dùng";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  }, [editingUser, avatar, form, users, filteredUsers, setSnackbar]);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    setForm({});
    setFormTouched({});
    setAvatar([]);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    setUsers,
    filteredUsers,
    setFilteredUsers,
    isModalVisible,
    setIsModalVisible,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    form,
    formTouched,
    editingUser,
    setEditingUser,
    loading,
    searchTerm,
    avatar,
    handleSearch,
    handleEnter,
    handleEdit,
    handleAdd,
    handleDelete,
    confirmDelete,
    handleToggleActive,
    handleUploadChange,
    handleModalOk,
    handleModalCancel,
    setForm,
  };
};

export default UserScreenViewModel;

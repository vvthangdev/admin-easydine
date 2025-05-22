import { useEffect, useState, useCallback } from "react";
import { userAPI } from "../../../services/apis/User";
import debounce from "lodash.debounce";

const UserSelectModalViewModel = ({
  visible,
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
}) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const response = query.trim()
        ? await userAPI.searchUsers(query.trim())
        : await userAPI.getAllUser();
      const data = Array.isArray(response) ? response : [];
      console.log(`Fetched users for query "${query}":`, data);
      setFilteredUsers(data);
      if (data.length === 0 && query) {
        setSnackbar({
          open: true,
          message: "Không tìm thấy người dùng",
          severity: "info",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setSnackbar({
        open: true,
        message: `Lỗi khi tải danh sách người dùng: ${error.message}`,
        severity: "error",
      });
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, [setSnackbar]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      console.log("Debounced search query:", query);
      fetchUsers(query);
    }, 300),
    [fetchUsers]
  );

  const handleSearch = useCallback((value) => {
    console.log("Input value:", value);
    setInputValue(value);
    setSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleEnterSearch = useCallback((value) => {
    console.log("Enter search query:", value);
    setSearchTerm(value);
    fetchUsers(value);
  }, [fetchUsers]);

  const handleSelectUser = useCallback((userId) => {
    const updatedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];
    setSelectedUsers(updatedUsers);
    console.log("Selected user IDs:", updatedUsers);
  }, [selectedUsers, setSelectedUsers]);

  useEffect(() => {
    if (visible) {
      fetchUsers();
      setInputValue("");
      setSearchTerm("");
    }
  }, [visible, fetchUsers]);

  return {
    filteredUsers,
    loading,
    inputValue,
    searchTerm,
    handleSearch,
    handleEnterSearch,
    handleSelectUser,
  };
};

export default UserSelectModalViewModel;
import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from "@mui/material";
import { userAPI } from "../../../services/apis/User";
import UserSearch from "../Users/UserSearch";
import placeholderImage from "../../../assets/images/user_place_holder.jpg";
import debounce from "lodash.debounce";

const UserSelectModal = ({
  visible,
  onOk,
  onCancel,
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
}) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");

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

  useEffect(() => {
    if (visible) {
      fetchUsers();
      setInputValue("");
      setSearchTerm("");
    }
  }, [visible, fetchUsers]);

  const handleSelectUser = useCallback((userId) => {
    const updatedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];
    setSelectedUsers(updatedUsers);
    console.log("Selected user IDs:", updatedUsers);
  }, [selectedUsers, setSelectedUsers]);

  const columns = [
    { id: "select", label: "", width: "5%" },
    { id: "avatar", label: "Ảnh", width: "10%" },
    { id: "name", label: "Tên", width: "35%" },
    { id: "username", label: "Tên người dùng", width: "50%" },
  ];

  return (
    <Dialog open={visible} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: "1rem" }}>Chọn người dùng</DialogTitle>
      <DialogContent sx={{ paddingTop: "8px !important" }}>
        <UserSearch searchTerm={inputValue} onSearch={handleSearch} onEnter={handleEnterSearch} />
        <TableContainer component={Paper} sx={{ mt: 1, maxHeight: 400 }}>
          <Table stickyHeader sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{ width: column.width, fontSize: "0.75rem", p: 1 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell sx={{ fontSize: "0.75rem", p: 1 }}>
                      <Checkbox
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", p: 1 }}>
                      <img
                        src={user.avatar || placeholderImage}
                        alt={user.name}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        onError={(e) => (e.target.src = placeholderImage)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", p: 1 }}>
                      {user.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", p: 1 }}>
                      {user.username}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", fontSize: "0.75rem", p: 1 }}>
                    {loading ? "Đang tải..." : "Không có dữ liệu"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} sx={{ fontSize: "0.85rem" }}>
          Hủy
        </Button>
        <Button onClick={onOk} variant="contained" sx={{ fontSize: "0.85rem" }}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSelectModal;
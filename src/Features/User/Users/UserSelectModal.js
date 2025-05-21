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
import UserSearch from "./UserSearch";
import placeholderImage from "../../assets/images/user_place_holder.jpg";
import debounce from "lodash.debounce";

const UserSelectModal = ({
  visible,
  onOk,
  onCancel,
  selectedUsers,
  setSelectedUsers,
  setSnackbar,
}) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUser();
      const data = Array.isArray(response) ? response : [];
      console.log("Fetched users for selection:", data);
      setUsers(data);
      setFilteredUsers(data);
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
      if (!query.trim()) {
        const response = await userAPI.getAllUser();
        const data = Array.isArray(response) ? response : [];
        console.log("Fetched all users (empty query):", data);
        setFilteredUsers(data);
      } else {
        const response = await userAPI.searchUsers(query);
        const data = Array.isArray(response) ? response : [];
        console.log("Searched users:", data);
        setFilteredUsers(data);
      }
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
    }, 500),
    []
  );

  useEffect(() => {
    if (visible) {
      fetchUsers();
    }
  }, [visible]);

  const handleSelectUser = (user) => {
    const isSelected = selectedUsers.some((u) => u._id === user._id);
    let updatedUsers;
    if (isSelected) {
      updatedUsers = selectedUsers.filter((u) => u._id !== user._id);
    } else {
      updatedUsers = [...selectedUsers, user];
    }
    setSelectedUsers(updatedUsers);
  };

  const columns = [
    { id: "select", label: "", width: "5%" },
    { id: "avatar", label: "Ảnh", width: "10%" },
    { id: "name", label: "Tên", width: "20%" },
    { id: "username", label: "Username", width: "20%", hideOnSmall: true },
    { id: "email", label: "Email", width: "25%", hideOnSmall: true },
    { id: "phone", label: "Số điện thoại", width: "20%", hideOnSmall: true },
  ];

  return (
    <Dialog open={visible} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: "1rem" }}>Chọn người dùng</DialogTitle>
      <DialogContent sx={{ paddingTop: "8px !important" }}>
        <UserSearch searchTerm={searchTerm} onSearch={debouncedSearch} />
        <TableContainer
          component={Paper}
          sx={{ marginTop: "8px", overflowX: "auto" }}
        >
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      width: column.width,
                      fontSize: "0.75rem",
                      padding: "6px",
                      display: {
                        xs: column.hideOnSmall ? "none" : "table-cell",
                        sm: column.hideOnSmall ? "none" : "table-cell",
                      },
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                      <Checkbox
                        checked={selectedUsers.some((u) => u._id === user._id)}
                        onChange={() => handleSelectUser(user)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                      <img
                        src={user.avatar || ""}
                        alt="Avatar"
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = placeholderImage;
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                      {user.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.75rem",
                        padding: "6px",
                        display: { xs: "none", sm: "table-cell" },
                      }}
                    >
                      {user.username}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.75rem",
                        padding: "6px",
                        display: { xs: "none", sm: "table-cell" },
                      }}
                    >
                      {user.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.75rem",
                        padding: "6px",
                        display: { xs: "none", sm: "table-cell" },
                      }}
                    >
                      {user.phone}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    sx={{
                      textAlign: "center",
                      fontSize: "0.75rem",
                      padding: "6px",
                    }}
                  >
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

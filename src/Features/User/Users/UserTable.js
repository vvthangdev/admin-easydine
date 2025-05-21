import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import placeholderImage from "../../../assets/images/user_place_holder.jpg";

const UserTable = ({ users, loading, onEdit, onDelete, onToggleActive }) => {
  const columns = [
    { id: "avatar", label: "Ảnh", width: "5%" },
    { id: "name", label: "Tên", width: "10%" },
    { id: "username", label: "Username", width: "15%" },
    { id: "email", label: "Email", width: "20%" },
    { id: "phone", label: "Số điện thoại", width: "10%" },
    { id: "address", label: "Địa chỉ", width: "10%" },
    { id: "role", label: "Vai trò", width: "10%" },
    { id: "action", label: "Thao tác", width: "20%" },
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ tableLayout: "auto", width: "100%" }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  width: column.width,
                  fontSize: "0.75rem",
                  padding: "6px",
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                  <img
                    src={user.avatar || ""}
                    alt="Avatar"
                    style={{
                      width: "24px", // Giữ 24px, có thể tăng lên 28px nếu cần
                      height: "24px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>{user.name}</TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>{user.username}</TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>{user.email}</TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>{user.phone}</TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>{user.address}</TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>{user.role}</TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onEdit(user)}
                      sx={{ minWidth: "auto", padding: "2px 8px", fontSize: "0.75rem" }}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => onDelete(user)}
                      sx={{ minWidth: "auto", padding: "2px 8px", fontSize: "0.75rem" }}
                    >
                      Xóa
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color={user.isActive ? "warning" : "success"}
                      onClick={() => onToggleActive(user)}
                      sx={{ minWidth: "auto", padding: "2px 8px", fontSize: "0.75rem" }}
                    >
                      {user.isActive ? "Khóa" : "Mở khóa"}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ textAlign: "center", fontSize: "0.75rem", padding: "6px" }}>
                {loading ? "Đang tải..." : "Không có dữ liệu"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
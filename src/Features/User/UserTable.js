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
import placeholderImage from "../../assets/images/user_place_holder.jpg";

const UserTable = ({ users, loading, onEdit, onDelete, onSelectUser }) => {
  const columns = [
    { id: "avatar", label: "Ảnh" },
    { id: "name", label: "Tên" },
    { id: "username", label: "Username", hideOnSmall: true },
    { id: "email", label: "Email", hideOnSmall: true },
    { id: "phone", label: "Số điện thoại", hideOnSmall: true },
    { id: "address", label: "Địa chỉ", hideOnLarge: true },
    { id: "role", label: "Vai trò" },
    { id: "action", label: "Thao tác" },
  ];

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  fontSize: "0.75rem",
                  padding: "4px",
                  whiteSpace: "nowrap", // Ngăn text wrap để cột gọn
                  display: {
                    xs: column.hideOnSmall ? "none" : "table-cell",
                    sm: column.hideOnSmall ? "none" : "table-cell",
                    lg: column.hideOnLarge ? "none" : "table-cell",
                  },
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
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  <img
                    src={user.avatar || ""}
                    alt="Avatar"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px", whiteSpace: "nowrap" }}>
                  {user.name}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px", display: { xs: "none", sm: "table-cell" }, whiteSpace: "nowrap" }}>
                  {user.username}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px", display: { xs: "none", sm: "table-cell" }, whiteSpace: "nowrap" }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px", display: { xs: "none", sm: "table-cell" }, whiteSpace: "nowrap" }}>
                  {user.phone}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px", display: { xs: "none", lg: "table-cell" }, whiteSpace: "nowrap" }}>
                  {user.address}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px", whiteSpace: "nowrap" }}>
                  {user.role}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => onEdit(user)}
                      sx={{ minWidth: "auto", padding: "2px 8px", fontSize: "0.75rem" }}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(user)}
                      sx={{ minWidth: "auto", padding: "2px 8px", fontSize: "0.75rem" }}
                    >
                      Xóa
                    </Button>
                    <Button
                      size="small"
                      onClick={() => onSelectUser(user)}
                      sx={{ minWidth: "auto", padding: "2px 8px", fontSize: "0.75rem" }}
                    >
                      Chọn
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ textAlign: "center", fontSize: "0.75rem", padding: "4px" }}>
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
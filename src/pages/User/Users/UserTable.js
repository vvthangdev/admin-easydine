"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { Edit, Trash2, Lock, Unlock } from "lucide-react";
import placeholderImage from "../../../assets/images/user_place_holder.jpg";
import { tableStyles, avatarStyles, chipStyles, buttonStyles, colors, boxStyles } from "../../../styles";

const UserTable = ({ users, loading, onEdit, onDelete, onToggleActive }) => {
  // State phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { id: "avatar", label: "Ảnh", width: "5%" },
    { id: "name", label: "Tên", width: "15%" },
    { id: "username", label: "Username", width: "15%", hideOnMobile: true },
    { id: "email", label: "Email", width: "20%", hideOnMobile: true },
    { id: "phone", label: "Số điện thoại", width: "15%", hideOnMobile: true },
    { id: "address", label: "Địa chỉ", width: "15%", hideOnLarge: true },
    { id: "role", label: "Vai trò", width: "10%" },
    { id: "action", label: "Thao tác", width: "15%" },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return { bg: "rgba(0, 113, 227, 0.1)", color: colors.primary.main };
      case "STAFF":
        return { bg: "rgba(52, 199, 89, 0.1)", color: colors.success.main };
      case "CUSTOMER":
        return { bg: "rgba(255, 149, 0, 0.1)", color: colors.warning.main };
      default:
        return { bg: "rgba(142, 142, 147, 0.1)", color: colors.neutral[500] };
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "STAFF":
        return "Nhân viên";
      case "CUSTOMER":
        return "Khách hàng";
      default:
        return role;
    }
  };

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Lấy dữ liệu người dùng cho trang hiện tại
  const paginatedUsers = Array.isArray(users)
    ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  return (
    <>
      <TableContainer component={Paper} sx={{
    ...tableStyles.container,
    maxHeight: 440,
    overflowY: "auto",
  }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={tableStyles.head}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    ...tableStyles.cell,
                    width: column.width,
                    fontWeight: 600,
                    display: column.hideOnMobile
                      ? { xs: "none", md: "table-cell" }
                      : column.hideOnLarge
                      ? { xs: "none", lg: "table-cell" }
                      : "table-cell",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user._id} sx={tableStyles.row}>
                  <TableCell sx={tableStyles.cell}>
                    <Avatar
                      src={user.avatar || ""}
                      alt={user.name}
                      sx={avatarStyles.table}
                      onError={(e) => {
                        e.target.src = placeholderImage;
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell, fontWeight: 500 }}>
                    {user.name}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell, display: { xs: "none", md: "table-cell" } }}>
                    {user.username}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell, display: { xs: "none", md: "table-cell" } }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell, display: { xs: "none", md: "table-cell" } }}>
                    {user.phone}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...tableStyles.cell,
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: { xs: "none", lg: "table-cell" },
                    }}
                  >
                    {user.address}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    <Chip
                      label={getRoleLabel(user.role)}
                      sx={{
                        ...chipStyles.voucherStatus,
                        backgroundColor: getRoleColor(user.role).bg,
                        color: getRoleColor(user.role).color,
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    <Box sx={{ ...boxStyles.buttonGroup, gap: 0.5 }}>
                      <Tooltip title="Sửa">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(user)}
                          sx={buttonStyles.iconButton}
                        >
                          <Edit size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(user)}
                          sx={buttonStyles.dangerIconButton}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.isActive ? "Khóa" : "Mở khóa"}>
                        <IconButton
                          size="small"
                          onClick={() => onToggleActive(user)}
                          sx={user.isActive ? buttonStyles.warningIconButton : buttonStyles.successIconButton}
                        >
                          {user.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={tableStyles.empty}>
                  {loading ? "Đang tải..." : "Không có dữ liệu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Số dòng mỗi trang"
      />
    </>
  );
};

export default UserTable;

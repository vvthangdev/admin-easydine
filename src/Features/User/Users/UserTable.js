"use client"

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
} from "@mui/material"
import { Edit, Trash2, Lock, Unlock } from "lucide-react"
import placeholderImage from "../../../assets/images/user_place_holder.jpg"

const UserTable = ({ users, loading, onEdit, onDelete, onToggleActive }) => {
  const columns = [
    { id: "avatar", label: "Ảnh", width: "5%" },
    { id: "name", label: "Tên", width: "15%" },
    { id: "username", label: "Username", width: "15%", hideOnMobile: true },
    { id: "email", label: "Email", width: "20%", hideOnMobile: true },
    { id: "phone", label: "Số điện thoại", width: "15%", hideOnMobile: true },
    { id: "address", label: "Địa chỉ", width: "15%", hideOnLarge: true },
    { id: "role", label: "Vai trò", width: "10%" },
    { id: "action", label: "Thao tác", width: "15%" },
  ]

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return { bg: "rgba(0, 113, 227, 0.1)", color: "#0071e3" }
      case "STAFF":
        return { bg: "rgba(52, 199, 89, 0.1)", color: "#34c759" }
      case "CUSTOMER":
        return { bg: "rgba(255, 149, 0, 0.1)", color: "#ff9500" }
      default:
        return { bg: "rgba(142, 142, 147, 0.1)", color: "#8e8e93" }
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên"
      case "STAFF":
        return "Nhân viên"
      case "CUSTOMER":
        return "Khách hàng"
      default:
        return role
    }
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(0, 113, 227, 0.05)" }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  width: column.width,
                  fontWeight: 600,
                  color: "#1d1d1f",
                  py: 1.5,
                  fontSize: "0.75rem",
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
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <TableRow
                key={user._id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0, 113, 227, 0.05)" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell sx={{ py: 1 }}>
                  <Avatar
                    src={user.avatar || ""}
                    alt={user.name}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: 1.5,
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                    onError={(e) => {
                      e.target.src = placeholderImage
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1, fontWeight: 500, color: "#1d1d1f" }}>
                  {user.name}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1, display: { xs: "none", md: "table-cell" } }}>
                  {user.username}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1, display: { xs: "none", md: "table-cell" } }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1, display: { xs: "none", md: "table-cell" } }}>
                  {user.phone}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.75rem",
                    py: 1,
                    maxWidth: 150,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: { xs: "none", lg: "table-cell" },
                  }}
                >
                  {user.address}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                  <Chip
                    label={getRoleLabel(user.role)}
                    sx={{
                      height: 24,
                      fontSize: "0.7rem",
                      backgroundColor: getRoleColor(user.role).bg,
                      color: getRoleColor(user.role).color,
                      fontWeight: 500,
                      borderRadius: 4,
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Sửa">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(user)}
                        sx={{
                          color: "#0071e3",
                          "&:hover": {
                            backgroundColor: "rgba(0, 113, 227, 0.1)",
                          },
                        }}
                      >
                        <Edit size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(user)}
                        sx={{
                          color: "#ff3b30",
                          "&:hover": {
                            backgroundColor: "rgba(255, 59, 48, 0.1)",
                          },
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.isActive ? "Khóa" : "Mở khóa"}>
                      <IconButton
                        size="small"
                        onClick={() => onToggleActive(user)}
                        sx={{
                          color: user.isActive ? "#ff9500" : "#34c759",
                          "&:hover": {
                            backgroundColor: user.isActive ? "rgba(255, 149, 0, 0.1)" : "rgba(52, 199, 89, 0.1)",
                          },
                        }}
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
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{
                  py: 4,
                  color: "#86868b",
                  fontSize: "0.875rem",
                }}
              >
                {loading ? "Đang tải..." : "Không có dữ liệu"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserTable

"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Edit, Trash2, Percent, Calendar, Tag, DollarSign } from "lucide-react"

const VoucherTable = ({ vouchers, loading, onEdit, onDelete }) => {
  const columns = [
    { id: "code", label: "Mã", width: "15%" },
    { id: "discount", label: "Giảm giá", width: "15%" },
    { id: "discountType", label: "Loại", width: "10%", hideOnMobile: true },
    { id: "minOrderValue", label: "Đơn tối thiểu", width: "15%", hideOnMobile: true },
    { id: "dates", label: "Thời gian", width: "25%" },
    { id: "status", label: "Trạng thái", width: "10%" },
    { id: "action", label: "Thao tác", width: "10%" },
  ]

  const getStatusColor = (voucher) => {
    const now = new Date()
    const startDate = voucher.startDate ? new Date(voucher.startDate) : null
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null

    if (!voucher.isActive) {
      return { bg: "rgba(142, 142, 147, 0.1)", color: "#8e8e93" }
    }

    if (startDate && now < startDate) {
      return { bg: "rgba(255, 149, 0, 0.1)", color: "#ff9500" }
    }

    if (endDate && now > endDate) {
      return { bg: "rgba(255, 59, 48, 0.1)", color: "#ff3b30" }
    }

    return { bg: "rgba(52, 199, 89, 0.1)", color: "#34c759" }
  }

  const getStatusLabel = (voucher) => {
    const now = new Date()
    const startDate = voucher.startDate ? new Date(voucher.startDate) : null
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null

    if (!voucher.isActive) {
      return "Không kích hoạt"
    }

    if (startDate && now < startDate) {
      return "Chưa bắt đầu"
    }

    if (endDate && now > endDate) {
      return "Hết hạn"
    }

    return "Đang hoạt động"
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
                  display: column.hideOnMobile ? { xs: "none", md: "table-cell" } : "table-cell",
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(vouchers) && vouchers.length > 0 ? (
            vouchers.map((voucher) => (
              <TableRow
                key={voucher._id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0, 113, 227, 0.05)" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell sx={{ fontSize: "0.75rem", py: 1, fontWeight: 500, color: "#1d1d1f" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tag size={14} color="#0071e3" />
                    {voucher.code}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {voucher.discountType === "percentage" ? (
                      <Percent size={14} color="#0071e3" />
                    ) : (
                      <DollarSign size={14} color="#0071e3" />
                    )}
                    <span>
                      {voucher.discount}
                      {voucher.discountType === "percentage" ? "%" : " VNĐ"}
                    </span>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1, display: { xs: "none", md: "table-cell" } }}>
                  {voucher.discountType === "percentage" ? "Phần trăm" : "Cố định"}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1, display: { xs: "none", md: "table-cell" } }}>
                  {voucher.minOrderValue.toLocaleString()} VNĐ
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Calendar size={14} color="#0071e3" />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <span>{new Date(voucher.startDate).toLocaleDateString("vi-VN")}</span>
                      <span style={{ color: "#86868b" }}>
                        → {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", py: 1 }}>
                  <Chip
                    label={getStatusLabel(voucher)}
                    sx={{
                      height: 24,
                      fontSize: "0.7rem",
                      backgroundColor: getStatusColor(voucher).bg,
                      color: getStatusColor(voucher).color,
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
                        onClick={() => onEdit(voucher)}
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
                        onClick={() => onDelete(voucher)}
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

export default VoucherTable

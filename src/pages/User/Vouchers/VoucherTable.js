"use client";

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
} from "@mui/material";
import { Edit, Trash2, Percent, Calendar, Tag, DollarSign } from "lucide-react";
import { tableStyles, chipStyles, buttonStyles, colors, boxStyles } from "../../../styles"; // Import styles từ index.js

const VoucherTable = ({ vouchers, loading, onEdit, onDelete }) => {
  const columns = [
    { id: "code", label: "Mã", width: "15%" },
    { id: "discount", label: "Giảm giá", width: "15%" },
    { id: "discountType", label: "Loại", width: "10%", hideOnMobile: true },
    { id: "minOrderValue", label: "Đơn tối thiểu", width: "15%", hideOnMobile: true },
    { id: "dates", label: "Thời gian", width: "25%" },
    { id: "status", label: "Trạng thái", width: "10%" },
    { id: "action", label: "Thao tác", width: "10%" },
  ];

  const getStatusColor = (voucher) => {
    const now = new Date();
    const startDate = voucher.startDate ? new Date(voucher.startDate) : null;
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null;

    if (!voucher.isActive) {
      return { bg: "rgba(142, 142, 147, 0.1)", color: colors.neutral[500] };
    }
    if (startDate && now < startDate) {
      return { bg: "rgba(255, 149, 0, 0.1)", color: colors.warning.main };
    }
    if (endDate && now > endDate) {
      return { bg: "rgba(255, 59, 48, 0.1)", color: colors.error.main };
    }
    return { bg: "rgba(52, 199, 89, 0.1)", color: colors.success.main };
  };

  const getStatusLabel = (voucher) => {
    const now = new Date();
    const startDate = voucher.startDate ? new Date(voucher.startDate) : null;
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null;

    if (!voucher.isActive) {
      return "Không kích hoạt";
    }
    if (startDate && now < startDate) {
      return "Chưa bắt đầu";
    }
    if (endDate && now > endDate) {
      return "Hết hạn";
    }
    return "Đang hoạt động";
  };

  return (
    <TableContainer component={Paper} sx={tableStyles.container}> {/* Sử dụng tableStyles.container */}
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead sx={tableStyles.head}> {/* Sử dụng tableStyles.head */}
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  ...tableStyles.cell, // Sử dụng tableStyles.cell
                  width: column.width,
                  fontWeight: 600, // Giữ fontWeight cho header
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
              <TableRow key={voucher._id} sx={tableStyles.row}> {/* Sử dụng tableStyles.row */}
                <TableCell sx={{ ...tableStyles.cell, fontWeight: 500 }}>
                  <Box sx={{ ...boxStyles.buttonGroup, gap: 1 }}> {/* Sử dụng boxStyles.buttonGroup */}
                    <Tag size={14} color={colors.primary.main} />
                    {voucher.code}
                  </Box>
                </TableCell>
                <TableCell sx={tableStyles.cell}>
                  <Box sx={{ ...boxStyles.buttonGroup, gap: 1 }}> {/* Sử dụng boxStyles.buttonGroup */}
                    {voucher.discountType === "percentage" ? (
                      <Percent size={14} color={colors.primary.main} />
                    ) : (
                      <DollarSign size={14} color={colors.primary.main} />
                    )}
                    <span>
                      {voucher.discount}
                      {voucher.discountType === "percentage" ? "%" : " VNĐ"}
                    </span>
                  </Box>
                </TableCell>
                <TableCell sx={{ ...tableStyles.cell, display: { xs: "none", md: "table-cell" } }}>
                  {voucher.discountType === "percentage" ? "Phần trăm" : "Cố định"}
                </TableCell>
                <TableCell sx={{ ...tableStyles.cell, display: { xs: "none", md: "table-cell" } }}>
                  {voucher.minOrderValue.toLocaleString()} VNĐ
                </TableCell>
                <TableCell sx={tableStyles.cell}>
                  <Box sx={{ ...boxStyles.buttonGroup, gap: 1, flexDirection: "column" }}>
                    <Calendar size={14} color={colors.primary.main} />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <span>{new Date(voucher.startDate).toLocaleDateString("vi-VN")}</span>
                      <span style={{ color: colors.neutral[400] }}>
                        → {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={tableStyles.cell}>
                  <Chip
                    label={getStatusLabel(voucher)}
                    sx={{
                      ...chipStyles.voucherStatus, // Sử dụng chipStyles.voucherStatus
                      backgroundColor: getStatusColor(voucher).bg,
                      color: getStatusColor(voucher).color,
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={tableStyles.cell}>
                  <Box sx={{ ...boxStyles.buttonGroup, gap: 0.5 }}> {/* Sử dụng boxStyles.buttonGroup */}
                    <Tooltip title="Sửa">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(voucher)}
                        sx={buttonStyles.iconButton} // Sử dụng buttonStyles.iconButton
                      >
                        <Edit size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(voucher)}
                        sx={buttonStyles.dangerIconButton} // Sử dụng buttonStyles.dangerIconButton
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
              <TableCell colSpan={columns.length} align="center" sx={tableStyles.empty}> {/* Sử dụng tableStyles.empty */}
                {loading ? "Đang tải..." : "Không có dữ liệu"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VoucherTable;
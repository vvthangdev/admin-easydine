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

const VoucherTable = ({ vouchers, loading, onEdit, onDelete }) => {
  const columns = [
    { id: "code", label: "Mã" },
    { id: "discount", label: "Giảm giá" },
    { id: "discountType", label: "Loại" },
    { id: "minOrderValue", label: "Đơn tối thiểu" },
    { id: "startDate", label: "Bắt đầu" },
    { id: "endDate", label: "Kết thúc" },
    { id: "isActive", label: "Kích hoạt" },
    { id: "usageLimit", label: "Giới hạn" },
    { id: "usedCount", label: "Đã dùng" },
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
                sx={{ fontSize: "0.75rem", padding: "4px", whiteSpace: "nowrap" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(vouchers) && vouchers.length > 0 ? (
            vouchers.map((voucher) => (
              <TableRow key={voucher._id}>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  {voucher.code}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  {voucher.discount}{voucher.discountType === "percentage" ? "%" : " VNĐ"}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  {voucher.discountType === "percentage" ? "Phần trăm" : "Cố định"}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  {voucher.minOrderValue} VNĐ
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  {new Date(voucher.startDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  {voucher.isActive ? "Có" : "Không"}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  {voucher.usageLimit || "Không giới hạn"}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  {voucher.usedCount}
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem", padding: "4px" }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => onEdit(voucher)}
                      sx={{ minWidth: "auto", padding: "2px 8px", fontSize: "0.75rem" }}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(voucher)}
                      sx={{ minWidth: "auto", padding: "2px 8px", fontSize: "0.75rem" }}
                    >
                      Xóa
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ textAlign: "center", fontSize: "0.75rem", padding: "4px" }}
              >
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
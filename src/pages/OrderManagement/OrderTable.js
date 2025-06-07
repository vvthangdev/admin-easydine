"use client";

import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Edit, Trash2, User, Calendar, Eye } from "lucide-react";
import moment from "moment";

const OrderTable = ({
  orders,
  loading,
  onStatusChange,
  onViewCustomerDetails,
  onViewDetails,
  onEdit,
  onDelete,
  handleCopyOrderId,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fff3e0", color: "#ff9800" };
      case "confirmed":
        return { bg: "#e0f2f1", color: "#009688" };
      case "completed":
        return { bg: "#e8f5e9", color: "#4caf50" };
      case "canceled":
        return { bg: "#ffebee", color: "#f44336" };
      default:
        return { bg: "#f5f5f5", color: "#9e9e9e" };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Hoàn thành";
      case "canceled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getOrderTypeLabel = (type) => {
    switch (type) {
      case "reservation":
        return "Đặt bàn";
      case "takeaway":
        return "Giao hàng";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <CircularProgress sx={{ color: "#0071e3" }} />
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 4,
        background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                color: "#1d1d1f",
                backgroundColor: "rgba(0, 113, 227, 0.05)",
                py: 2,
              }}
            >
              Mã đơn hàng
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: "#1d1d1f",
                backgroundColor: "rgba(0, 113, 227, 0.05)",
                py: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <User size={16} />
                Khách hàng
              </Box>
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: "#1d1d1f",
                backgroundColor: "rgba(0, 113, 227, 0.05)",
                py: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Calendar size={16} />
                Ngày
              </Box>
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: "#1d1d1f",
                backgroundColor: "rgba(0, 113, 227, 0.05)",
                py: 2,
              }}
            >
              Trạng thái
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: "#1d1d1f",
                backgroundColor: "rgba(0, 113, 227, 0.05)",
                py: 2,
              }}
            >
              Loại đơn hàng
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: "#1d1d1f",
                backgroundColor: "rgba(0, 113, 227, 0.05)",
                py: 2,
              }}
            >
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((record) => (
              <TableRow
                key={record.id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0, 113, 227, 0.05)" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell
                  sx={{
                    color: "#1d1d1f",
                    fontWeight: 500,
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": {
                      color: "#0071e3",
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => handleCopyOrderId(record.id)}
                  title={`Sao chép mã: ${record.id}`}
                >
                  #{record.id.slice(-4)}
                </TableCell>

                <TableCell>
                  <Button
                    sx={{
                      textTransform: "none",
                      color: "#0071e3",
                      fontWeight: 500,
                      "&:hover": {
                        background: "rgba(0, 113, 227, 0.05)",
                      },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1,
                    }}
                    onClick={() => onViewCustomerDetails(record.customerId)}
                  >
                    <User size={16} />
                    {`${record.customerName} - ${record.customerPhone}`}
                  </Button>
                </TableCell>
                <TableCell sx={{ color: "#1d1d1f" }}>
                  {record.time
                    ? moment.utc(record.time).local().format("HH:mm, DD/MM/YY")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={record.status}
                      onChange={(e) =>
                        onStatusChange(record.id, e.target.value)
                      }
                      sx={{
                        height: 36,
                        borderRadius: 4,
                        backgroundColor: getStatusColor(record.status).bg,
                        color: getStatusColor(record.status).color,
                        fontWeight: 500,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "transparent",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: getStatusColor(record.status).color,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: getStatusColor(record.status).color,
                        },
                        "& .MuiSelect-select": {
                          py: 0.5,
                          px: 1.5,
                        },
                      }}
                      disabled={loading}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: 2,
                            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                          },
                        },
                      }}
                    >
                      <MenuItem
                        value="pending"
                        sx={{ color: getStatusColor("pending").color }}
                      >
                        {getStatusLabel("pending")}
                      </MenuItem>
                      <MenuItem
                        value="confirmed"
                        sx={{ color: getStatusColor("confirmed").color }}
                      >
                        {getStatusLabel("confirmed")}
                      </MenuItem>
                      <MenuItem
                        value="completed"
                        sx={{ color: getStatusColor("completed").color }}
                      >
                        {getStatusLabel("completed")}
                      </MenuItem>
                      <MenuItem
                        value="canceled"
                        sx={{ color: getStatusColor("canceled").color }}
                      >
                        {getStatusLabel("canceled")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getOrderTypeLabel(record.type)}
                    sx={{
                      bgcolor:
                        record.type === "reservation"
                          ? "rgba(0, 113, 227, 0.1)"
                          : "rgba(156, 39, 176, 0.1)",
                      color:
                        record.type === "reservation" ? "#0071e3" : "#9c27b0",
                      fontWeight: 500,
                      borderRadius: 4,
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Edit size={16} />}
                      onClick={() => onEdit(record)}
                      disabled={loading}
                      sx={{
                        background:
                          "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                        color: "#ffffff",
                        borderRadius: 28,
                        boxShadow: "0 4px 12px rgba(0, 113, 227, 0.2)",
                        textTransform: "none",
                        fontWeight: 500,
                        "&:hover": {
                          background:
                            "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                          boxShadow: "0 6px 16px rgba(0, 113, 227, 0.3)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Sửa
                    </Button>
                    {onViewDetails && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => onViewDetails(record.id)}
                        disabled={loading}
                        sx={{
                          borderColor: "#86868b",
                          color: "#86868b",
                          borderRadius: 28,
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": {
                            borderColor: "#1d1d1f",
                            color: "#1d1d1f",
                            background: "rgba(0, 0, 0, 0.05)",
                          },
                        }}
                      >
                        Chi tiết
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Trash2 size={16} />}
                      onClick={() => onDelete(record)}
                      disabled={loading}
                      sx={{
                        borderColor: "#ff3b30",
                        color: "#ff3b30",
                        borderRadius: 28,
                        textTransform: "none",
                        fontWeight: 500,
                        "&:hover": {
                          borderColor: "#ff3b30",
                          background: "rgba(255, 59, 48, 0.05)",
                        },
                      }}
                    >
                      Xóa
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                <Typography variant="body1" sx={{ color: "#86868b" }}>
                  Không có đơn hàng nào
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;

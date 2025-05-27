import React from "react";
import { Box, Paper, Typography, IconButton, Stack, Button } from "@mui/material";
import { Package, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderNotification({
  orderId,
  customerId,
  username,
  type,
  createdAt,
  message,
  onClose,
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        minWidth: { xs: 280, sm: 320 },
        maxWidth: 400,
        bgcolor: "#ffffff",
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
        border: "1px solid #e5e5e5",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.06)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Package size={20} color="#1c1c1e" />
          <Typography variant="subtitle1" fontWeight={600} color="#1c1c1e">
            Đơn Hàng Mới
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: "#6e6e73" }}>
          <X size={16} />
        </IconButton>
      </Stack>

      <Stack spacing={0.5} mb={2}>
        <Typography variant="body2" color="text.secondary">
          <strong>ID Đơn Hàng:</strong> {orderId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>ID Khách Hàng:</strong> {customerId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Tên Khách Hàng:</strong> {username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Loại:</strong> {type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Thời Gian:</strong>{" "}
          {new Date(createdAt).toLocaleString("vi-VN")}
        </Typography>
        {message && (
          <Typography variant="body2" color="text.secondary">
            <strong>Thông báo:</strong> {message}
          </Typography>
        )}
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          component={Link}
          to={`/orders/${orderId}`}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 20,
            textTransform: "none",
            fontWeight: 500,
            px: 2,
            borderColor: "#d1d1d6",
            color: "#1c1c1e",
            "&:hover": {
              bgcolor: "#f2f2f7",
              borderColor: "#bfbfc4",
            },
          }}
        >
          Xem Chi Tiết
        </Button>
      </Box>
    </Paper>
  );
}
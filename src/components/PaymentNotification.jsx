import React, { useState } from "react";
import { Box, Paper, Typography, IconButton, Stack, Button } from "@mui/material";
import { CreditCard, X } from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";

export default function PaymentNotification({
  id,
  type,
  title,
  data,
  onClose,
}) {
  const [openModal, setOpenModal] = useState(false);

  // Log dữ liệu props
  console.log("[PaymentNotification] Dữ liệu props nhận được:", {
    id,
    type,
    title,
    data,
  });

  // Format dữ liệu hiển thị
  const displayData = {
    title: title || "Thông báo thanh toán",
    table: data?.table
      ? `${data.table.tableNumber} (${data.table.area})`
      : "N/A",
    amount: data?.payment?.amount
      ? `${data.payment.amount.toLocaleString("vi-VN")} VND`
      : "N/A",
  };

  // Mở modal chi tiết
  const handleViewDetails = () => {
    setOpenModal(true);
  };

  // Đóng modal và notification
  const handleCloseAll = () => {
    setOpenModal(false);
    onClose();
  };

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          width: { xs: 280, sm: 320 },
          bgcolor: "#ffffff",
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
          border: "1px solid #e5e5e5",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.06)",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <CreditCard size={20} color="#1c1c1e" />
            <Typography variant="subtitle2" fontWeight={600} color="#1c1c1e">
              {displayData.title}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onClose} sx={{ color: "#6e6e73" }}>
            <X size={16} />
          </IconButton>
        </Stack>

        <Stack spacing={0.5} mb={1}>
          <Typography variant="body2" color="text.secondary">
            <strong>Bàn:</strong> {displayData.table}
          </Typography>
          <Typography variant="body2" color="#d32f2f" fontWeight={600}>
            <strong>Số tiền:</strong> {displayData.amount}
          </Typography>
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handleViewDetails}
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
            Xem chi tiết
          </Button>
        </Box>
      </Paper>

      <OrderDetailsModal
        open={openModal}
        onClose={handleCloseAll}
        notificationData={{ id, type, title, data }}
      />
    </>
  );
}
import React from "react";
import { Box, Paper, Typography, IconButton, Stack, Button } from "@mui/material";
import { CreditCard, X } from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";

export default function PaymentNotification({
  orderId,
  accountName,
  accountNumber,
  transactionTime,
  amount,
  onClose,
}) {
  // Log dữ liệu props
  console.log("[PaymentNotification] Dữ liệu props nhận được:", {
    orderId,
    accountName,
    accountNumber,
    transactionTime,
    amount,
  });

  const displayData = {
    orderId,
    accountName: accountName || "N/A",
    accountNumber: accountNumber || "N/A",
    transactionTime: transactionTime ? new Date(transactionTime).toLocaleString("vi-VN") : "N/A",
    amount: amount || "N/A",
  };
  console.log("[PaymentNotification] Dữ liệu được hiển thị:", displayData);

  const handleViewDetails = () => {
    // Mở modal chi tiết đơn hàng
    setOpenModal(true);
  };

  const [openModal, setOpenModal] = React.useState(false);

  // Hàm đóng modal và notification
  const handleCloseAll = () => {
    setOpenModal(false);
    onClose();
  };

  return (
    <>
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
            <Typography variant="subtitle1" fontWeight={600} color="#1c1c1e">
              Thanh Toán Thành Công
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onClose} sx={{ color: "#6e6e73" }}>
            <X size={16} />
          </IconButton>
        </Stack>

        <Stack spacing={0.5} mb={2}>
          <Typography variant="body2" color="text.secondary">
            <strong>ID Đơn Hàng:</strong> {displayData.orderId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Tên Tài Khoản:</strong> {displayData.accountName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Số Tài Khoản:</strong> {displayData.accountNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Thời Gian:</strong> {displayData.transactionTime}
          </Typography>
          <Typography variant="body2" color="#d32f2f" fontWeight={600}>
            <strong>Số Tiền:</strong> {displayData.amount}
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
            Xem Chi Tiết
          </Button>
        </Box>
      </Paper>

      <OrderDetailsModal
        open={openModal}
        onClose={handleCloseAll}
        orderId={orderId}
      />
    </>
  );
};
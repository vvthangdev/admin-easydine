import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import { Package, X } from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";

export default function OrderNotification({
  id,
  message,
  data,
  timestamp,
  type,
  onClose,
}) {
  const [openModal, setOpenModal] = useState(false);

  // Log dữ liệu props
  console.log("[OrderNotification] Dữ liệu props nhận được:", {
    id,
    message,
    data,
    timestamp,
    type,
  });

  // Format dữ liệu hiển thị
  const displayData = {
    message: message || "Không có nội dung",
    time: timestamp
      ? new Date(timestamp)
          .toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(",", "")
      : "N/A",
  };

  const handleViewDetails = () => {
    setOpenModal(true);
  };

  const handleCloseAll = () => {
    setOpenModal(false);
    onClose();
  };

  // Kiểm tra nếu type là CALL_STAFF thì không hiển thị nút Xem chi tiết
  const isCallStaff = type === "CALL_STAFF";

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
          animation: "slideIn 0.3s ease-out",
          "@keyframes slideIn": {
            from: { opacity: 0, transform: "translateX(100%)" },
            to: { opacity: 1, transform: "translateX(0)" },
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
            <Package size={20} color="#1c1c1e" />
            <Typography variant="subtitle2" fontWeight={600} color="#1c1c1e">
              {displayData.message}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onClose} sx={{ color: "#6e6e73" }}>
            <X size={16} />
          </IconButton>
        </Stack>

        <Stack spacing={0.5} mb={1}>
          <Typography variant="body2" color="text.secondary">
            <strong>Thời gian:</strong> {displayData.time}
          </Typography>
        </Stack>

        {!isCallStaff && (
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
        )}
      </Paper>

      {!isCallStaff && (
        <OrderDetailsModal
          open={openModal}
          onClose={handleCloseAll}
          notificationData={{ id, message, data, timestamp }}
        />
      )}
    </>
  );
}
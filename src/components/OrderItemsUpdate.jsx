import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Package, X } from "lucide-react";
import OrderItemsDetailsModal from "./OrderItemsDetailsModal";

export default function OrderItemsUpdate({ id, message, data, timestamp, onClose }) {
  const [openModal, setOpenModal] = useState(false);

  // Log dữ liệu props
  console.log("[OrderItemsUpdate] Dữ liệu props nhận được:", {
    id,
    message,
    data,
    timestamp,
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
    table: data?.table || "N/A",
    items: data?.addedItems || data?.canceledItems || [],
  };

  const handleViewDetails = () => {
    setOpenModal(true);
  };

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
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: "#6e6e73" }}
          >
            <X size={16} />
          </IconButton>
        </Stack>

        <Stack spacing={0.5} mb={1}>
          <Typography variant="body2" color="text.secondary">
            <strong>Thời gian:</strong> {displayData.time}
          </Typography>
          {displayData.items.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {data.addedItems ? "Món đã thêm:" : "Món đã hủy:"}
              </Typography>
              <List dense sx={{ pl: 1 }}>
                {displayData.items.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.primary">
                          {`${item.quantity} x ${item.itemName}${
                            item.size ? ` (${item.size})` : ""
                          }`}
                        </Typography>
                      }
                      secondary={
                        item.cancel_reason ? (
                          <Typography variant="caption" color="text.secondary">
                            Lý do hủy: {item.cancel_reason}
                          </Typography>
                        ) : null
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
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

      <OrderItemsDetailsModal
        open={openModal}
        onClose={handleCloseAll}
        notificationData={{ id, message, data, timestamp }}
      />
    </>
  );
}
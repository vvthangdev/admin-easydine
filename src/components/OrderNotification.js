import React, { useState } from "react";
import { Box, Paper, Typography, IconButton, Stack, Button } from "@mui/material";
import { Package, X } from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";

export default function OrderNotification({
  _id,
  type,
  time,
  status,
  tableDetails,
  onClose, // Prop để đóng notification
}) {
  const [openModal, setOpenModal] = useState(false);

  // Log dữ liệu props
  console.log("[OrderNotification] Dữ liệu props nhận được:", {
    _id,
    type,
    time,
    status,
    tableDetails,
  });

  const displayData = {
    _id,
    type,
    time: time ? new Date(time).toLocaleString("vi-VN") : "N/A",
    status,
    table:
      tableDetails && tableDetails.length > 0
        ? `${tableDetails[0].table_number} (${tableDetails[0].area})`
        : "N/A",
  };
  console.log("[OrderNotification] Dữ liệu được hiển thị:", displayData);

  const handleViewDetails = () => {
    setOpenModal(true); // Mở modal
  };

  // Hàm đóng modal và notification
  const handleCloseAll = () => {
    setOpenModal(false); // Đóng modal
    onClose(); // Đóng notification
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
            <strong>ID Đơn Hàng:</strong> {_id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Loại:</strong> {type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Trạng Thái:</strong> {status}
          </Typography>
          {tableDetails && tableDetails.length > 0 && (
            <Typography variant="body2" color="#d32f2f" fontWeight={600}>
              <strong>Số Bàn:</strong> {tableDetails[0].table_number} (
              {tableDetails[0].area})
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            <strong>Thời Gian:</strong>{" "}
            {time ? new Date(time).toLocaleString("vi-VN") : "N/A"}
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
        onClose={handleCloseAll} // Truyền handleCloseAll thay vì chỉ đóng modal
        orderId={_id}
      />
    </>
  );
}
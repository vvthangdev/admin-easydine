import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, IconButton, Stack } from "@mui/material";
import { CreditCard, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { orderAPI } from "../services/apis/Order"; // Giả định bạn có orderAPI

export default function PaymentNotification({
  id,
  type,
  title,
  data,
  onClose,
}) {
  const [loading, setLoading] = useState(false);

  // Log dữ liệu props
  console.log("[PaymentNotification] Dữ liệu props nhận được:", {
    id,
    type,
    title,
    data,
  });

  // Format dữ liệu hiển thị
  const displayData = {
    amount: data?.amount
      ? `${data.amount.toLocaleString("vi-VN")} VND`
      : "N/A",
    account: data?.soTaiKhoanDoiUng || "N/A", // Số tài khoản đối ứng
  };

  // Tự động xác nhận thanh toán và mở cửa sổ sau 3 giây
  useEffect(() => {
    if (!data?.orderId) {
      toast.error("Không tìm thấy ID đơn hàng!");
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Gọi API xác nhận thanh toán
        const response = await orderAPI.payOrder({
          order_id: data.orderId,
          payment_method: "bank_transfer",
        });

        if (response.status === "success") {
          toast.success("Xác nhận thanh toán thành công!");
          // Mở cửa sổ mới với trang payment-success
          const successUrl = `/payment-success?order_id=${data.orderId}&message=${encodeURIComponent("Giao dịch thành công")}`;
          window.open(successUrl, "_blank");
        } else {
          throw new Error("Xác nhận thanh toán thất bại!");
        }
      } catch (error) {
        console.error("[PaymentNotification] Lỗi khi xác nhận thanh toán:", error);
        toast.error(error.response?.data?.message || error.message || "Lỗi khi xác nhận thanh toán. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }, 3000); // Chờ 3 giây

    // Cleanup timer khi component unmount
    return () => clearTimeout(timer);
  }, [data?.orderId]); // Chỉ chạy lại nếu orderId thay đổi

  // Đóng notification
  const handleClose = () => {
    onClose();
  };

  return (
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
            Thanh toán đơn hàng thành công
          </Typography>
        </Stack>
        <IconButton size="small" onClick={handleClose} sx={{ color: "#6e6e73" }}>
          <X size={16} />
        </IconButton>
      </Stack>

      <Stack spacing={0.5} mb={1}>
        <Typography variant="body2" color="#d32f2f" fontWeight={600}>
          <strong>Số tiền:</strong> {displayData.amount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Số tài khoản:</strong> {displayData.account}
        </Typography>
      </Stack>

      {loading && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Đang xử lý...
        </Typography>
      )}
    </Paper>
  );
}
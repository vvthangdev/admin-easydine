import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { orderAPI } from "../../services/apis/Order";

const PaymentModal = ({ visible, onCancel, orderDetails, zIndex }) => {
  const [paymentMethod, setPaymentMethod] = useState("vnpay"); // Mặc định chọn VNPay
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!orderDetails?.order?.id) {
      toast.error("Không tìm thấy đơn hàng!");
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod !== "vnpay") {
        toast.info("Chức năng thanh toán bằng tiền mặt hoặc chuyển khoản đang phát triển!");
        setLoading(false);
        return;
      }

      // Kiểm tra thông tin đơn hàng
      const orderInfo = await orderAPI.getOrderInfo({ id: orderDetails.order.id });
      if (orderInfo.order.status !== "confirmed") {
        toast.error("Đơn hàng cần được xác nhận trước khi thanh toán!");
        setLoading(false);
        return;
      }
      if (orderInfo.order.payment_status === "success") {
        toast.error("Đơn hàng đã được thanh toán!");
        setLoading(false);
        return;
      }

      // Tính số tiền
      const amount =
        orderDetails.order.final_amount ||
        orderDetails.itemOrders?.reduce(
          (total, item) => total + item.itemPrice * item.quantity,
          0
        ) ||
        0;

      if (amount <= 0) {
        toast.error("Số tiền đơn hàng không hợp lệ!");
        setLoading(false);
        return;
      }

      // Gửi yêu cầu tạo URL thanh toán VNPay
      const response = await orderAPI.createPayment({
        order_id: orderDetails.order.id,
        amount,
        order_desc: `Thanh toan don hang ${orderDetails.order.id}`,
        language: "vn",
        payment_method: "vnpay",
      });

      // Kiểm tra và chuyển hướng đến URL VNPay
      if (response.vnpUrl && typeof response.vnpUrl === "string" && response.vnpUrl.startsWith("https://")) {
        window.location.href = response.vnpUrl;
      } else {
        throw new Error("URL thanh toán không hợp lệ!");
      }
    } catch (error) {
      console.error("Error processing VNPay payment:", error);
      toast.error(error.message || "Lỗi khi xử lý thanh toán VNPay. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onClose={onCancel}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: zIndex,
      }}
    >
      <Box
        sx={{
          width: { xs: "90vw", sm: 400 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Chọn hình thức thanh toán
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Đơn hàng: {orderDetails?.order?.id || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Tổng tiền:{" "}
          {(orderDetails?.order?.final_amount ||
            orderDetails?.itemOrders?.reduce(
              (total, item) => total + item.itemPrice * item.quantity,
              0
            ) ||
            0).toLocaleString()}{" "}
          VND
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label="Tiền mặt"
              disabled // Vô hiệu hóa tùy chọn này
            />
            <FormControlLabel
              value="bank_transfer"
              control={<Radio />}
              label="Chuyển khoản ngân hàng"
              disabled // Vô hiệu hóa tùy chọn này
            />
            <FormControlLabel
              value="vnpay"
              control={<Radio />}
              label="Thanh toán qua VNPay"
            />
          </RadioGroup>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            Xác nhận
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
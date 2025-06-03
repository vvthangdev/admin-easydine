import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
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
import { orderAPI } from "../../../services/apis/Order";

const PaymentModal = ({ visible, onCancel, orderDetails, zIndex }) => {
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);
  const [qrContent, setQrContent] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Tính số tiền
  const amount =
    orderDetails?.order?.final_amount ||
    orderDetails?.itemOrders?.reduce(
      (total, item) => total + item.itemPrice * item.quantity,
      0
    ) ||
    0;

  // Tạo nội dung chuyển khoản khi chọn phương thức chuyển khoản
  useEffect(() => {
    if (paymentMethod === "bank_transfer") {
      if (amount <= 0) {
        toast.error("Số tiền đơn hàng không hợp lệ!");
        setQrContent("");
        return;
      }

      // Nội dung chuyển khoản: "thanh toan" + order_id
      const orderId = orderDetails?.order?.id || "00000";
      const content = `thanh toan ${orderId}`;
      setQrContent(content);
    } else {
      setQrContent("");
    }
  }, [paymentMethod, amount, orderDetails]);

  const handlePayment = async () => {
    if (!orderDetails?.order?.id) {
      toast.error("Không tìm thấy đơn hàng!");
      return;
    }

    setLoading(true);
    try {
      // Kiểm tra thông tin đơn hàng
      const orderInfo = await orderAPI.getOrderInfo({ id: orderDetails.order.id });
      if (orderInfo.order.status !== "confirmed") {
        toast.error("Đơn hàng cần được xác nhận trước khi thanh toán!");
        return;
      }
      if (orderInfo.order.payment_status === "success") {
        toast.error("Đơn hàng đã được thanh toán!");
        return;
      }

      if (amount <= 0) {
        toast.error("Số tiền đơn hàng không hợp lệ!");
        return;
      }

      if (paymentMethod === "vnpay") {
        // Xử lý thanh toán VNPay
        const response = await orderAPI.createPayment({
          order_id: orderDetails.order.id,
          amount,
          order_desc: `Thanh toan don hang ${orderDetails.order.id}`,
          language: "vn",
          payment_method: "vnpay",
        });

        if (response.vnpUrl && typeof response.vnpUrl === "string" && response.vnpUrl.startsWith("https://")) {
          window.location.href = response.vnpUrl;
        } else {
          throw new Error("URL thanh toán không hợp lệ!");
        }
      } else {
        // Xử lý thanh toán tiền mặt hoặc chuyển khoản
        await orderAPI.payOrder({
          order_id: orderDetails.order.id,
          payment_method: paymentMethod,
        });

        // Nếu không có lỗi ném ra, thanh toán thành công
        toast.success(
          paymentMethod === "bank_transfer"
            ? "Yêu cầu thanh toán bằng chuyển khoản đã được ghi nhận!"
            : "Thanh toán bằng tiền mặt thành công!"
        );

        // Chuyển hướng đến payment-success
        navigate(
          `/payment-success?order_id=${orderDetails.order.id}&message=${encodeURIComponent("Giao dịch thành công")}`
        );
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(error.response?.data?.message || error.message || "Lỗi khi xử lý thanh toán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // VietQR image URL
  const vietQrImageUrl = `${process.env.REACT_APP_QRCODE}?amount=${Math.floor(
    amount
  )}&addInfo=thanh%20toan%20${encodeURIComponent(
    orderDetails?.order?.id || "00000"
  )}&accountName=VU%20VAN%20THANG`;

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
          Tổng tiền: {amount.toLocaleString()} VND
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Tiền mặt" />
            <FormControlLabel
              value="bank_transfer"
              control={<Radio />}
              label="Chuyển khoản ngân hàng"
            />
            <FormControlLabel
              value="vnpay"
              control={<Radio />}
              label="Thanh toán qua VNPay"
            />
          </RadioGroup>
        </FormControl>

        {/* Hiển thị mã QR nếu chọn chuyển khoản */}
        {paymentMethod === "bank_transfer" && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" gutterBottom>
              Quét mã QR để thanh toán:
            </Typography>
            <img
              src={vietQrImageUrl}
              alt="VietQR Code"
              style={{ width: 150, height: 150 }}
            />
            <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-line" }}>
              Số tiền: {amount.toLocaleString()} VND
              <br />
              Nội dung: {qrContent || "N/A"}
            </Typography>
          </Box>
        )}

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
import React, { useState, useEffect } from "react";
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
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { orderAPI } from "../../../services/apis/Order";

const PaymentModal = ({ visible, onCancel, orderDetails, zIndex }) => {
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [qrContent, setQrContent] = useState(""); // Lưu nội dung chuyển khoản để hiển thị

  // Tính số tiền
  const amount =
    orderDetails?.order?.final_amount ||
    orderDetails?.itemOrders?.reduce(
      (total, item) => total + item.itemPrice * item.quantity,
      0
    ) ||
    0;

  // Tạo nội dung QR khi chọn phương thức chuyển khoản
  useEffect(() => {
    if (paymentMethod === "bank_transfer") {
      if (amount <= 0) {
        toast.error("Số tiền đơn hàng không hợp lệ!");
        setQrData(null);
        setQrContent("");
        return;
      }
      // Định dạng số tiền: thêm dấu phẩy làm phân cách thập phân
      const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // Nội dung chuyển khoản: "thanh toan" + 5 ký tự cuối của order_id
      const orderId = orderDetails?.order?.id || "00000"; // Dự phòng nếu order_id không tồn tại
      const content = `thanh toan`;
      // Tạo text QR theo mẫu
      const qrContentFull = `00020101021238540010A00000072701240006970436011010169156190208QRIBFTTA53037045406${formattedAmount}5802VN62240820${content}6304CB07`;
      setQrData(qrContentFull);
      setQrContent(content); // Lưu nội dung để hiển thị
    } else {
      setQrData(null); // Reset QR khi không chọn chuyển khoản
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
        setLoading(false);
        return;
      }
      if (orderInfo.order.payment_status === "success") {
        toast.error("Đơn hàng đã được thanh toán!");
        setLoading(false);
        return;
      }

      if (amount <= 0) {
        toast.error("Số tiền đơn hàng không hợp lệ!");
        setLoading(false);
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
        console.log("Calling payOrder with:", { order_id: orderDetails.order.id, payment_method: paymentMethod });
        const response = await orderAPI.payOrder({
          order_id: orderDetails.order.id,
          payment_method: paymentMethod,
        });
        console.log("payOrder response:", response);

        if (response.status === "SUCCESS") {
          if (paymentMethod === "bank_transfer") {
            // Cập nhật QR với transaction_id từ phản hồi API (nếu có)
            const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const content = "thanh toan don hang"
            const qrContentFull = `00020101021238540010A00000072701240006970436011010169156190208QRIBFTTA53037045406${formattedAmount}5802VN62240820${content}6304CB07`;
            setQrData(qrContentFull);
            setQrContent(content);
            toast.success("Yêu cầu thanh toán bằng chuyển khoản đã được ghi nhận!");
          } else {
            toast.success("Thanh toán bằng tiền mặt thành công!");
            onCancel(); // Đóng modal sau khi thanh toán tiền mặt
          }
        } else {
          throw new Error(response.message || "Lỗi khi xử lý thanh toán!");
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(error.response?.data?.message || error.message || "Lỗi khi xử lý thanh toán. Vui lòng thử lại.");
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
          Tổng tiền: {amount.toLocaleString()} VND
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
            }}
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
        {paymentMethod === "bank_transfer" && qrData && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" gutterBottom>
              Quét mã QR để thanh toán:
            </Typography>
            <QRCodeCanvas value={qrData} size={150} />
            <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-line" }}>
              STK: 1016915619
              <br />
              Ngân hàng: Vietcombank
              <br />
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
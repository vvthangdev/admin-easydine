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

const PaymentModal = ({ visible, onCancel, onConfirm, orderDetails, zIndex }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (paymentMethod === "vnpay") {
        const amount = orderDetails?.itemOrders
          ? orderDetails.itemOrders.reduce(
              (total, item) => total + item.itemPrice * item.quantity,
              0
            )
          : 0;
        const response = await orderAPI.createPayment({
          order_id: orderDetails?.order?.id,
          amount,
          order_desc: `Thanh toan don hang ${orderDetails?.order?.id}`,
          language: "vn",
        });
        window.location.href = response.vnpUrl;
      } else {
        await onConfirm({ paymentMethod, orderId: orderDetails?.order?.id });
        toast.success(`Thanh toán bằng ${paymentMethod === "cash" ? "tiền mặt" : "chuyển khoản ngân hàng"} thành công`);
        onCancel();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Lỗi khi xử lý thanh toán. Vui lòng thử lại.");
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
        <FormControl component="fieldset">
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label="Tiền mặt"
            />
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
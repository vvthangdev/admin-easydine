// /components/PaymentModal/PaymentModalView.jsx
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

const PaymentModalView = ({
  visible,
  orderDetails,
  zIndex,
  paymentMethod,
  loading,
  handlePayment,
  handlePaymentMethodChange,
  onCancel,
}) => {
  const calculateTotalAmount = () =>
    (orderDetails?.order?.final_amount ||
      orderDetails?.itemOrders?.reduce(
        (total, item) => total + item.itemPrice * item.quantity,
        0
      ) ||
      0).toLocaleString();

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
          Tổng tiền: {calculateTotalAmount()} VND
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => handlePaymentMethodChange(e.target.value)}
          >
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label="Tiền mặt"
              disabled
            />
            <FormControlLabel
              value="bank_transfer"
              control={<Radio />}
              label="Chuyển khoản ngân hàng"
              disabled
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

export default PaymentModalView;
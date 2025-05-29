import React from "react";
import { useLocation } from "react-router-dom";
import { Typography, Button, Box } from "@mui/material";

const PaymentSuccess = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const orderId = query.get("order_id");

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h4" color="success.main" gutterBottom>
        Thanh toán thành công!
      </Typography>
      <Typography variant="body1">Đơn hàng: {orderId}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => (window.location.href = `/order/${orderId}`)}
        sx={{ mt: 2 }}
      >
        Xem chi tiết đơn hàng
      </Button>
    </Box>
  );
};

export default PaymentSuccess;
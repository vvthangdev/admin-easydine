import React from "react";
import { useLocation } from "react-router-dom";
import { Typography, Button, Box } from "@mui/material";

const PaymentFailed = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const message = query.get("message");

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h4" color="error.main" gutterBottom>
        Thanh toán thất bại!
      </Typography>
      <Typography variant="body1">Lỗi: {message}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => (window.location.href = "/orders")}
        sx={{ mt: 2 }}
      >
        Quay lại danh sách đơn hàng
      </Button>
    </Box>
  );
};

export default PaymentFailed;
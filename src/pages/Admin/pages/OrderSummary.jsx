import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { ShoppingCart, Users, DollarSign, CreditCard, XCircle } from "lucide-react";

export default function OrderSummary({ totalSummary }) {
  return (
    <Grid container spacing={3} sx={{ position: "relative", zIndex: 1 }}>
      <Grid item xs={12} sm={4}>
        <Card
          sx={{
            p: 2,
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" },
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(0, 113, 227, 0.1)",
                mx: "auto",
              }}
            >
              <ShoppingCart color="#0071e3" size={28} />
            </Box>
            <Typography variant="h6" color="#86868b" gutterBottom>
              Tổng Số Đơn Hàng
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="#1d1d1f">
              {totalSummary.totalOrders}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card
          sx={{
            p: 2,
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" },
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(0, 113, 227, 0.1)",
                mx: "auto",
              }}
            >
              <Users color="#0071e3" size={28} />
            </Box>
            <Typography variant="h6" color="#86868b" gutterBottom>
              Tổng Số Người Đặt
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="#1d1d1f">
              {totalSummary.totalPeople}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card
          sx={{
            p: 2,
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" },
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(0, 113, 227, 0.1)",
                mx: "auto",
              }}
            >
              <DollarSign color="#0071e3" size={28} />
            </Box>
            <Typography variant="h6" color="#86868b" gutterBottom>
              Tổng Doanh Thu
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="#1d1d1f">
              {totalSummary.totalRevenue.toLocaleString()} VND
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card
          sx={{
            p: 2,
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" },
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(0, 113, 227, 0.1)",
                mx: "auto",
              }}
            >
              <CreditCard color="#0071e3" size={28} />
            </Box>
            <Typography variant="h6" color="#86868b" gutterBottom>
              Tổng Thanh Toán
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="#1d1d1f">
              {totalSummary.paymentMethods}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card
          sx={{
            p: 2,
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
            "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)" },
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(0, 113, 227, 0.1)",
                mx: "auto",
              }}
            >
              <XCircle color="#0071e3" size={28} />
            </Box>
            <Typography variant="h6" color="#86868b" gutterBottom>
              Tổng Hủy Đơn
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="#1d1d1f">
              {totalSummary.cancelReasons}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
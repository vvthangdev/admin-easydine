"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Grid, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { message } from "antd";
import { analyticsAPI } from "../../../services/apis/Analytics";
import OrderSummary from "./OrderSummary";
import OrderCharts from "./OrderCharts";

export default function OrderOverview() {
  const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const [startDate, setStartDate] = useState(firstDayOfMonth);
const [endDate, setEndDate] = useState(today);
  const [orderStats, setOrderStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [peopleVsAmount, setPeopleVsAmount] = useState([]);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [itemSales, setItemSales] = useState([]);
  const [itemCategories, setItemCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    try {
      const [
        statusResponse,
        revenueResponse,
        paymentResponse,
        peopleResponse,
        cancelResponse,
        salesResponse,
        categoryResponse,
      ] = await Promise.all([
        analyticsAPI.getOrderStatusDistribution({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }),
        analyticsAPI.getRevenueTrend({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          interval: "day",
        }),
        analyticsAPI.getPaymentMethodDistribution({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }),
        analyticsAPI.getPeopleVsAmount({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }),
        analyticsAPI.getCancelReasonDistribution({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }),
        analyticsAPI.getItemSalesByCategory({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }),
        analyticsAPI.getItemCategoryDistribution(),
      ]);

      // Đảm bảo dữ liệu trả về là array, nếu không thì gán array rỗng
      setOrderStats(Array.isArray(statusResponse) ? statusResponse : []);
      setRevenueData(Array.isArray(revenueResponse) ? revenueResponse : []);
      setPaymentMethods(Array.isArray(paymentResponse) ? paymentResponse : []);
      setPeopleVsAmount(Array.isArray(peopleResponse) ? peopleResponse : []);
      setCancelReasons(Array.isArray(cancelResponse) ? cancelResponse : []);
      setItemSales(Array.isArray(salesResponse) ? salesResponse : []);
      setItemCategories(Array.isArray(categoryResponse) ? categoryResponse : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu phân tích");
      // Đặt lại các state về array rỗng khi có lỗi
      setOrderStats([]);
      setRevenueData([]);
      setPaymentMethods([]);
      setPeopleVsAmount([]);
      setCancelReasons([]);
      setItemSales([]);
      setItemCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [startDate, endDate]);

  // Tính toán tổng quan với safe check
  const totalSummary = {
    totalOrders: Array.isArray(orderStats) ? orderStats.reduce((acc, stat) => acc + (stat.count || 0), 0) : 0,
    totalPeople: Array.isArray(peopleVsAmount) ? peopleVsAmount.reduce((acc, item) => acc + (item.numberPeople || 0), 0) : 0,
    totalRevenue: Array.isArray(revenueData) ? revenueData.reduce((acc, item) => acc + (item.totalRevenue || 0), 0) : 0,
    paymentMethods: Array.isArray(paymentMethods) ? paymentMethods.reduce((acc, method) => acc + (method.count || 0), 0) : 0,
    cancelReasons: Array.isArray(cancelReasons) ? cancelReasons.reduce((acc, reason) => acc + (reason.count || 0), 0) : 0,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: 4,
          background: "linear-gradient(145deg, #f5f5f7 0%, #ffffff 100%)",
          minHeight: "100vh",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at top left, rgba(0, 122, 255, 0.05), transparent 70%)",
            zIndex: 0,
          },
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#1d1d1f"
          mb={4}
          sx={{ position: "relative", zIndex: 1, fontFamily: '"SF Pro Display", Roboto, sans-serif' }}
        >
          Tổng Quan Đơn Hàng
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4, position: "relative", zIndex: 1 }}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Ngày bắt đầu"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Ngày kết thúc"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#0071e3" }} />
          </Box>
        ) : (
          <>
            <OrderSummary totalSummary={totalSummary} />
            <OrderCharts
              revenueData={revenueData}
              orderStats={orderStats}
              paymentMethods={paymentMethods}
              cancelReasons={cancelReasons}
              itemSales={itemSales}
              itemCategories={itemCategories}
            />
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
}
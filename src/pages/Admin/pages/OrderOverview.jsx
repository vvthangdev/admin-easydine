"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  TextField,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { format } from "date-fns"
import { message } from "antd"
import { Calendar, RefreshCw, Download, Filter, BarChart3, Activity } from "lucide-react"
import { analyticsAPI } from "../../../services/apis/Analytics"
import OrderSummary from "./OrderSummary"
import OrderCharts from "./OrderCharts"

export default function OrderOverview() {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const [startDate, setStartDate] = useState(firstDayOfMonth)
  const [endDate, setEndDate] = useState(today)
  const [orderStats, setOrderStats] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [peopleVsAmount, setPeopleVsAmount] = useState([])
  const [cancelReasons, setCancelReasons] = useState([])
  const [itemSales, setItemSales] = useState([])
  const [itemCategories, setItemCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAllData = async (showRefreshLoader = false) => {
    if (!startDate || !endDate) return

    if (showRefreshLoader) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd")
    const formattedEndDate = format(endDate, "yyyy-MM-dd")

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
      ])

      // Đảm bảo dữ liệu trả về là array, nếu không thì gán array rỗng
      setOrderStats(Array.isArray(statusResponse) ? statusResponse : [])
      setRevenueData(Array.isArray(revenueResponse) ? revenueResponse : [])
      setPaymentMethods(Array.isArray(paymentResponse) ? paymentResponse : [])
      setPeopleVsAmount(Array.isArray(peopleResponse) ? peopleResponse : [])
      setCancelReasons(Array.isArray(cancelResponse) ? cancelResponse : [])
      setItemSales(Array.isArray(salesResponse) ? salesResponse : [])
      setItemCategories(Array.isArray(categoryResponse) ? categoryResponse : [])

      message.success("Dữ liệu đã được cập nhật thành công")
    } catch (error) {
      console.error("Error fetching data:", error)
      message.error("Không thể tải dữ liệu phân tích")
      // Đặt lại các state về array rỗng khi có lỗi
      setOrderStats([])
      setRevenueData([])
      setPaymentMethods([])
      setPeopleVsAmount([])
      setCancelReasons([])
      setItemSales([])
      setItemCategories([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [startDate, endDate])

  // Tính toán tổng quan với safe check
  const totalSummary = {
    totalOrders: Array.isArray(orderStats) ? orderStats.reduce((acc, stat) => acc + (stat.count || 0), 0) : 0,
    totalPeople: Array.isArray(peopleVsAmount)
      ? peopleVsAmount.reduce((acc, item) => acc + (item.numberPeople || 0), 0)
      : 0,
    totalRevenue: Array.isArray(revenueData) ? revenueData.reduce((acc, item) => acc + (item.totalRevenue || 0), 0) : 0,
    paymentMethods: Array.isArray(paymentMethods)
      ? paymentMethods.reduce((acc, method) => acc + (method.count || 0), 0)
      : 0,
    cancelReasons: Array.isArray(cancelReasons)
      ? cancelReasons.reduce((acc, reason) => acc + (reason.count || 0), 0)
      : 0,
  }

  const handleRefresh = () => {
    fetchAllData(true)
  }

  const handleExport = () => {
    // Implement export functionality
    message.info("Tính năng xuất báo cáo đang được phát triển")
  }

  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`
    }
    return "Chọn khoảng thời gian"
  }

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
        {/* Header Section */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            mb: 4,
            p: 3,
            background: "linear-gradient(135deg, #0071e3 0%, #005bb5 100%)",
            borderRadius: "16px",
            color: "white",
            boxShadow: "0 8px 32px rgba(0, 113, 227, 0.3)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Activity size={24} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  mb: 0.5,
                }}
              >
                Tổng Quan Đơn Hàng
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Phân tích chi tiết về hiệu suất đơn hàng và doanh thu
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Làm mới dữ liệu">
                <IconButton
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{
                    color: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xuất báo cáo">
                <IconButton
                  onClick={handleExport}
                  sx={{
                    color: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <Download size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Date Range Display */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 2,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              backdropFilter: "blur(10px)",
            }}
          >
            <Calendar size={16} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Khoảng thời gian: {getDateRangeText()}
            </Typography>
          </Box>
        </Box>

        {/* Filter Controls */}
        <Card
          sx={{
            position: "relative",
            zIndex: 1,
            mb: 4,
            borderRadius: "12px",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #0071e3 0%, #005bb5 100%)",
                  color: "white",
                }}
              >
                <Filter size={16} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1d1d1f",
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Bộ Lọc Thời Gian
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          background: "white",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0071e3",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0071e3",
                            borderWidth: "2px",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Ngày kết thúc"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          background: "white",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0071e3",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0071e3",
                            borderWidth: "2px",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Quick Date Filters */}
            <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Typography variant="body2" sx={{ color: "text.secondary", mr: 2, alignSelf: "center" }}>
                Lọc nhanh:
              </Typography>
              {[
                { label: "Hôm nay", days: 0 },
                { label: "7 ngày", days: 7 },
                { label: "30 ngày", days: 30 },
                { label: "90 ngày", days: 90 },
              ].map((filter) => (
                <Chip
                  key={filter.label}
                  label={filter.label}
                  onClick={() => {
                    const end = new Date()
                    const start = new Date()
                    start.setDate(start.getDate() - filter.days)
                    setStartDate(start)
                    setEndDate(end)
                  }}
                  sx={{
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #0071e3 0%, #005bb5 100%)",
                    color: "white",
                    fontWeight: 500,
                    "&:hover": {
                      background: "linear-gradient(135deg, #005bb5 0%, #004494 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0, 113, 227, 0.3)",
                    },
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              position: "relative",
              zIndex: 1,
            }}
          >
            <CircularProgress
              size={48}
              sx={{
                color: "#0071e3",
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
              Đang tải dữ liệu...
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Vui lòng chờ trong giây lát
            </Typography>
          </Box>
        ) : (
          <>
            {/* Summary Cards */}
            <OrderSummary totalSummary={totalSummary} />

            {/* Charts Section */}
            <Box sx={{ position: "relative", zIndex: 1, mt: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                  p: 3,
                  background: "linear-gradient(135deg, #34c759 0%, #28a745 100%)",
                  borderRadius: "12px",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(52, 199, 89, 0.3)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <BarChart3 size={24} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                      mb: 0.5,
                    }}
                  >
                    Biểu Đồ Phân Tích
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Trực quan hóa dữ liệu đơn hàng và xu hướng kinh doanh
                  </Typography>
                </Box>
              </Box>

              <OrderCharts
                revenueData={revenueData}
                orderStats={orderStats}
                paymentMethods={paymentMethods}
                cancelReasons={cancelReasons}
                itemSales={itemSales}
                itemCategories={itemCategories}
                loading={refreshing}
              />
            </Box>
          </>
        )}
      </Box>
    </LocalizationProvider>
  )
}

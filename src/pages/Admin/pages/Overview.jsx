"use client"

import React, { useEffect, useState } from 'react'
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ShoppingCart, Users, DollarSign } from 'lucide-react'
import { orderAPI } from '../../../services/apis/Order'
import { message } from 'antd'

export default function OrderOverview() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await orderAPI.getAllOrdersInfo()
      setOrders(response)
    } catch (error) {
      message.error('Không thể tải dữ liệu đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const totalSummary = {
    totalOrders: orders.length,
    totalPeople: orders.reduce((acc, order) => acc + (order.num_people || 0), 0),
    totalRevenue: orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0),
  }

  const groupedByDate = orders.reduce((acc, order) => {
    const date = order.time.split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, numOrders: 0, totalRevenue: 0 }
    }
    acc[date].numOrders += 1
    acc[date].totalRevenue += order.totalAmount || 0
    return acc
  }, {})

  const chartData = Object.values(groupedByDate)

  return (
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
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)",
              },
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
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#0071e3" }} />
              ) : (
                <Typography variant="h4" fontWeight="bold" color="#1d1d1f">
                  {totalSummary.totalOrders}
                </Typography>
              )}
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
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)",
              },
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
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#0071e3" }} />
              ) : (
                <Typography variant="h4" fontWeight="bold" color="#1d1d1f">
                  {totalSummary.totalPeople}
                </Typography>
              )}
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
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)",
              },
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
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#0071e3" }} />
              ) : (
                <Typography variant="h4" fontWeight="bold" color="#1d1d1f">
                  {totalSummary.totalRevenue.toLocaleString()} VND
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4, position: "relative", zIndex: 1 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="#1d1d1f" fontWeight={600} gutterBottom>
                Doanh Thu Theo Ngày
              </Typography>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#0071e3" }} />
                </Box>
              ) : (
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0071e3" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0071e3" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" tick={{ fill: "#86868b" }} />
                      <YAxis tick={{ fill: "#86868b" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: 12,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          border: "none",
                        }}
                        itemStyle={{ color: "#1d1d1f" }}
                        cursor={{ strokeDasharray: "3 3" }}
                      />
                      <Legend wrapperStyle={{ color: "#86868b" }} />
                      <Area
                        type="monotone"
                        dataKey="totalRevenue"
                        stroke="#0071e3"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="Doanh Thu"
                        dot={{ stroke: "#0071e3", strokeWidth: 2, r: 4, fill: "#fff" }}
                        activeDot={{ r: 6, stroke: "#0071e3", strokeWidth: 2, fill: "#fff" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="#1d1d1f" fontWeight={600} gutterBottom>
                Số Lượng Đơn Hàng Theo Ngày
              </Typography>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#0071e3" }} />
                </Box>
              ) : (
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0071e3" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0071e3" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" tick={{ fill: "#86868b" }} />
                      <YAxis tick={{ fill: "#86868b" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: 12,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          border: "none",
                        }}
                        itemStyle={{ color: "#1d1d1f" }}
                        cursor={{ fill: "rgba(0, 113, 227, 0.1)" }}
                      />
                      <Legend wrapperStyle={{ color: "#86868b" }} />
                      <Bar
                        dataKey="numOrders"
                        fill="url(#colorOrders)"
                        name="Số Đơn Hàng"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

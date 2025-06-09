'use client';

import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShoppingCart, Users, DollarSign } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { orderAPI } from '../../../services/apis/Order';
import { message } from 'antd';

export default function OrderOverview() {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getAllOrdersInfo();
      setOrders(response);
    } catch (error) {
      message.error('Không thể tải dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalSummary = {
    totalOrders: orders.length,
    totalPeople: orders.reduce((acc, order) => acc + (order.num_people || 0), 0),
    totalRevenue: orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0),
  };

  const groupedByDate = orders.reduce((acc, order) => {
    const date = order.time.split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, numOrders: 0, totalRevenue: 0 };
    }
    acc[date].numOrders += 1;
    acc[date].totalRevenue += order.totalAmount || 0;
    return acc;
  }, {});

  const chartData = Object.values(groupedByDate);

  return (
    <Box
      sx={{
        p: 4,
        background: theme.gradients.card,
        minHeight: '100vh',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.gradients.primaryHover,
          zIndex: 0,
        },
      }}
    >
      <Typography
        variant="h4"
        fontWeight={theme.typography.fontWeightBold}
        color={theme.palette.text.primary}
        mb={4}
        sx={{
          position: 'relative',
          zIndex: 1,
          fontFamily: theme.typography.fontFamily.primary,
        }}
      >
        Tổng Quan Đơn Hàng
      </Typography>

      <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              p: 2,
              borderRadius: theme.shape.borderRadius,
              background: theme.gradients.card,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows.md,
              transition: theme.animations.transition,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows.lg,
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: theme.gradients.primaryHover,
                  mx: 'auto',
                }}
              >
                <ShoppingCart color={theme.palette.primary.main} size={28} />
              </Box>
              <Typography variant="h6" color={theme.palette.text.secondary} gutterBottom>
                Tổng Số Đơn Hàng
              </Typography>
              {loading ? (
                <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} />
              ) : (
                <Typography
                  variant="h4"
                  fontWeight={theme.typography.fontWeightBold}
                  color={theme.palette.text.primary}
                >
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
              borderRadius: theme.shape.borderRadius,
              background: theme.gradients.card,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows.md,
              transition: theme.animations.transition,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows.lg,
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: theme.gradients.primaryHover,
                  mx: 'auto',
                }}
              >
                <Users color={theme.palette.primary.main} size={28} />
              </Box>
              <Typography variant="h6" color={theme.palette.text.secondary} gutterBottom>
                Tổng Số Người Đặt
              </Typography>
              {loading ? (
                <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} />
              ) : (
                <Typography
                  variant="h4"
                  fontWeight={theme.typography.fontWeightBold}
                  color={theme.palette.text.primary}
                >
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
              borderRadius: theme.shape.borderRadius,
              background: theme.gradients.card,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows.md,
              transition: theme.animations.transition,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows.lg,
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: theme.gradients.primaryHover,
                  mx: 'auto',
                }}
              >
                <DollarSign color={theme.palette.primary.main} size={28} />
              </Box>
              <Typography variant="h6" color={theme.palette.text.secondary} gutterBottom>
                Tổng Doanh Thu
              </Typography>
              {loading ? (
                <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} />
              ) : (
                <Typography
                  variant="h4"
                  fontWeight={theme.typography.fontWeightBold}
                  color={theme.palette.text.primary}
                >
                  {totalSummary.totalRevenue.toLocaleString()} VND
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: theme.shape.borderRadius,
              background: theme.gradients.card,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows.md,
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                color={theme.palette.text.primary}
                fontWeight={theme.typography.fontWeightSemibold}
                gutterBottom
              >
                Doanh Thu Theo Ngày
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: theme.palette.primary.main }} />
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
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis dataKey="date" tick={{ fill: theme.palette.text.secondary }} />
                      <YAxis tick={{ fill: theme.palette.text.secondary }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: theme.shape.borderRadius,
                          boxShadow: theme.shadows.sm,
                          border: 'none',
                        }}
                        itemStyle={{ color: theme.palette.text.primary }}
                        cursor={{ strokeDasharray: '3 3' }}
                      />
                      <Legend wrapperStyle={{ color: theme.palette.text.secondary }} />
                      <Area
                        type="monotone"
                        dataKey="totalRevenue"
                        stroke={theme.palette.primary.main}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="Doanh Thu"
                        dot={{ stroke: theme.palette.primary.main, strokeWidth: 2, r: 4, fill: theme.palette.background.paper }}
                        activeDot={{ r: 6, stroke: theme.palette.primary.main, strokeWidth: 2, fill: theme.palette.background.paper }}
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
              borderRadius: theme.shape.borderRadius,
              background: theme.gradients.card,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows.md,
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                color={theme.palette.text.primary}
                fontWeight={theme.typography.fontWeightSemibold}
                gutterBottom
              >
                Số Lượng Đơn Hàng Theo Ngày
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: theme.palette.primary.main }} />
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
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis dataKey="date" tick={{ fill: theme.palette.text.secondary }} />
                      <YAxis sx={{ color: 'inherit' }} tick={{ fill: theme.palette.text.secondary }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: theme.shape.borderRadius,
                          boxShadow: theme.shadows.sm,
                          border: 'none',
                        }}
                        itemStyle={{ color: theme.palette.text.primary }}
                        cursor={{ fill: theme.gradients.primaryHover }}
                      />
                      <Legend wrapperStyle={{ color: theme.palette.text.secondary }} />
                      <Bar
                        dataKey="numOrders"
                        fill="url(#colorOrders)"
                        name="Số Đơn"
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
  );
}
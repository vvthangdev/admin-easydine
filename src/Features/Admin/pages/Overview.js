import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ShoppingCart, Users, DollarSign } from 'lucide-react';
import { orderAPI } from '../../../services/apis/Order';
import { message } from 'antd';

export default function OrderOverview() {
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
    <Box sx={{ p: 3, bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" color="text.primary" mb={4}>
        Tổng Quan Đơn Hàng
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShoppingCart color="#8884d8" size={32} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Tổng Số Đơn Hàng
              </Typography>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant="h5" fontWeight="bold">
                  {totalSummary.totalOrders}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Users color="#82ca9d" size={32} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Tổng Số Người Đặt
              </Typography>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant="h5" fontWeight="bold">
                  {totalSummary.totalPeople}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <DollarSign color="#ff7300" size={32} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Tổng Doanh Thu
              </Typography>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant="h5" fontWeight="bold">
                  {totalSummary.totalRevenue.toLocaleString()} VND
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Doanh Thu Theo Ngày
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <AreaChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#333' }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#82ca9d"
                    fillOpacity={0.6}
                    fill="#82ca9d"
                    name="Doanh Thu"
                    dot={{ stroke: '#82ca9d', strokeWidth: 2 }}
                  />
                </AreaChart>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Số Lượng Đơn Hàng Theo Ngày
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <BarChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#333' }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Legend />
                  <Bar dataKey="numOrders" fill="#8884d8" name="Số Đơn Hàng" />
                </BarChart>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
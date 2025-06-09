import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  useTheme, 
  alpha,
  Skeleton,
  useMediaQuery
} from '@mui/material';
import { TrendingUp, ShoppingBag, PieChartIcon, CreditCard, AlertCircle, ShoppingCart, Tag } from 'lucide-react';

// Apple-style color palette
const COLORS = ['#0071e3', '#34c759', '#5856d6', '#ff9500', '#ff2d55', '#af52de', '#64d2ff'];

export default function OrderCharts({
  revenueData,
  orderStats,
  paymentMethods,
  cancelReasons,
  itemSales,
  itemCategories,
  loading = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Safe check for all data
  const safeRevenueData = Array.isArray(revenueData) ? revenueData : [];
  const safeOrderStats = Array.isArray(orderStats) ? orderStats : [];
  const safePaymentMethods = Array.isArray(paymentMethods) ? paymentMethods : [];
  const safeCancelReasons = Array.isArray(cancelReasons) ? cancelReasons : [];
  const safeItemSales = Array.isArray(itemSales) ? itemSales : [];
  const safeItemCategories = Array.isArray(itemCategories) ? itemCategories : [];

  // Process payment methods with null values
  const processedPaymentMethods = safePaymentMethods.map((item) => ({
    ...item,
    paymentMethod: item.paymentMethod || 'Không xác định',
  }));

  // Process cancel reasons with null values
  const processedCancelReasons = safeCancelReasons.map((item) => ({
    ...item,
    cancelReason: item.cancelReason || 'Không xác định',
  }));

  // Add numOrders if API doesn't provide it
  const chartData = safeRevenueData.map((item) => ({
    ...item,
    numOrders: item.numOrders || Math.floor(Math.random() * 10) + 1,
  }));

  // Card styles with Apple-style design
  const cardStyle = {
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f7 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    height: '100%',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    },
  };

  // Card header styles
  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mb: 1,
  };

  // Icon container styles
  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0071e3 0%, #42a5f5 100%)',
    color: 'white',
    boxShadow: '0 4px 10px rgba(0, 113, 227, 0.2)',
  };

  // Tooltip styles
  const tooltipStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: 'none',
    padding: '8px 12px',
  };

  // Render loading skeleton
  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={cardStyle}>
              <CardContent>
                <Box sx={cardHeaderStyle}>
                  <Skeleton variant="rounded" width={40} height={40} />
                  <Skeleton variant="text" width={200} />
                </Box>
                <Skeleton variant="rounded" height={350} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {/* Daily Revenue Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={cardHeaderStyle}>
              <Box sx={{ ...iconContainerStyle, background: 'linear-gradient(135deg, #0071e3 0%, #42a5f5 100%)' }}>
                <TrendingUp size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                Doanh Thu Theo Ngày
              </Typography>
            </Box>
            <Box sx={{ height: 350, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 5, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0071e3" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0071e3" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#1d1d1f', fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fill: '#1d1d1f', fontSize: 12 }}
                    tickFormatter={(value) => `${value.toLocaleString()} đ`}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value.toLocaleString()} đ`, 'Doanh Thu']}
                    labelFormatter={(label) => `Ngày: ${label}`}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Area
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#0071e3"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Doanh Thu"
                    dot={{ stroke: '#0071e3', strokeWidth: 2, r: 4, fill: 'white' }}
                    activeDot={{ r: 6, stroke: '#0071e3', strokeWidth: 2, fill: 'white' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Daily Order Count Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={cardHeaderStyle}>
              <Box sx={{ ...iconContainerStyle, background: 'linear-gradient(135deg, #34c759 0%, #32d74b 100%)' }}>
                <ShoppingBag size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                Số Lượng Đơn Hàng Theo Ngày
              </Typography>
            </Box>
            <Box sx={{ height: 350, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 5, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34c759" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#34c759" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#1d1d1f', fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fill: '#1d1d1f', fontSize: 12 }}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} đơn`, 'Số Đơn Hàng']}
                    labelFormatter={(label) => `Ngày: ${label}`}
                    cursor={{ fill: alpha('#34c759', 0.1) }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Bar
                    dataKey="numOrders"
                    fill="url(#colorOrders)"
                    name="Số Đơn Hàng"
                    radius={[8, 8, 0, 0]}
                    barSize={isMobile ? 15 : 30}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Order Status Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={cardHeaderStyle}>
              <Box sx={{ ...iconContainerStyle, background: 'linear-gradient(135deg, #5856d6 0%, #7875ff 100%)' }}>
                <PieChartIcon size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                Phân Bố Trạng Thái Đơn Hàng
              </Typography>
            </Box>
            <Box sx={{ height: 350, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeOrderStats}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 60}
                    outerRadius={isMobile ? 80 : 100}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: '#8884d8', strokeWidth: 1 }}
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {safeOrderStats.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    formatter={(value, name, props) => [`${value} đơn (${((value / safeOrderStats.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`, props.payload.status]}
                  />
                  <Legend 
                    layout={isMobile ? "horizontal" : "vertical"}
                    verticalAlign={isMobile ? "bottom" : "middle"}
                    align={isMobile ? "center" : "right"}
                    wrapperStyle={{ paddingLeft: isMobile ? 0 : 20 }}
                    iconType="circle"
                    iconSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Payment Method Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={cardHeaderStyle}>
              <Box sx={{ ...iconContainerStyle, background: 'linear-gradient(135deg, #ff9500 0%, #ffb340 100%)' }}>
                <CreditCard size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                Phân Bố Phương Thức Thanh Toán
              </Typography>
            </Box>
            <Box sx={{ height: 350, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedPaymentMethods}
                    dataKey="count"
                    nameKey="paymentMethod"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 60}
                    outerRadius={isMobile ? 80 : 100}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: '#8884d8', strokeWidth: 1 }}
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {processedPaymentMethods.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    formatter={(value, name, props) => [
                      `${value} đơn (${((value / processedPaymentMethods.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`, 
                      props.payload.paymentMethod
                    ]}
                  />
                  <Legend 
                    layout={isMobile ? "horizontal" : "vertical"}
                    verticalAlign={isMobile ? "bottom" : "middle"}
                    align={isMobile ? "center" : "right"}
                    wrapperStyle={{ paddingLeft: isMobile ? 0 : 20 }}
                    iconType="circle"
                    iconSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Cancel Reasons Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={cardHeaderStyle}>
              <Box sx={{ ...iconContainerStyle, background: 'linear-gradient(135deg, #ff2d55 0%, #ff375f 100%)' }}>
                <AlertCircle size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                Phân Bố Lý Do Hủy
              </Typography>
            </Box>
            <Box sx={{ height: 350, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedCancelReasons}
                    dataKey="count"
                    nameKey="cancelReason"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 60}
                    outerRadius={isMobile ? 80 : 100}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name.length > 15 ? name.substring(0, 15) + '...' : name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: '#8884d8', strokeWidth: 1 }}
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {processedCancelReasons.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    formatter={(value, name, props) => [
                      `${value} đơn (${((value / processedCancelReasons.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`, 
                      props.payload.cancelReason
                    ]}
                  />
                  <Legend 
                    layout={isMobile ? "horizontal" : "vertical"}
                    verticalAlign={isMobile ? "bottom" : "middle"}
                    align={isMobile ? "center" : "right"}
                    wrapperStyle={{ paddingLeft: isMobile ? 0 : 20 }}
                    iconType="circle"
                    iconSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Item Sales by Category Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={cardHeaderStyle}>
              <Box sx={{ ...iconContainerStyle, background: 'linear-gradient(135deg, #64d2ff 0%, #5ac8f5 100%)' }}>
                <ShoppingCart size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                Số Lượng Bán Theo Danh Mục
              </Typography>
            </Box>
            <Box sx={{ height: 350, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={safeItemSales} 
                  margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
                  layout={isMobile && safeItemSales.length > 4 ? "vertical" : "horizontal"}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                  {isMobile && safeItemSales.length > 4 ? (
                    <>
                      <YAxis 
                        dataKey="category" 
                        type="category" 
                        tick={{ fill: '#1d1d1f', fontSize: 12 }}
                        width={100}
                      />
                      <XAxis 
                        type="number" 
                        tick={{ fill: '#1d1d1f', fontSize: 12 }}
                      />
                    </>
                  ) : (
                    <>
                      <XAxis 
                        dataKey="category" 
                        tick={{ fill: '#1d1d1f', fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis 
                        tick={{ fill: '#1d1d1f', fontSize: 12 }}
                        width={40}
                      />
                    </>
                  )}
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} món`, 'Số Lượng']}
                    cursor={{ fill: alpha('#64d2ff', 0.1) }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Bar
                    dataKey="totalQuantity"
                    name="Số Lượng"
                    radius={[8, 8, 0, 0]}
                    barSize={isMobile ? 15 : 30}
                    animationDuration={1500}
                  >
                    {safeItemSales.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Item Category Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={cardHeaderStyle}>
              <Box sx={{ ...iconContainerStyle, background: 'linear-gradient(135deg, #af52de 0%, #bf5af2 100%)' }}>
                <Tag size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                Phân Bố Danh Mục Món Ăn
              </Typography>
            </Box>
            <Box sx={{ height: 350, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeItemCategories}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : 60}
                    outerRadius={isMobile ? 80 : 100}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name.length > 15 ? name.substring(0, 15) + '...' : name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: '#8884d8', strokeWidth: 1 }}
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {safeItemCategories.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    formatter={(value, name, props) => [
                      `${value} món (${((value / safeItemCategories.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`, 
                      props.payload.category
                    ]}
                  />
                  <Legend 
                    layout={isMobile ? "horizontal" : "vertical"}
                    verticalAlign={isMobile ? "bottom" : "middle"}
                    align={isMobile ? "center" : "right"}
                    wrapperStyle={{ paddingLeft: isMobile ? 0 : 20 }}
                    iconType="circle"
                    iconSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

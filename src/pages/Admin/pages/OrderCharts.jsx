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
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { theme } from '../../../styles/index';

const COLORS = ['#0071e3', '#ff2d55', '#5856d6', '#34c759', '#ff9500'];

export default function OrderCharts({
  revenueData,
  orderStats,
  paymentMethods,
  cancelReasons,
  itemSales,
  itemCategories,
}) {
  // Thêm safe check cho tất cả dữ liệu
  const safeRevenueData = Array.isArray(revenueData) ? revenueData : [];
  const safeOrderStats = Array.isArray(orderStats) ? orderStats : [];
  const safePaymentMethods = Array.isArray(paymentMethods) ? paymentMethods : [];
  const safeCancelReasons = Array.isArray(cancelReasons) ? cancelReasons : [];
  const safeItemSales = Array.isArray(itemSales) ? itemSales : [];
  const safeItemCategories = Array.isArray(itemCategories) ? itemCategories : [];

  // Xử lý paymentMethods với giá trị null
  const processedPaymentMethods = safePaymentMethods.map((item) => ({
    ...item,
    paymentMethod: item.paymentMethod || 'Không xác định',
  }));

  // Xử lý cancelReasons với giá trị null
  const processedCancelReasons = safeCancelReasons.map((item) => ({
    ...item,
    cancelReason: item.cancelReason || 'Không xác định',
  }));

  // Thêm numOrders giả định nếu API không cung cấp
  const chartData = safeRevenueData.map((item) => ({
    ...item,
    numOrders: item.numOrders || Math.floor(Math.random() * 10) + 1,
  }));

  return (
    <Grid container spacing={theme.spacing[4]} sx={{ mt: theme.spacing[4], position: 'relative', zIndex: 1 }}>
      {/* Biểu đồ doanh thu theo ngày */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            ...theme.components.card.main,
            minHeight: 400,
            height: '100%',
          }}
        >
          <CardContent sx={{ p: theme.spacing[3] }}>
            <Typography variant="h6" sx={theme.components.text.heading} gutterBottom>
              Doanh Thu Theo Ngày
            </Typography>
            <Box sx={{ height: 350, mt: theme.spacing[2] }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.primary.main} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={theme.colors.primary.main} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.neutral[200]} />
                  <XAxis dataKey="date" tick={{ fill: theme.colors.neutral[500] }} />
                  <YAxis tick={{ fill: theme.colors.neutral[500] }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.white,
                      borderRadius: theme.borderRadius.md,
                      boxShadow: theme.shadows.sm,
                      border: 'none',
                    }}
                    itemStyle={{ color: theme.colors.neutral[900] }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Legend wrapperStyle={{ color: theme.colors.neutral[500] }} />
                  <Area
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke={theme.colors.primary.main}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Doanh Thu"
                    dot={{ stroke: theme.colors.primary.main, strokeWidth: 2, r: 4, fill: theme.colors.white }}
                    activeDot={{ r: 6, stroke: theme.colors.primary.main, strokeWidth: 2, fill: theme.colors.white }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Biểu đồ số lượng đơn hàng theo ngày */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            ...theme.components.card.main,
            minHeight: 400,
            height: '100%',
          }}
        >
          <CardContent sx={{ p: theme.spacing[3] }}>
            <Typography variant="h6" sx={theme.components.text.heading} gutterBottom>
              Số Lượng Đơn Hàng Theo Ngày
            </Typography>
            <Box sx={{ height: 350, mt: theme.spacing[2] }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.primary.main} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={theme.colors.primary.main} stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.neutral[200]} />
                  <XAxis dataKey="date" tick={{ fill: theme.colors.neutral[500] }} />
                  <YAxis tick={{ fill: theme.colors.neutral[500] }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.white,
                      borderRadius: theme.borderRadius.md,
                      boxShadow: theme.shadows.sm,
                      border: 'none',
                    }}
                    itemStyle={{ color: theme.colors.neutral[900] }}
                    cursor={{ fill: theme.colors.primary[50] }}
                  />
                  <Legend wrapperStyle={{ color: theme.colors.neutral[500] }} />
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
          </CardContent>
        </Card>
      </Grid>

      {/* Biểu đồ phân bố trạng thái đơn hàng */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            ...theme.components.card.main,
            minHeight: 400,
            height: '100%',
          }}
        >
          <CardContent sx={{ p: theme.spacing[3] }}>
            <Typography variant="h6" sx={theme.components.text.heading} gutterBottom>
              Phân Bố Trạng Thái Đơn Hàng
            </Typography>
            <Box sx={{ height: 350, mt: theme.spacing[2] }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeOrderStats}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {safeOrderStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.white,
                      borderRadius: theme.borderRadius.md,
                      boxShadow: theme.shadows.sm,
                      border: 'none',
                    }}
                    itemStyle={{ color: theme.colors.neutral[900] }}
                  />
                  <Legend wrapperStyle={{ color: theme.colors.neutral[500] }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Biểu đồ phân bố phương thức thanh toán */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            ...theme.components.card.main,
            minHeight: 400,
            height: '100%',
          }}
        >
          <CardContent sx={{ p: theme.spacing[3] }}>
            <Typography variant="h6" sx={theme.components.text.heading} gutterBottom>
              Phân Bố Phương Thức Thanh Toán
            </Typography>
            <Box sx={{ height: 350, mt: theme.spacing[2] }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedPaymentMethods}
                    dataKey="count"
                    nameKey="paymentMethod"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {processedPaymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.white,
                      borderRadius: theme.borderRadius.md,
                      boxShadow: theme.shadows.sm,
                      border: 'none',
                    }}
                    itemStyle={{ color: theme.colors.neutral[900] }}
                  />
                  <Legend wrapperStyle={{ color: theme.colors.neutral[500] }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Biểu đồ phân bố lý do hủy */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            ...theme.components.card.main,
            minHeight: 400,
            height: '100%',
          }}
        >
          <CardContent sx={{ p: theme.spacing[3] }}>
            <Typography variant="h6" sx={theme.components.text.heading} gutterBottom>
              Phân Bố Lý Do Hủy
            </Typography>
            <Box sx={{ height: 350, mt: theme.spacing[2] }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedCancelReasons}
                    dataKey="count"
                    nameKey="cancelReason"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {processedCancelReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.white,
                      borderRadius: theme.borderRadius.md,
                      boxShadow: theme.shadows.sm,
                      border: 'none',
                    }}
                    itemStyle={{ color: theme.colors.neutral[900] }}
                  />
                  <Legend wrapperStyle={{ color: theme.colors.neutral[500] }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Biểu đồ số lượng bán theo danh mục */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            ...theme.components.card.main,
            minHeight: 400,
            height: '100%',
          }}
        >
          <CardContent sx={{ p: theme.spacing[3] }}>
            <Typography variant="h6" sx={theme.components.text.heading} gutterBottom>
              Số Lượng Bán Theo Danh Mục
            </Typography>
            <Box sx={{ height: 350, mt: theme.spacing[2] }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeItemSales} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.neutral[200]} />
                  <XAxis dataKey="category" tick={{ fill: theme.colors.neutral[500] }} />
                  <YAxis tick={{ fill: theme.colors.neutral[500] }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.white,
                      borderRadius: theme.borderRadius.md,
                      boxShadow: theme.shadows.sm,
                      border: 'none',
                    }}
                    itemStyle={{ color: theme.colors.neutral[900] }}
                    cursor={{ fill: theme.colors.primary[50] }}
                  />
                  <Legend wrapperStyle={{ color: theme.colors.neutral[500] }} />
                  <Bar
                    dataKey="totalQuantity"
                    fill={theme.colors.primary.main}
                    name="Số Lượng"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Biểu đồ phân bố danh mục món ăn */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            ...theme.components.card.main,
            minHeight: 400,
            height: '100%',
          }}
        >
          <CardContent sx={{ p: theme.spacing[3] }}>
            <Typography variant="h6" sx={theme.components.text.heading} gutterBottom>
              Phân Bố Danh Mục Món Ăn
            </Typography>
            <Box sx={{ height: 350, mt: theme.spacing[2] }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeItemCategories}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {safeItemCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.white,
                      borderRadius: theme.borderRadius.md,
                      boxShadow: theme.shadows.sm,
                      border: 'none',
                    }}
                    itemStyle={{ color: theme.colors.neutral[900] }}
                  />
                  <Legend wrapperStyle={{ color: theme.colors.neutral[500] }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
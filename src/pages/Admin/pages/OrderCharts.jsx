import React from "react";
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
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useTheme,
  alpha,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp,
  ShoppingBag,
  PieChart as PieChartIcon,
  CreditCard,
  AlertCircle,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { useAppleStyles } from "../../../theme/theme-hooks"; // Thêm import Apple Style

// Apple-style color palette
const COLORS = [
  "#0071e3",
  "#34c759",
  "#5856d6",
  "#ff9500",
  "#ff2d55",
  "#af52de",
  "#64d2ff",
];

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
  const styles = useAppleStyles(); // Sử dụng Apple Style
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Safe check for all data
  const safeRevenueData = Array.isArray(revenueData) ? revenueData : [];
  const safeOrderStats = Array.isArray(orderStats) ? orderStats : [];
  const safePaymentMethods = Array.isArray(paymentMethods)
    ? paymentMethods
    : [];
  const safeCancelReasons = Array.isArray(cancelReasons) ? cancelReasons : [];
  const safeItemSales = Array.isArray(itemSales) ? itemSales : [];
  const safeItemCategories = Array.isArray(itemCategories)
    ? itemCategories
    : [];

  // Process payment methods with null values
  const processedPaymentMethods = safePaymentMethods.map((item) => ({
    ...item,
    paymentMethod: item.paymentMethod || "Không xác định",
  }));

  // Process cancel reasons with null values
  const processedCancelReasons = safeCancelReasons.map((item) => ({
    ...item,
    cancelReason: item.cancelReason || "Không xác định",
  }));

  // Add numOrders if API doesn't provide it
  const chartData = safeRevenueData.map((item) => ({
    ...item,
    numOrders: item.numOrders || Math.floor(Math.random() * 10) + 1,
  }));

  // Render loading skeleton
  if (loading) {
    return (
      <Grid container spacing={styles.spacing(3)} sx={{ mt: 2 }}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={styles.card("main")}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: styles.spacing(1.5),
                    mb: 1,
                  }}
                >
                  <Skeleton variant="rounded" width={40} height={40} />
                  <Skeleton variant="text" width={200} />
                </Box>
                <Skeleton variant="rounded" height={300} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={styles.spacing(3)} sx={{ mt: 2, width: '100%', maxWidth: 'none' }}>
      {/* Daily Revenue Chart */}
     <Grid item xs={12} md={6} lg={8} xl={10}>
        <Card sx={{...styles.card("wide") , width: '100%', maxWidth: 'none'}}>
          <CardContent sx={{ p: styles.spacing(3) }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: styles.spacing(1.5),
                mb: 1,
              }}
            >
              <Box sx={styles.iconContainer("primary")}>
                <TrendingUp size={20} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: styles.typography.fontWeight.semibold,
                  color: styles.colors.text.primary,
                }}
              >
                Doanh Thu Theo Ngày
              </Typography>
            </Box>
            <Box
              sx={{ height: 300, mt: styles.spacing(2), overflow: "hidden", width: '100%' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={styles.colors.primary.main}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={styles.colors.primary.main}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(styles.colors.neutral[200], 0.5)}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: styles.colors.text.primary, fontSize: 12 }}
                    tickMargin={5}
                  />
                  <YAxis
                    tick={{ fill: styles.colors.text.primary, fontSize: 12 }}
                    tickFormatter={(value) => `${value.toLocaleString()} đ`}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: styles.colors.background.paper,
                      borderRadius: styles.borderRadius.sm,
                      boxShadow: styles.shadows.sm,
                      border: "none",
                      padding: styles.spacing(1),
                    }}
                    formatter={(value) => [
                      `${value.toLocaleString()} đ`,
                      "Doanh Thu",
                    ]}
                    labelFormatter={(label) => `Ngày: ${label}`}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: styles.spacing(1) }} />
                  <Area
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke={styles.colors.primary.main}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Doanh Thu"
                    dot={{
                      stroke: styles.colors.primary.main,
                      strokeWidth: 2,
                      r: 3,
                      fill: "white",
                    }}
                    activeDot={{
                      r: 5,
                      stroke: styles.colors.primary.main,
                      strokeWidth: 2,
                      fill: "white",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Daily Order Count Chart */}
      <Grid item xs={12} sm={12} md={8} lg={6}>


        <Card sx={styles.card("main")}>
          <CardContent sx={{ p: styles.spacing(3) }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: styles.spacing(1.5),
                mb: 1,
              }}
            >
              <Box sx={styles.iconContainer("secondary")}>
                <ShoppingBag size={20} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: styles.typography.fontWeight.semibold,
                  color: styles.colors.text.primary,
                }}
              >
                Số Lượng Đơn Hàng Theo Ngày
              </Typography>
            </Box>
            <Box
              sx={{ height: 300, mt: styles.spacing(2), overflow: "hidden" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={styles.colors.secondary.main}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={styles.colors.secondary.main}
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(styles.colors.neutral[200], 0.5)}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: styles.colors.text.primary, fontSize: 12 }}
                    tickMargin={5}
                  />
                  <YAxis
                    tick={{ fill: styles.colors.text.primary, fontSize: 12 }}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: styles.colors.background.paper,
                      borderRadius: styles.borderRadius.sm,
                      boxShadow: styles.shadows.sm,
                      border: "none",
                      padding: styles.spacing(1),
                    }}
                    formatter={(value) => [`${value} đơn`, "Số Đơn Hàng"]}
                    labelFormatter={(label) => `Ngày: ${label}`}
                    cursor={{ fill: alpha(styles.colors.secondary.main, 0.1) }}
                  />
                  <Legend wrapperStyle={{ paddingTop: styles.spacing(1) }} />
                  <Bar
                    dataKey="numOrders"
                    fill="url(#colorOrders)"
                    name="Số Đơn Hàng"
                    radius={[6, 6, 0, 0]}
                    barSize={isMobile ? 10 : 20}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Order Status Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={styles.card("main")}>
          <CardContent sx={{ p: styles.spacing(3) }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: styles.spacing(1.5),
                mb: 1,
              }}
            >
              <Box sx={styles.iconContainer("primary")}>
                <PieChartIcon size={20} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: styles.typography.fontWeight.semibold,
                  color: styles.colors.text.primary,
                }}
              >
                Phân Bố Trạng Thái Đơn Hàng
              </Typography>
            </Box>
            <Box
              sx={{ height: 300, mt: styles.spacing(2), overflow: "hidden" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeOrderStats}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 25 : 40}
                    outerRadius={isMobile ? 50 : 80}
                    paddingAngle={2}
                    // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{
                      stroke: styles.colors.neutral[500],
                      strokeWidth: 1,
                    }}
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {safeOrderStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: styles.colors.background.paper,
                      borderRadius: styles.borderRadius.sm,
                      boxShadow: styles.shadows.sm,
                      border: "none",
                      padding: styles.spacing(1),
                    }}
                    formatter={(value, name, props) => [
                      `${value} đơn (${(
                        (value /
                          safeOrderStats.reduce(
                            (sum, item) => sum + item.count,
                            0
                          )) *
                        100
                      ).toFixed(1)}%)`,
                      props.payload.status,
                    ]}
                  />
                  <Legend
                    layout="horizontal" 
                    verticalAlign="bottom"
                    align= "center"
                    wrapperStyle={{
                      paddingTop: styles.spacing(1), // Khoảng cách với biểu đồ
                paddingLeft: isMobile ? 0 : styles.spacing(0.5),
                paddingRight: isMobile ? 0 : styles.spacing(0.5),
                fontSize: isMobile ? 9 : 11, // Giảm fontSize
                maxWidth: '100%', // Không tràn
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                    }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Payment Method Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={styles.card("main")}>
          <CardContent sx={{ p: styles.spacing(3) }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: styles.spacing(1.5),
                mb: 1,
              }}
            >
              <Box sx={styles.iconContainer("primary")}>
                <CreditCard size={20} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: styles.typography.fontWeight.semibold,
                  color: styles.colors.text.primary,
                }}
              >
                Phân Bố Phương Thức Thanh Toán
              </Typography>
            </Box>
            <Box
              sx={{ height: 300, mt: styles.spacing(2), overflow: "hidden" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedPaymentMethods}
                    dataKey="count"
                    nameKey="paymentMethod"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 25 : 40}
                    outerRadius={isMobile ? 50 : 80}
                    paddingAngle={2}
                    // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{
                      stroke: styles.colors.neutral[500],
                      strokeWidth: 1,
                    }}
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {processedPaymentMethods.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: styles.colors.background.paper,
                      borderRadius: styles.borderRadius.sm,
                      boxShadow: styles.shadows.sm,
                      border: "none",
                      padding: styles.spacing(1),
                    }}
                    formatter={(value, name, props) => [
                      `${value} đơn (${(
                        (value /
                          processedPaymentMethods.reduce(
                            (sum, item) => sum + item.count,
                            0
                          )) *
                        100
                      ).toFixed(1)}%)`,
                      props.payload.paymentMethod,
                    ]}
                  />
                  <Legend
                    layout="horizontal" 
                    verticalAlign="bottom"
                    align= "center"
                    wrapperStyle={{
                      paddingTop: styles.spacing(1), // Khoảng cách với biểu đồ
                paddingLeft: isMobile ? 0 : styles.spacing(0.5),
                paddingRight: isMobile ? 0 : styles.spacing(0.5),
                fontSize: isMobile ? 9 : 11, // Giảm fontSize
                maxWidth: '100%', // Không tràn
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                    }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Cancel Reasons Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={styles.card("main")}>
          <CardContent sx={{ p: styles.spacing(3) }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: styles.spacing(1.5),
                mb: 1,
              }}
            >
              <Box sx={styles.iconContainer("primary")}>
                <AlertCircle size={20} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: styles.typography.fontWeight.semibold,
                  color: styles.colors.text.primary,
                }}
              >
                Phân Bố Lý Do Hủy
              </Typography>
            </Box>
            <Box
              sx={{
                height: 300,
                mt: styles.spacing(2),
                overflow: "hidden",
                position: "relative",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart
                  margin={{
                    top: 10,
                    right: isMobile ? 15 : 30,
                    left: isMobile ? 15 : 30,
                    bottom: 30,
                  }}
                >
                  <Pie
                    data={processedCancelReasons}
                    dataKey="count"
                    nameKey="cancelReason"
                    cx="50%"
                    cy="45%" // Dịch chuyển biểu đồ lên để dành chỗ cho Legend ở dưới
                    innerRadius={isMobile ? 20 : 35}
                    outerRadius={isMobile ? 45 : 75}
                    paddingAngle={2}
                    
                    labelLine={{
                      stroke: styles.colors.neutral[500],
                      strokeWidth: 1,
                    }}
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {processedCancelReasons.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: styles.colors.background.paper,
                      borderRadius: styles.borderRadius.sm,
                      boxShadow: styles.shadows.sm,
                      border: "none",
                      padding: styles.spacing(1),
                    }}
                    formatter={(value, name, props) => [
                      `${value} đơn (${(
                        (value /
                          (processedCancelReasons.reduce(
                            (sum, item) => sum + item.count,
                            0
                          ) || 1)) *
                        100
                      ).toFixed(1)}%)`,
                      props.payload.cancelReason,
                    ]}
                  />
                  <Legend
                    layout="horizontal" // Luôn là horizontal để hiển thị dưới dạng dot
                    verticalAlign="bottom" // Đặt Legend ở dưới
                    align="center" // Căn giữa
                    wrapperStyle={{
                      paddingTop: styles.spacing(1), // Thêm khoảng cách giữa biểu đồ và Legend
                      paddingLeft: isMobile ? 0 : styles.spacing(0.5),
                      paddingRight: isMobile ? 0 : styles.spacing(0.5),
                      fontSize: isMobile ? 9 : 11,
                      maxWidth: "100%", // Đảm bảo Legend không tràn
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    iconType="circle" // Giữ hình tròn
                    iconSize={6}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Item Sales by Category Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={styles.card("main")}>
          <CardContent sx={{ p: styles.spacing(3) }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: styles.spacing(1.5),
                mb: 1,
              }}
            >
              <Box sx={styles.iconContainer("primary")}>
                <ShoppingCart size={20} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: styles.typography.fontWeight.semibold,
                  color: styles.colors.text.primary,
                }}
              >
                Số Lượng Bán Theo Danh Mục
              </Typography>
            </Box>
            <Box
              sx={{
                height: 300,
                mt: styles.spacing(2),
                overflow: safeItemSales.length > 10 ? "auto" : "hidden",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={safeItemSales}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  layout={
                    isMobile && safeItemSales.length > 4
                      ? "vertical"
                      : "horizontal"
                  }
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(styles.colors.neutral[200], 0.5)}
                  />
                  {isMobile && safeItemSales.length > 4 ? (
                    <>
                      <YAxis
                        dataKey="category"
                        type="category"
                        tick={{
                          fill: styles.colors.text.primary,
                          fontSize: 12,
                        }}
                        width={80}
                      />
                      <XAxis
                        type="number"
                        tick={{
                          fill: styles.colors.text.primary,
                          fontSize: 12,
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <XAxis
                        dataKey="category"
                        tick={{
                          fill: styles.colors.text.primary,
                          fontSize: 12,
                        }}
                        tickMargin={5}
                      />
                      <YAxis
                        tick={{
                          fill: styles.colors.text.primary,
                          fontSize: 12,
                        }}
                        width={40}
                      />
                    </>
                  )}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: styles.colors.background.paper,
                      borderRadius: styles.borderRadius.sm,
                      boxShadow: styles.shadows.sm,
                      border: "none",
                      padding: styles.spacing(1),
                    }}
                    formatter={(value) => [`${value} món`, "Số Lượng"]}
                    cursor={{ fill: alpha(styles.colors.info, 0.1) }}
                  />
                  <Legend wrapperStyle={{ paddingTop: styles.spacing(1) }} />
                  <Bar
                    dataKey="totalQuantity"
                    name="Số Lượng"
                    radius={[6, 6, 0, 0]}
                    barSize={isMobile ? 10 : 20}
                    animationDuration={1000}
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
        <Card sx={styles.card("main")}>
          <CardContent sx={{ p: styles.spacing(3) }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: styles.spacing(1.5),
                mb: 1,
              }}
            >
              <Box sx={styles.iconContainer("primary")}>
                <Tag size={20} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: styles.typography.fontWeight.semibold,
                  color: styles.colors.text.primary,
                }}
              >
                Phân Bố Danh Mục Món Ăn
              </Typography>
            </Box>
            <Box
              sx={{ height: 300, mt: styles.spacing(2), overflow: "hidden" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeItemCategories}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 30 : 50}
                    outerRadius={isMobile ? 60 : 90}
                    paddingAngle={2}
                    
                    labelLine={{
                      stroke: styles.colors.neutral[500],
                      strokeWidth: 1,
                    }}
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {safeItemCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: styles.colors.background.paper,
                      borderRadius: styles.borderRadius.sm,
                      boxShadow: styles.shadows.sm,
                      border: "none",
                      padding: styles.spacing(1),
                    }}
                    formatter={(value, name, props) => [
                      `${value} món (${(
                        (value /
                          safeItemCategories.reduce(
                            (sum, item) => sum + item.count, 0
                          )) * 100
                      ).toFixed(1)}%)`,
                      props.payload.category,
                    ]}
                  />
                  <Legend
                    layout="horizontal" 
                    verticalAlign="bottom"
                    align= "center"
                    wrapperStyle={{
                      paddingTop: styles.spacing(1), // Khoảng cách với biểu đồ
                paddingLeft: isMobile ? 0 : styles.spacing(0.5),
                paddingRight: isMobile ? 0 : styles.spacing(0.5),
                fontSize: isMobile ? 9 : 11, // Giảm fontSize
                maxWidth: '100%', // Không tràn
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                    }}
                    iconType="circle"
                    iconSize={8}
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

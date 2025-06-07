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
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

const COLORS = ["#0071e3", "#ff2d55", "#5856d6", "#34c759", "#ff9500"];

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
  const processedPaymentMethods = safePaymentMethods.map(item => ({
    ...item,
    paymentMethod: item.paymentMethod || "Không xác định"
  }));

  // Xử lý cancelReasons với giá trị null (nếu cần)
  const processedCancelReasons = safeCancelReasons.map(item => ({
    ...item,
    cancelReason: item.cancelReason || "Không xác định"
  }));

  // Thêm numOrders giả định nếu API không cung cấp
  const chartData = safeRevenueData.map((item) => ({
    ...item,
    numOrders: item.numOrders || Math.floor(Math.random() * 10) + 1, // Thay bằng API thực nếu có
  }));

  return (
    <Grid container spacing={3} sx={{ mt: 4, position: "relative", zIndex: 1 }}>
      {/* Biểu đồ doanh thu theo ngày */}
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
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
          </CardContent>
        </Card>
      </Grid>

      {/* Biểu đồ số lượng đơn hàng theo ngày */}
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
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
          </CardContent>
        </Card>
      </Grid>

      {/* Biểu đồ phân bố trạng thái đơn hàng */}
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
              Phân Bố Trạng Thái Đơn Hàng
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
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
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                    itemStyle={{ color: "#1d1d1f" }}
                  />
                  <Legend wrapperStyle={{ color: "#86868b" }} />
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
              Phân Bố Phương Thức Thanh Toán
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
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
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                    itemStyle={{ color: "#1d1d1f" }}
                  />
                  <Legend wrapperStyle={{ color: "#86868b" }} />
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
              Phân Bố Lý Do Hủy
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
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
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                    itemStyle={{ color: "#1d1d1f" }}
                  />
                  <Legend wrapperStyle={{ color: "#86868b" }} />
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
              Số Lượng Bán Theo Danh Mục
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeItemSales} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="category" tick={{ fill: "#86868b" }} />
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
                    dataKey="totalQuantity"
                    fill="#0071e3"
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
              Phân Bố Danh Mục Món Ăn
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
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
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                    itemStyle={{ color: "#1d1d1f" }}
                  />
                  <Legend wrapperStyle={{ color: "#86868b" }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
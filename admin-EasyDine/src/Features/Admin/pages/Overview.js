import React, { useEffect, useState } from "react";
import { Row, Col, Card, message, Spin } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { orderAPI } from "../../../services/apis/Order"; // Giả định API đơn hàng

export default function Overview() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tất cả đơn hàng từ API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getAllOrders(); // Giả định API trả về danh sách đơn hàng
      setOrders(response);
    } catch (error) {
      message.error("Không thể tải dữ liệu đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Xử lý dữ liệu để hiển thị trên biểu đồ
  const processDataForChart = () => {
    const groupedData = orders.reduce((acc, order) => {
      const date = order.time.split("T")[0]; // Lấy ngày từ time (YYYY-MM-DD)
      if (!acc[date]) {
        acc[date] = { date, numOrders: 0, totalPeople: 0 };
      }
      acc[date].numOrders += 1;
      acc[date].totalPeople += order.num_people || 0;
      return acc;
    }, {});

    return Object.values(groupedData); // Chuyển object thành array để hiển thị biểu đồ
  };

  const chartData = processDataForChart();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tổng Quan</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Tổng Số Đơn Hàng" bordered>
            <Spin spinning={loading}>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>{orders.length}</p>
            </Spin>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tổng Số Người Đặt" bordered>
            <Spin spinning={loading}>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                {orders.reduce((acc, order) => acc + (order.num_people || 0), 0)}
              </p>
            </Spin>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Biểu Đồ Đặt Chỗ Theo Ngày" bordered>
            <Spin spinning={loading}>
              <BarChart
                width={800}
                height={400}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="numOrders" fill="#8884d8" name="Số Đơn Hàng" />
                <Bar dataKey="totalPeople" fill="#82ca9d" name="Số Người Đặt" />
              </BarChart>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  InputNumber,
  Tabs,
} from "antd";
import moment from "moment"; // Import moment
import { orderAPI } from "../../../services/apis/Order"; // Assuming you have an API for orders

const { TabPane } = Tabs;

export default function OrderManagements() {
  const [orders, setOrders] = useState({ ship: [], reservation: [] });
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reservation"); // State to track active tab

  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const handleViewDetails = async (id) => {
    try {
      console.log("Fetching details for order ID:", id); // Kiểm tra ID truyền vào
      const response = await orderAPI.getOrderDetails(id); // Gọi API
      console.log("Order details:", response); // Log dữ liệu trả về từ API
      setOrderDetails(response); // Lưu dữ liệu trả về vào state
      setDetailsModalVisible(true); // Hiển thị modal
    } catch (error) {
      message.error("Không thể lấy thông tin chi tiết đơn hàng");
      console.error("Error fetching order details:", error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getAllOrders(); // Fetch all orders
      // Separate orders into ship and reservation
      const shipOrders = response.filter((order) => order.type === "ship");
      const reservationOrders = response.filter(
        (order) => order.type === "reservation"
      );
      setOrders({ reservation: reservationOrders, ship: shipOrders });
      console.log("Fetched orders:", { shipOrders, reservationOrders });
    } catch (error) {
      setError("Cannot load orders");
      message.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      render: (text) => (
        <span>{moment.utc(text).format("DD/MM/YYYY HH:mm:ss")}</span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Loại Đơn Hàng",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          >
            Sửa
          </Button>
          <Button
            type="link"
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-800"
          >
            Xóa
          </Button>
          <Button
            type="link"
            onClick={() => handleViewDetails(record.id)} // Thêm nút Xem Chi Tiết
            className="text-green-600 hover:text-green-800"
          >
            Xem Chi Tiết
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingOrder(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await orderAPI.deleteOrder(record.id); // Delete order
      setOrders((prevOrders) => ({
        ...prevOrders,
        [record.type]: prevOrders[record.type].filter(
          (order) => order.id !== record.id
        ),
      }));
      message.success("Deleted order successfully");
    } catch (error) {
      message.error("Failed to delete order");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingOrder) {
        // Update order
        await orderAPI.updateOrder({ ...values, id: editingOrder.id });
        setOrders((prevOrders) => ({
          ...prevOrders,
          [editingOrder.type]: prevOrders[editingOrder.type].map((order) =>
            order.id === editingOrder.id ? { ...order, ...values } : order
          ),
        }));
        message.success("Updated order successfully");
      } else {
        // Add new order
        const newOrder = await orderAPI.addOrder(values);
        setOrders((prevOrders) => ({
          ...prevOrders,
          [newOrder.type]: [...prevOrders[newOrder.type], newOrder],
        }));
        message.success("Added new order successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding/updating order:", error);
      message.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản Lý Đơn Hàng
        </h1>
        <Button
          type="primary"
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Thêm Đơn Hàng Mới
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Đơn Hàng Đặt Chỗ" key="reservation">
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <Table
              columns={columns}
              dataSource={orders.reservation}
              rowKey="id"
              loading={loading}
              className="w-full"
              pagination={{ pageSize: 5 }} // Add pagination
            />
          </div>
        </TabPane>
        <TabPane tab="Đơn Hàng Giao Hàng" key="ship">
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <Table
              columns={columns}
              dataSource={orders.ship}
              rowKey="id"
              loading={loading}
              className="w-full"
              pagination={{ pageSize: 5 }} // Add pagination
            />
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title="Chi Tiết Đơn Hàng"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {orderDetails ? (
          <div>
            {/* Reserved Tables */}
            <h3>Danh Sách Bàn Đặt:</h3>
            {orderDetails.reservedTables.length > 0 ? (
              <ul>
                {orderDetails.reservedTables.map((table) => (
                  <li key={table.id}>
                    <b>Bàn:</b> {table.table_id}, <b>Thời gian:</b>{" "}
                    {`${moment
                      .utc(table.start_time)
                      .local()
                      .format("HH:mm:ss")} - ${moment
                      .utc(table.end_time)
                      .local()
                      .format("HH:mm:ss")}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có bàn đặt nào.</p>
            )}

            {/* Item Orders */}
            <h3>Danh Sách Mặt Hàng:</h3>
            {orderDetails.itemOrders.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {orderDetails.itemOrders.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "8px",
                    }}
                  >
                    <img
                      src={item.itemImage}
                      alt={item.itemName}
                      style={{
                        width: "80px",
                        height: "80px",
                        marginRight: "16px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <p>
                        <b>Tên:</b> {item.itemName}
                      </p>
                      <p>
                        <b>Giá:</b> {item.itemPrice.toLocaleString()} VND
                      </p>
                      <p>
                        <b>Số Lượng:</b> {item.quantity}
                      </p>
                      <p>
                        <b>Tổng Tiền:</b>{" "}
                        {(item.itemPrice * item.quantity).toLocaleString()} VND
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có mặt hàng nào được đặt.</p>
            )}
          </div>
        ) : (
          <p>Đang tải thông tin chi tiết...</p>
        )}
      </Modal>

      <Modal
        title={editingOrder ? "Sửa Đơn Hàng" : "Thêm Đơn Hàng Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        className="rounded-lg"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="customerName"
            label="Tên Khách Hàng"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng!" },
            ]}
          >
            <Input
              placeholder="Nhập tên khách hàng"
              className="border rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="totalAmount"
            label="Tổng Số Tiền"
            rules={[{ required: true, message: "Vui lòng nhập tổng số tiền!" }]}
          >
            <InputNumber
              className="w-full border rounded-md"
              placeholder="Nhập tổng số tiền"
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng Thái"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái đơn hàng!" },
            ]}
          >
            <Input
              placeholder="Nhập trạng thái đơn hàng"
              className="border rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="type" // New field for order type
            label="Loại Đơn Hàng"
            rules={[
              { required: true, message: "Vui lòng nhập loại đơn hàng!" },
            ]}
          >
            <Input
              placeholder="Nhập loại đơn hàng"
              className="border rounded-md"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Table, Button, Modal, message, Tabs, Space, Select } from "antd";
import moment from "moment";
import { orderAPI } from "../../services/apis/Order";
import { adminAPI } from "../../services/apis/Admin";
import OrderFormModalView from "../OrderFormModal/OrderFormModalView";

const { TabPane } = Tabs;

const OrderList = ({ selectedCustomer, onClearFilter }) => {
  const [orders, setOrders] = useState({ ship: [], reservation: [] });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reservation");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const customerCache = useRef({});

  const fetchOrders = useCallback(async (customerId = null) => {
    setLoading(true);
    try {
      const response = customerId
        ? await orderAPI.searchOrdersByCustomer(customerId)
        : await orderAPI.getAllOrders();
      const ordersData = response || [];

      const uniqueCustomerIds = [
        ...new Set(ordersData.map((order) => order.customer_id)),
      ];

      const customerDetailsPromises = uniqueCustomerIds.map(async (id) => {
        if (customerCache.current[id]) {
          return { id, data: customerCache.current[id] };
        }
        try {
          const customerResponse = await adminAPI.getCustomerDetails(id);
          customerCache.current[id] = customerResponse;
          return { id, data: customerResponse };
        } catch (error) {
          console.error(`Error fetching customer ${id}:`, error);
          return {
            id,
            data: { name: "Không xác định", phone: "Không xác định" },
          };
        }
      });

      const customerDetailsResults = await Promise.all(customerDetailsPromises);
      const customerMap = customerDetailsResults.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {});

      const ordersWithCustomerDetails = ordersData.map((order) => ({
        ...order,
        id: order._id,
        customerName: customerMap[order.customer_id]?.name || "Không xác định",
        customerPhone:
          customerMap[order.customer_id]?.phone || "Không xác định",
        customerId: order.customer_id,
      }));

      const sortedOrders = ordersWithCustomerDetails.sort((a, b) =>
        moment(b.time).diff(moment(a.time))
      );
      setOrders({
        reservation: sortedOrders.filter(
          (order) => order.type === "reservation"
        ),
        ship: sortedOrders.filter((order) => order.type === "ship"),
      });
    } catch (error) {
      message.error("Lỗi khi tải danh sách đơn hàng");
      setOrders({ ship: [], reservation: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(selectedCustomer?._id);
  }, [selectedCustomer, fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId || !newStatus) {
      message.error("Dữ liệu trạng thái hoặc ID đơn hàng không hợp lệ");
      return;
    }

    try {
      const currentOrder =
        orders.reservation.find((o) => o.id === orderId) ||
        orders.ship.find((o) => o.id === orderId);

      if (!currentOrder) {
        try {
          const response = await orderAPI.getOrderInfo({ id: orderId });
          if (response && response.order) {
            const updatedOrderData = {
              id: orderId,
              status: newStatus,
              type: response.order.type,
            };
            await orderAPI.updateOrder(updatedOrderData);
            message.success("Cập nhật trạng thái thành công");
            fetchOrders(selectedCustomer?._id);
          } else {
            message.error("Không tìm thấy đơn hàng để cập nhật");
          }
        } catch (error) {
          console.error("Error fetching order info:", error);
          message.error("Không thể lấy thông tin đơn hàng");
        }
        return;
      }

      const updatedOrderData = {
        id: orderId,
        status: newStatus,
        type: currentOrder.type,
      };
      await orderAPI.updateOrder(updatedOrderData);
      message.success("Cập nhật trạng thái thành công");
      fetchOrders(selectedCustomer?._id);
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handleViewCustomerDetails = async (customerId) => {
    try {
      let customerData;
      if (customerCache.current[customerId]) {
        customerData = customerCache.current[customerId];
      } else {
        customerData = await adminAPI.getCustomerDetails(customerId);
        customerCache.current[customerId] = customerData;
      }
      setCustomerDetails(customerData);
      setCustomerModalVisible(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      message.error("Không thể lấy thông tin chi tiết khách hàng");
    }
  };

  const handleAdd = () => {
    setEditingOrder(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingOrder(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa đơn hàng",
      content: `Bạn có chắc chắn muốn xóa đơn hàng ${record.id}?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await orderAPI.deleteOrder(record.id);
          setOrders((prev) => ({
            ...prev,
            [record.type]: prev[record.type].filter(
              (order) => order.id !== record.id
            ),
          }));
          message.success(`Xóa đơn hàng ${record.id} thành công`);
        } catch (error) {
          console.error("Error deleting order:", error);
          message.error("Xóa đơn hàng không thành công");
        }
      },
    });
  };

  const handleSubmitOrder = async (orderData) => {
    try {
      if (orderData.id) {
        await orderAPI.updateOrder(orderData);
        message.success("Cập nhật đơn hàng thành công");
      } else {
        const response = await orderAPI.createOrder(orderData);
        if (!response || !response._id) {
          throw new Error("Invalid response: Order object not found");
        }
        const newOrder = response;
        setOrders((prev) => ({
          ...prev,
          [newOrder.type]: [
            ...prev[newOrder.type],
            {
              ...newOrder,
              id: newOrder._id,
              time: newOrder.time || newOrder.start_time,
              customerName: selectedCustomer?.name || "Không xác định",
              customerPhone: selectedCustomer?.phone || "Không xác định",
              customerId: selectedCustomer?._id,
            },
          ],
        }));
        message.success("Thêm đơn hàng thành công");
      }
      fetchOrders(selectedCustomer?._id);
    } catch (error) {
      console.error("Error adding/updating order:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const columns = [
    {
      title: "Họ tên - Số điện thoại",
      key: "customer_info",
      render: (_, record) => (
        <Button
          type="link"
          className="text-blue-600 hover:text-blue-700"
          onClick={() => handleViewCustomerDetails(record.customerId)}
        >
          {`${record.customerName} - ${record.customerPhone}`}
        </Button>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "time",
      key: "time",
      render: (text) =>
        text ? moment.utc(text).local().format("DD/MM/YY HH:mm") : "N/A",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => handleStatusChange(record.id, value)}
          className="w-32 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          popupMatchSelectWidth={false}
          disabled={loading}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="confirmed">Confirmed</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
          <Select.Option value="canceled">Canceled</Select.Option>
        </Select>
      ),
    },
    { title: "Loại Đơn Hàng", dataIndex: "type", key: "type" },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={() => handleEdit(record)}
            disabled={loading}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      render: (_, record) => (
        <Button
          type="link"
          className="text-red-600 hover:text-red-700"
          onClick={() => handleDelete(record)}
          disabled={loading}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Danh sách đơn hàng
        </h2>
        <Space>
          {selectedCustomer && (
            <>
              <span>
                Đang hiển thị đơn hàng của: {selectedCustomer.name} -{" "}
                {selectedCustomer.phone}
              </span>
              <Button
                className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
                onClick={onClearFilter}
                disabled={loading}
              >
                Xóa bộ lọc
              </Button>
            </>
          )}
          <Button
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={handleAdd}
            disabled={loading}
          >
            Thêm Đơn Hàng Mới
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Đơn Hàng Đặt Chỗ" key="reservation">
          <Table
            columns={columns}
            dataSource={orders.reservation}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="text-sm text-gray-600"
            rowClassName="hover:bg-gray-100 transition-all duration-200"
          />
        </TabPane>
        <TabPane tab="Đơn Hàng Giao Hàng" key="ship">
          <Table
            columns={columns}
            dataSource={orders.ship}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="text-sm text-gray-600"
            rowClassName="hover:bg-gray-100 transition-all duration-200"
          />
        </TabPane>
      </Tabs>

      <OrderFormModalView
        visible={isModalVisible}
        editingOrder={editingOrder}
        selectedCustomer={selectedCustomer}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmitOrder}
        orders={orders}
      />

      <Modal
        title="Thông Tin Khách Hàng"
        open={customerModalVisible}
        onCancel={() => setCustomerModalVisible(false)}
        footer={[
          <Button
            key="close"
            className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
            onClick={() => setCustomerModalVisible(false)}
          >
            Đóng
          </Button>,
        ]}
      >
        {customerDetails ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img
                src={customerDetails.avatar || "https://via.placeholder.com/80"}
                alt={customerDetails.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {customerDetails.name}
              </h3>
            </div>
            <p>
              <b>Địa Chỉ:</b> {customerDetails.address || "Chưa cung cấp"}
            </p>
            <p>
              <b>Email:</b> {customerDetails.email || "Chưa cung cấp"}
            </p>
            <p>
              <b>Số Điện Thoại:</b> {customerDetails.phone || "Chưa cung cấp"}
            </p>
            <p>
              <b>Username:</b> {customerDetails.username || "Chưa cung cấp"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Đang tải thông tin...</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;
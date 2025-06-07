import { useState, useEffect, useCallback, useRef } from "react";
import { message, Modal } from "antd";
import moment from "moment";
import { orderAPI } from "../../services/apis/Order";
import { adminAPI } from "../../services/apis/Admin";

const OrderListViewModel = ({ selectedCustomer, onClearFilter }) => {
  const [orders, setOrders] = useState({ takeaway: [], reservation: [] });
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
        takeaway: sortedOrders.filter((order) => order.type === "takeaway"),
      });
    } catch (error) {
      message.error("Lỗi khi tải danh sách đơn hàng");
      setOrders({ reservation: [], takeaway: [] });
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
        orders.takeaway.find((o) => o.id === orderId);

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

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleCustomerModalCancel = () => {
    setCustomerModalVisible(false);
  };

  return {
    // State
    orders,
    isModalVisible,
    editingOrder,
    loading,
    activeTab,
    customerDetails,
    customerModalVisible,
    selectedCustomer,

    // Actions
    setActiveTab,
    handleStatusChange,
    handleViewCustomerDetails,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmitOrder,
    handleModalCancel,
    handleCustomerModalCancel,
    onClearFilter,
  };
};

export default OrderListViewModel;

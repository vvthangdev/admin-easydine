import React, { useEffect, useState } from "react";
import { Button, Modal, Space, message, Tabs } from "antd";
import moment from "moment";
import { orderAPI } from "../../services/apis/Order";
import { adminAPI } from "../../services/apis/Admin";
import OrderTable from "./OrderTable";
import OrderFormModal from "./OrderFormModal";
import CustomerDetailsModal from "./CustomerDetailsModal";
import OrderDetailsModal from "./OrderDetailsModal";

const { TabPane } = Tabs;

const OrderList = ({ selectedCustomer, onClearFilter }) => {
  const [orders, setOrders] = useState({ ship: [], reservation: [] });
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reservation");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const fetchOrders = async (customerId = null) => {
    setLoading(true);
    try {
      let response;
      if (customerId) {
        response = await orderAPI.searchOrdersByCustomer(customerId);
      } else {
        response = await orderAPI.getAllOrders();
      }

      const ordersData = response.data || response;

      const ordersWithCustomerDetails = await Promise.all(
        ordersData.map(async (order) => {
          const customerResponse = await adminAPI.getCustomerDetails(
            order.customer_id
          );
          return {
            ...order,
            id: order._id,
            customerName: customerResponse.name || "Không xác định",
            customerPhone: customerResponse.phone || "Không xác định",
            customerId: order.customer_id,
          };
        })
      );

      const sortedOrders = ordersWithCustomerDetails.sort((a, b) =>
        moment(b.time).diff(moment(a.time))
      );
      const shipOrders = sortedOrders.filter((order) => order.type === "ship");
      const reservationOrders = sortedOrders.filter(
        (order) => order.type === "reservation"
      );
      setOrders({ reservation: reservationOrders, ship: shipOrders });
    } catch (error) {
      console.error("Error loading orders:", error);
      message.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedCustomer?._id);
  }, [selectedCustomer]);

  const handleAdd = () => {
    setEditingOrder(null);
    setIsFormModalVisible(true);
  };

  const handleEdit = async (record) => {
    setEditingOrder(record);
    setIsFormModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa đơn hàng ${record.id} không? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await orderAPI.deleteOrder(record.id);
          setOrders((prevOrders) => ({
            ...prevOrders,
            [record.type]: prevOrders[record.type].filter(
              (order) => order.id !== record.id
            ),
          }));
          message.success("Xóa đơn hàng thành công");
        } catch (error) {
          message.error("Không thể xóa đơn hàng");
        }
      },
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const currentOrder =
        orders.reservation.find((o) => o.id === orderId) ||
        orders.ship.find((o) => o.id === orderId);
      if (!currentOrder) {
        message.error("Không tìm thấy đơn hàng để cập nhật");
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
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const handleViewCustomerDetails = async (customerId) => {
    try {
      const response = await adminAPI.getCustomerDetails(customerId);
      setCustomerDetails(response);
      setCustomerModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy thông tin chi tiết khách hàng");
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await orderAPI.getOrderDetails(id);
      setOrderDetails(response.data || response);
      setDetailsModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy thông tin chi tiết đơn hàng");
    }
  };

  const handleFormSubmit = async (formValues) => {
    try {
      if (editingOrder) {
        await orderAPI.updateOrder(formValues);
        message.success("Cập nhật đơn hàng thành công");
      } else {
        await orderAPI.createOrder(formValues);
        message.success("Thêm đơn hàng thành công");
      }
      setIsFormModalVisible(false);
      fetchOrders(selectedCustomer?._id);
    } catch (error) {
      console.error("Error adding/updating order:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Danh sách đơn hàng</h2>
        <Space>
          {selectedCustomer && (
            <>
              <span className="text-sm text-gray-600">
                Đang hiển thị đơn hàng của: {selectedCustomer.name} - {selectedCustomer.phone}
              </span>
              <Button
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
                onClick={onClearFilter}
              >
                Xóa bộ lọc
              </Button>
            </>
          )}
          <Button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={handleAdd}
          >
            Thêm Đơn Hàng Mới
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="text-gray-900">
        <TabPane tab="Đơn Hàng Đặt Chỗ" key="reservation">
          <OrderTable
            orders={orders.reservation}
            loading={loading}
            onStatusChange={handleStatusChange}
            onViewCustomerDetails={handleViewCustomerDetails}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabPane>
        <TabPane tab="Đơn Hàng Giao Hàng" key="ship">
          <OrderTable
            orders={orders.ship}
            loading={loading}
            onStatusChange={handleStatusChange}
            onViewCustomerDetails={handleViewCustomerDetails}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabPane>
      </Tabs>

      <OrderFormModal
        visible={isFormModalVisible}
        editingOrder={editingOrder}
        selectedCustomer={selectedCustomer}
        onCancel={() => setIsFormModalVisible(false)}
        onSubmit={handleFormSubmit}
      />

      <CustomerDetailsModal
        visible={customerModalVisible}
        customerDetails={customerDetails}
        onCancel={() => setCustomerModalVisible(false)}
      />

      <OrderDetailsModal
        visible={detailsModalVisible}
        orderDetails={orderDetails}
        onCancel={() => setDetailsModalVisible(false)}
      />
    </div>
  );
};

export default OrderList;
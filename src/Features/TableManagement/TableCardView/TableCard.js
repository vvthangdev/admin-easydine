import React, { useState, useEffect } from "react";
import { Modal, Button, Tooltip, Spin, List, message } from "antd";
import moment from "moment";
import { orderAPI } from "../../../services/apis/Order";
import { userAPI } from "../../../services/apis/User";
import { adminAPI } from "../../../services/apis/Admin";
import { getTableImage, getSourceTables, handleMergeOrder, getVietnameseStatus } from "./TableCardUtils";
import TableCardDetails from "./TableCardDetails";
import OrderFormModal from "../../OrderManagement/OrderFormMoDal/OrderFormModal";

const TableCard = ({ table, onRelease, tables, onMergeSuccess, onOrderSuccess }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [staffName, setStaffName] = useState("N/A");
  const [editingOrder, setEditingOrder] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "N/A",
    phone: "N/A",
    address: "N/A",
  });

  const fetchOrderDetails = async () => {
    if (!table.reservation_id) {
      setOrderDetails(null);
      setStaffName("N/A");
      setCustomerInfo({ name: "N/A", phone: "N/A", address: "N/A" });
      return;
    }
    setLoading(true);
    try {
      const response = await orderAPI.getOrderInfo({
        table_number: table.table_number,
      });
      // Kiểm tra phản hồi API
      if (response && response.status === "SUCCESS") {
        setOrderDetails(response);
      } else {
        // Xử lý trường hợp API trả về status không phải SUCCESS
        setOrderDetails(null);
        message.error(response?.message || "Không tìm thấy thông tin đơn hàng");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setOrderDetails(null);
      setStaffName("N/A");
      setCustomerInfo({ name: "N/A", phone: "N/A", address: "N/A" });
      message.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStaffName = async () => {
      if (orderDetails?.order?.staff_id) {
        try {
          const response = await userAPI.getUserById(orderDetails.order.staff_id);
          if (response.data?.status === "SUCCESS") {
            setStaffName(response.data.user.name || "N/A");
          } else if (response.status === "SUCCESS") {
            setStaffName(response.user?.name || response.name || "N/A");
          } else {
            setStaffName("N/A");
          }
        } catch (error) {
          console.error("Error fetching staff information:", error);
          setStaffName("N/A");
        }
      } else {
        setStaffName("N/A");
      }
    };

    const fetchCustomerInfo = async () => {
      if (orderDetails?.order?.customer_id || orderDetails?.customer_id) {
        try {
          const customerId = orderDetails.order?.customer_id || orderDetails.customer_id;
          const response = await adminAPI.getCustomerDetails(customerId);
          setCustomerInfo({
            name: response.name || "N/A",
            phone: response.phone || "N/A",
            address: response.address || "N/A",
          });
        } catch (error) {
          console.error("Error fetching customer information:", error);
          setCustomerInfo({
            name: "N/A",
            phone: "N/A",
            address: "N/A",
          });
        }
      } else {
        setCustomerInfo({
          name: "N/A",
          phone: "N/A",
          address: "N/A",
        });
      }
    };

    if (orderDetails) {
      fetchStaffName();
      fetchCustomerInfo();
    }
  }, [orderDetails]);

  

const handleCardClick = async () => {
  if (table.status === "Available") {
    setIsOrderModalVisible(true);
    setEditingOrder(null); // Thêm mới đơn hàng
  } else {
    setLoading(true);
    try {
      const response = await orderAPI.getOrderInfo({
        table_number: table.table_number,
      });
      if (response && response.status === "SUCCESS") {
        setEditingOrder({
          id: response.order.id,
          type: response.order.type,
          status: response.order.status,
          time: response.order.time,
          customer_id: response.order.customer_id || response.customer_id,
          reservedTables: response.reservedTables,
          itemOrders: response.itemOrders,
        });
        setIsOrderModalVisible(true);
      } else {
        message.error("Không tìm thấy thông tin đơn hàng");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  }
};

const handleOrderSubmit = async (orderData) => {
  try {
    if (orderData.id) {
      // Cập nhật đơn hàng
      await orderAPI.updateOrder(orderData);
      message.success("Cập nhật đơn hàng thành công");
    } else {
      // Thêm đơn hàng mới
      await orderAPI.createOrder(orderData);
      message.success("Thêm đơn hàng mới thành công");
    }
    setIsOrderModalVisible(false);
    setEditingOrder(null);
    onOrderSuccess(); // Cập nhật danh sách bàn
  } catch (error) {
    console.error("Error submitting order:", error);
    message.error("Không thể lưu đơn hàng");
  }
};

  return (
    <>
      <Tooltip
        title={
          <div className="text-sm text-gray-600 bg-white p-2 rounded">
            <p><span className="font-medium text-gray-900">Số bàn:</span> {table.table_number}</p>
            <p><span className="font-medium text-gray-900">Sức chứa:</span> {table.capacity}</p>
            <p>
              <span className="font-medium text-gray-900">Trạng thái:</span>{" "}
              {getVietnameseStatus(table.status)}
            </p>
            {table.same_order_tables && (
              <p>
                <span className="font-medium text-gray-900">Bàn gộp:</span> Bàn {table.same_order_tables.join(", ")} (Đơn #{table.order_number})
              </p>
            )}
            {orderDetails?.itemOrders?.length > 0 ? (
              <div>
                <p><span className="font-medium text-gray-900">Món ăn:</span></p>
                <ul className="list-disc pl-4">
                  {orderDetails.itemOrders.map((item) => (
                    <li key={item._id}>
                      {item.itemName} (x{item.quantity}) - {(item.itemPrice * item.quantity).toLocaleString()} VND
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p><span className="font-medium text-gray-900">Món ăn:</span> Không có</p>
            )}
            <p>
              <span className="font-medium text-gray-900">Bắt đầu:</span>{" "}
              {table.start_time ? moment.utc(table.start_time).local().format("HH:mm, DD/MM/YYYY") : "-"}
            </p>
            <p>
              <span className="font-medium text-gray-900">Kết thúc:</span>{" "}
              {table.end_time ? moment.utc(table.end_time).local().format("HH:mm, DD/MM/YYYY") : "-"}
            </p>
          </div>
        }
        onVisibleChange={(visible) => visible && fetchOrderDetails()}
      >
        <div
          className={`table-card ${table.status.toLowerCase()} ${table.same_order_tables ? "grouped" : ""} border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
          onClick={handleCardClick}
        >
          <div className="table-icon flex justify-center">
            <img
              src={getTableImage(table.status)}
              alt={`Table ${table.status}`}
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
          <div className="table-info text-center mt-2">
            <h3 className="text-lg font-semibold text-gray-900">Bàn {table.table_number}</h3>
          </div>
        </div>
      </Tooltip>

      

      <Modal
        title="Chọn bàn nguồn để ghép đơn"
        open={isMergeModalVisible}
        onCancel={() => setIsMergeModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsMergeModalVisible(false)}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
          >
            Đóng
          </Button>,
        ]}
        width={600}
      >
        <List
          dataSource={getSourceTables(tables, table.reservation_id)}
          renderItem={(sourceTable) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleMergeOrder(sourceTable, tables, table, onMergeSuccess, setIsMergeModalVisible, setIsModalVisible)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Ghép đơn
                </Button>,
              ]}
            >
              <div>
                <p><strong>Bàn {sourceTable.table_number}</strong></p>
                <p>Đơn #{sourceTable.order_number}</p>
                <p>
                  Bàn gộp: {sourceTable.same_order_tables ? sourceTable.same_order_tables.join(", ") : "Không có"}
                </p>
              </div>
            </List.Item>
          )}
        />
      </Modal>

      <OrderFormModal
  visible={isOrderModalVisible}
  editingOrder={editingOrder}
  selectedCustomer={editingOrder?.customer_id ? { _id: editingOrder.customer_id } : null}
  onCancel={() => {
    setIsOrderModalVisible(false);
    setEditingOrder(null);
  }}
  onSubmit={handleOrderSubmit}
  table={table}
/>
    </>
  );
};

export default TableCard;
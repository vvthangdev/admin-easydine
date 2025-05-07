import React, { useState } from "react";
import { Modal, Button, Tooltip, List, message } from "antd";
import moment from "moment";
import { orderAPI } from "../../../services/apis/Order";
import {
  getTableImage,
  getSourceTables,
  handleMergeOrder,
  getVietnameseStatus,
} from "./TableCardUtils";
import OrderFormModal from "../../OrderManagement/OrderFormMoDal/OrderFormModal";

const TableCard = ({
  table,
  onRelease,
  tables,
  onMergeSuccess,
  onOrderSuccess,
}) => {
  const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const handleCardClick = async () => {
    if (table.status === "Available") {
      setIsOrderModalVisible(true);
      setEditingOrder(null); // Thêm mới đơn hàng
    } else {
      try {
        const response = await orderAPI.getOrderInfo({
          table_number: table.table_number,
        });
        if (response) {
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
            <p>
              <span className="font-medium text-gray-900">Số bàn:</span>{" "}
              {table.table_number}
            </p>
            <p>
              <span className="font-medium text-gray-900">Sức chứa:</span>{" "}
              {table.capacity}
            </p>
            <p>
              <span className="font-medium text-gray-900">Trạng thái:</span>{" "}
              {getVietnameseStatus(table.status)}
            </p>
            {table.same_order_tables && (
              <p>
                <span className="font-medium text-gray-900">Bàn gộp:</span> Bàn{" "}
                {table.same_order_tables.join(", ")} (Đơn #{table.order_number})
              </p>
            )}
            <p>
              <span className="font-medium text-gray-900">Bắt đầu:</span>{" "}
              {table.start_time
                ? moment
                    .utc(table.start_time)
                    .local()
                    .format("HH:mm, DD/MM/YYYY")
                : "-"}
            </p>
            <p>
              <span className="font-medium text-gray-900">Kết thúc:</span>{" "}
              {table.end_time
                ? moment.utc(table.end_time).local().format("HH:mm, DD/MM/YYYY")
                : "-"}
            </p>
          </div>
        }
      >
        <div
          className={`table-card ${table.status.toLowerCase()} ${
            table.same_order_tables ? "grouped" : ""
          } border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
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
            <h3 className="text-lg font-semibold text-gray-900">
              Bàn {table.table_number}
            </h3>
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
                  onClick={() =>
                    handleMergeOrder(
                      sourceTable,
                      tables,
                      table,
                      onMergeSuccess,
                      setIsMergeModalVisible
                    )
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Ghép đơn
                </Button>,
              ]}
            >
              <div>
                <p>
                  <strong>Bàn {sourceTable.table_number}</strong>
                </p>
                <p>Đơn #{sourceTable.order_number}</p>
                <p>
                  Bàn gộp:{" "}
                  {sourceTable.same_order_tables
                    ? sourceTable.same_order_tables.join(", ")
                    : "Không có"}
                </p>
              </div>
            </List.Item>
          )}
        />
      </Modal>

      <OrderFormModal
        visible={isOrderModalVisible}
        editingOrder={editingOrder}
        selectedCustomer={
          editingOrder?.customer_id ? { _id: editingOrder.customer_id } : null
        }
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

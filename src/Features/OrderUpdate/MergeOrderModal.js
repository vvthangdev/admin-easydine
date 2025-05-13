import React, { useState, useEffect } from "react";
import { Modal, Button, Select, message } from "antd";
import { tableAPI } from "../../services/apis/Table";
import { orderAPI } from "../../services/apis/Order";
import moment from "moment";

const { Option } = Select;

const MergeOrderModal = ({
  visible,
  targetOrder,
  onCancel,
  onSuccess,
  zIndex,
}) => {
  const [sourceOrderId, setSourceOrderId] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách trạng thái bàn để tạo danh sách đơn hàng nguồn
  useEffect(() => {
    if (!visible) return;
    const fetchTableStatus = async () => {
      setLoading(true);
      try {
        const tableStatus = await tableAPI.getAllTablesStatus();
        // Lọc các bàn có reservation_id (Occupied hoặc Reserved)
        const reservedTables = tableStatus.filter(
          (table) =>
            (table.status === "Occupied" || table.status === "Reserved") &&
            table.reservation_id
        );
        // Nhóm theo reservation_id để tạo danh sách đơn hàng nguồn
        const ordersByReservation = reservedTables.reduce((acc, table) => {
          const reservationId = table.reservation_id;
          if (!acc[reservationId]) {
            acc[reservationId] = {
              id: reservationId,
              tables: [],
              time: table.start_time,
            };
          }
          acc[reservationId].tables.push({
            table_number: table.table_number,
            area: table.area,
          });
          return acc;
        }, {});
        // Chuyển thành mảng và loại trừ đơn đích
        const orders = Object.values(ordersByReservation).filter(
          (order) => order.id !== targetOrder?.id
        );
        setAvailableOrders(orders);
      } catch (error) {
        message.error(
          "Không thể tải danh sách đơn hàng: " + (error.message || "Lỗi không xác định.")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTableStatus();
  }, [visible, targetOrder]);

  // Xử lý gộp đơn
  const handleMergeOrder = async () => {
    if (!sourceOrderId) {
      message.error("Vui lòng chọn đơn hàng muốn gộp!");
      return;
    }
    if (!targetOrder?.id) {
      message.error("Đơn hàng hiện tại chưa được lưu. Vui lòng lưu đơn hàng trước!");
      return;
    }

    setLoading(true);
    try {
      await orderAPI.mergeOrder({
        source_order_id: sourceOrderId,
        target_order_id: targetOrder.id,
      });
      message.success(`Gộp đơn thành công! Đơn hàng đích: ${targetOrder.id}`);
      onSuccess();
      onCancel();
    } catch (error) {
      message.error(`Gộp đơn thất bại: ${error.message || "Lỗi không xác định."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Gộp Đơn Hàng"
      open={visible}
      onCancel={onCancel}
      className="rounded-xl"
      footer={[
        <Button
          key="cancel"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </Button>,
        <Button
          key="merge"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
          onClick={handleMergeOrder}
          loading={loading}
        >
          Gộp Đơn
        </Button>,
      ]}
      width={600}
      style={{ top: 50 }}
      zIndex={zIndex || 1001}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-900">
            Chọn Đơn Hàng Muốn Gộp
          </label>
          <Select
            value={sourceOrderId}
            onChange={setSourceOrderId}
            placeholder="Chọn đơn hàng muốn gộp vào đơn hiện tại"
            className="w-full mt-2"
            allowClear
            loading={loading}
          >
            {availableOrders.map((order) => (
              <Option key={order.id} value={order.id}>
                Đơn {order.id.slice(-6)} - Bàn {order.tables.map((t) => t.table_number).join(", ")} - {order.tables[0].area} -{" "}
                {moment.utc(order.time).local().format("DD/MM/YY HH:mm")}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default MergeOrderModal;
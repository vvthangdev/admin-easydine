import React, { useState } from "react";
import { Modal, Button, Select, message } from "antd";
import { orderAPI } from "../../../services/apis/Order";
import moment from "moment";

const { Option } = Select;

const MergeOrderModal = ({
  visible,
  sourceOrder,
  orders,
  onCancel,
  onSuccess,
}) => {
  const [targetOrderId, setTargetOrderId] = useState(null);

  // Lọc danh sách đơn hàng đích (loại reservation, không phải đơn nguồn)
  const availableOrders = orders.filter(
    (order) => order.type === "reservation" && order.id !== sourceOrder?.id
  );

  // Xử lý gộp đơn
  const handleMergeOrder = async () => {
    if (!targetOrderId) {
      message.error("Vui lòng chọn đơn hàng đích để gộp!");
      return;
    }

    try {
      const responseData = await orderAPI.mergeOrder({
        source_order_id: sourceOrder.id,
        target_order_id: targetOrderId,
      });
      if (responseData.status === "SUCCESS") {
        message.success(`Gộp đơn thành công! Đơn hàng đích: ${targetOrderId}`);
        onSuccess();
        onCancel();
      } else {
        message.error(
          `Gộp đơn thất bại: ${
            responseData.message || "Phản hồi API không hợp lệ."
          }`
        );
      }
    } catch (error) {
      message.error(
        `Gộp đơn thất bại: ${error.message || "Lỗi không xác định."}`
      );
    }
  };

  return (
    <Modal
      title="Gộp Đơn Hàng"
      open={visible}
      onCancel={onCancel}
      className="rounded-xl top-near-header"
      footer={[
        <Button
          key="cancel"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
          onClick={onCancel}
        >
          Hủy
        </Button>,
        <Button
          key="merge"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
          onClick={handleMergeOrder}
        >
          Gộp Đơn
        </Button>,
      ]}
      width={600}
      style={{ top: 50 }}
      zIndex={15}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-900">
            Chọn Đơn Hàng Đích
          </label>
          <Select
            value={targetOrderId}
            onChange={setTargetOrderId}
            placeholder="Chọn đơn hàng đích"
            className="w-full mt-2"
            allowClear
          >
            {availableOrders.map((order) => (
              <Option key={order.id} value={order.id}>
                Đơn {order.id} - {order.customerName} -{" "}
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
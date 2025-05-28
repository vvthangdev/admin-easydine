import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Input, message } from "antd";
import { orderAPI } from "../../services/apis/Order";

const SplitOrderModal = ({ visible, orderDetails, onCancel, onSuccess, zIndex }) => {
  const [splitItems, setSplitItems] = useState([]);

  useEffect(() => {
    if (orderDetails?.itemOrders) {
      const initialItems = orderDetails.itemOrders.map((item, index) => ({
        key: `${item.item_id || item._id}-${item.size || "default"}-${index}`, // Khóa duy nhất
        item_id: item.item_id || item._id,
        itemName: item.itemName || "N/A",
        itemImage: item.itemImage || "https://via.placeholder.com/80",
        itemPrice: item.itemPrice || 0,
        size: item.size || "Mặc định",
        note: item.note || "",
        quantity: 0,
        maxQuantity: item.quantity || 0,
      }));
      setSplitItems(initialItems);
    } else {
      setSplitItems([]);
    }
  }, [orderDetails]);

  const handleQuantityChange = (key, value) => {
    const quantity = parseInt(value) || 0;
    setSplitItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
          : item
      )
    );
  };

  const handleSplitOrder = async () => {
    if (!orderDetails?.order?.id) {
      message.error("Không tìm thấy ID đơn hàng để tách!");
      return;
    }
    if (splitItems.every((item) => item.quantity === 0)) {
      message.error("Vui lòng chọn ít nhất một món để tách!");
      return;
    }

    const newItems = splitItems
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        id: item.item_id,
        quantity: item.quantity,
        size: item.size !== "Mặc định" ? item.size : undefined,
        note: item.note || undefined,
      }));

    try {
      const data = await orderAPI.splitOrder({
        order_id: orderDetails.order.id,
        new_items: newItems,
      });
      if (data?.newOrder?.id) {
        message.success(`Tách đơn thành công! Mã đơn mới: ${data.newOrder.id}`);
      } else {
        message.success("Tách đơn thành công!");
      }
      onSuccess();
      onCancel();
    } catch (error) {
      message.error(`Tách đơn thất bại: ${error.message || "Lỗi không xác định."}`);
    }
  };

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "itemImage",
      key: "itemImage",
      render: (text) => (
        <img
          src={text}
          alt="Item"
          className="w-12 h-12 rounded-lg object-cover"
        />
      ),
      width: 80,
    },
    {
      title: "Tên Món",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Giá",
      dataIndex: "itemPrice",
      key: "itemPrice",
      render: (text) => `${text.toLocaleString()} VND`,
      width: 120,
    },
    {
      title: "Kích Thước",
      dataIndex: "size",
      key: "size",
      width: 100,
    },
    {
      title: "Ghi Chú",
      dataIndex: "note",
      key: "note",
      width: 100,
    },
    {
      title: "Số Lượng Tối Đa",
      dataIndex: "maxQuantity",
      key: "maxQuantity",
      render: (text) => `${text}`,
      width: 120,
    },
    {
      title: "Số Lượng Tách",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <Input
          type="number"
          value={quantity}
          min={0}
          max={record.maxQuantity}
          onChange={(e) => handleQuantityChange(record.key, e.target.value)}
          style={{ width: 80 }}
        />
      ),
      width: 120,
    },
  ];

  return (
    <Modal
      title="Tách Đơn Hàng"
      open={visible}
      onCancel={onCancel}
      className="rounded-xl"
      footer={[
        <Button
          key="cancel"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
          onClick={onCancel}
        >
          Hủy
        </Button>,
        <Button
          key="split"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
          onClick={handleSplitOrder}
        >
          Tách Đơn
        </Button>,
      ]}
      width="80vw"
      style={{ top: 50 }}
      zIndex={zIndex || 1001}
    >
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Chọn Món để Tách
          </h3>
          <Table
            columns={columns}
            dataSource={splitItems}
            rowKey="key"
            pagination={false}
            size="middle"
            className="text-base text-gray-600 mt-2"
            scroll={{ x: true }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SplitOrderModal;
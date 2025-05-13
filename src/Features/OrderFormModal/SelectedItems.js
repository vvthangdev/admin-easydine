import React from "react";
import { Table, Button, Input, Select, Typography } from "antd";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const SelectedItems = ({ selectedItems, setSelectedItems, menuItems }) => {
  const handleQuantityChange = (id, size, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: parseInt(value) || 1 }
          : item
      )
    );
  };

  const handleSizeChange = (id, oldSize, newSize) => {
    setSelectedItems((prev) => {
      const item = prev.find((i) => i.id === id && i.size === oldSize);
      if (!item) return prev;
      const menuItem = menuItems.find((m) => m._id === id);
      const sizeInfo = newSize
        ? menuItem?.sizes.find((s) => s.name === newSize)
        : null;
      return prev.map((i) =>
        i.id === id && i.size === oldSize
          ? {
              ...i,
              size: newSize || null,
              price: sizeInfo ? sizeInfo.price : menuItem?.price || i.price,
            }
          : i
      );
    });
  };

  const handleNoteChange = (id, size, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, note: value } : item
      )
    );
  };

  const handleRemove = (id, size) => {
    setSelectedItems((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    );
  };

  // Tính toán hóa đơn tạm tính
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = subtotal * 0.1; // VAT 10%
  const total = subtotal + vat;

  const columns = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      width: 200, // Đảm bảo đủ không gian cho tên món dài
    },
    {
      title: "Kích thước - Giá",
      key: "sizePrice",
      width: 180, // Tăng width để hiển thị đầy đủ nội dung
      render: (_, record) => {
        const menuItem = menuItems.find((m) => m._id === record.id);
        return menuItem?.sizes?.length > 0 ? (
          <Select
            value={record.size || null}
            onChange={(value) => handleSizeChange(record.id, record.size, value)}
            style={{ width: "100%" }} // Chiếm toàn bộ chiều rộng cột
            allowClear
            placeholder="Chọn kích thước"
          >
            {menuItem.sizes.map((s) => (
              <Option key={s._id} value={s.name}>
                {`${s.name} - ${s.price.toLocaleString()}`}
              </Option>
            ))}
          </Select>
        ) : (
          record.price.toLocaleString()
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (quantity, record) => (
        <Input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(record.id, record.size, e.target.value)}
          min={1}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: "Tổng",
      key: "total",
      width: 100,
      render: (_, record) => (record.price * record.quantity).toLocaleString(),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      render: (note, record) => (
        <TextArea
          value={note}
          onChange={(e) => handleNoteChange(record.id, record.size, e.target.value)}
          placeholder="Nhập ghi chú (ví dụ: Ít đá)"
          rows={3}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Xóa",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => handleRemove(record.id, record.size)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Món đã chọn</h3>
      <Table
        columns={columns}
        dataSource={selectedItems}
        rowKey={(record) => `${record.id}-${record.size || "default"}`}
        pagination={false}
        size="small"
        className="text-sm text-gray-600 flex-1 overflow-y-auto"
        rowClassName="hover:bg-gray-100 transition-all duration-200"
      />
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900">Hóa đơn tạm tính</h4>
        <div className="flex justify-between mt-2">
          <Text>Tổng tiền món:</Text>
          <Text strong>{subtotal.toLocaleString()} VND</Text>
        </div>
        <div className="flex justify-between mt-2">
          <Text>VAT (10%):</Text>
          <Text strong>{vat.toLocaleString()} VND</Text>
        </div>
        <div className="flex justify-between mt-2 border-t pt-2">
          <Text strong>Tổng cộng:</Text>
          <Text strong className="text-blue-600">
            {total.toLocaleString()} VND
          </Text>
        </div>
      </div>
    </div>
  );
};

export default SelectedItems;
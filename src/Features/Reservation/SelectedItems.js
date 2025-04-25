import React from "react";
import { Table, Button, Input, Select } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const SelectedItems = ({ selectedItems, setSelectedItems }) => {
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
      const menuItem = window.menuItems?.find((m) => m._id === id);
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
    setSelectedItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const columns = [
    { title: "Tên món", dataIndex: "name", key: "name" },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
      render: (size, record) => {
        const menuItem = window.menuItems?.find((m) => m._id === record.id);
        return menuItem?.sizes?.length > 0 ? (
          <Select
            value={size || null}
            onChange={(value) => handleSizeChange(record.id, size, value)}
            style={{ width: 120 }}
            allowClear
          >
            {menuItem.sizes.map((s) => (
              <Option key={s.name} value={s.name}>
                {s.name}
              </Option>
            ))}
          </Select>
        ) : (
          "Mặc định"
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note, record) => (
        <TextArea
          value={note}
          onChange={(e) => handleNoteChange(record.id, record.size, e.target.value)}
          placeholder="Nhập ghi chú (ví dụ: Ít đá)"
          rows={3} // Tăng số hàng để hiển thị tốt hơn
          style={{ width: 200 }} // Tăng chiều rộng ô ghi chú
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString()} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
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
      render: (_, record) => `${(record.price * record.quantity).toLocaleString()} VND`,
    },
    {
      title: "Thao tác",
      key: "action",
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
      <h3>Món đã chọn</h3>
      <Table
        columns={columns}
        dataSource={selectedItems}
        rowKey={(record) => `${record.id}-${record.size || "default"}`}
        pagination={false}
        size="small"
        style={{ flex: 1, overflowY: "auto" }}
      />
    </div>
  );
};

export default SelectedItems;
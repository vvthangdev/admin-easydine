import React from "react";
import { Table, Button, InputNumber } from "antd";

const SelectedItems = ({ selectedItems, setSelectedItems }) => {
  const columns = [
    { title: "Tên món", dataIndex: "name", key: "name" },
    { title: "Giá", dataIndex: "price", key: "price", render: (text) => `${text.toLocaleString()} VND` },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <InputNumber
          min={1}
          value={text}
          onChange={(value) =>
            setSelectedItems((prev) =>
              prev.map(item =>
                item.id === record.id ? { ...item, quantity: value } : item
              )
            )
          }
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
          onClick={() =>
            setSelectedItems((prev) => prev.filter(item => item.id !== record.id))
          }
        >
          Xóa
        </Button>
      ),
    },
  ];

  const totalAmount = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vat = totalAmount * 0.1;
  const grandTotal = totalAmount + vat;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h3>Danh sách món đã chọn</h3>
      <Table
        columns={columns}
        dataSource={selectedItems}
        rowKey="id"
        pagination={false}
        size="small"
        style={{ flex: 1, overflowY: "auto" }}
      />
      <div style={{ marginTop: "16px" }}>
        <p><b>Tổng tiền:</b> {totalAmount.toLocaleString()} VND</p>
        <p><b>VAT (10%):</b> {vat.toLocaleString()} VND</p>
        <p style={{ fontWeight: "bold", color: "#d9534f" }}><b>Tổng cộng:</b> {grandTotal.toLocaleString()} VND</p>
      </div>
    </div>
  );
};

export default SelectedItems;
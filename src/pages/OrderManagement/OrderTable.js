import React from "react";
import { Table, Button, Space, Select } from "antd";
import moment from "moment";

const OrderTable = ({
  orders,
  loading,
  onStatusChange,
  onViewCustomerDetails,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const columns = [
    { title: "Mã Đơn Hàng", dataIndex: "id", key: "id" },
    {
      title: "Họ tên - Số điện thoại",
      key: "customer_info",
      render: (_, record) => (
        <Button
          type="link"
          className="text-blue-600 hover:text-blue-700"
          onClick={() => onViewCustomerDetails(record.customerId)}
        >
          {`${record.customerName} - ${record.customerPhone}`}
        </Button>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "time",
      key: "time",
      render: (text) => (text ? moment.utc(text).local().format("HH:mm, DD/MM/YY") : "N/A"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => onStatusChange(record.id, value)}
          className="w-32 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          popupMatchSelectWidth={false}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="confirmed">Confirmed</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
          <Select.Option value="canceled">Canceled</Select.Option>
        </Select>
      ),
    },
    { title: "Loại Đơn Hàng", dataIndex: "type", key: "type" },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Button
            className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
            onClick={() => onViewDetails(record.id)}
          >
            Xem Chi Tiết
          </Button>
        </Space>
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      render: (_, record) => (
        <Button
          type="link"
          className="text-red-600 hover:text-red-700"
          onClick={() => onDelete(record)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      className="text-sm text-gray-600"
      rowClassName="hover:bg-gray-100 transition-all duration-200"
    />
  );
};

export default OrderTable;
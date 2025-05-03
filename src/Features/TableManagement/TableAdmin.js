import React from "react";
import { Table, Button } from "antd";
import { getVietnameseStatus } from "./TableCardView/TableCardUtils";

const TableAdmin = ({ tables, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Số bàn",
      dataIndex: "table_number",
      key: "table_number",
      sorter: (a, b) => a.table_number - b.table_number,
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
      sorter: (a, b) => a.capacity - b.capacity,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={
            status === "Available"
              ? "text-green-600"
              : status === "Reserved"
              ? "text-yellow-600"
              : "text-blue-600"
          }
        >
          {getVietnameseStatus(status)}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => onEdit(record)}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700"
          >
            Sửa
          </Button>
          <Button
            type="danger"
            onClick={() => onDelete(record)}
            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700"
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tables}
      rowKey="table_number"
      pagination={{ pageSize: 10 }}
      className="mt-4"
    />
  );
};

export default TableAdmin;
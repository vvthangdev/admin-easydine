import React from "react";
import { Table, Button } from "antd";

const TableAdmin = ({ tables, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Số bàn",
      dataIndex: "table_number",
      key: "table_number",
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="link"
            onClick={() => onEdit(record)}
            className="text-blue-600 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Button
            type="link"
            onClick={() => onDelete(record)}
            className="text-red-600 hover:text-red-700"
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Table
        columns={columns}
        dataSource={tables}
        rowKey="table_number"
        pagination={false}
        className="w-full text-sm text-gray-600"
      />
    </div>
  );
};

export default TableAdmin;
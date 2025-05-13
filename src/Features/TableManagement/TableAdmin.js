import React, { useState } from "react";
import { Table, Button, Tabs } from "antd";
import { getVietnameseStatus } from "./TableCardView/TableCardUtils";

const { TabPane } = Tabs;

const TableAdmin = ({ tables, onEdit, onDelete, onAdd, areas }) => {
  // Đặt khu vực mặc định là khu vực đầu tiên trong areas, nếu không có thì là chuỗi rỗng
  const initialArea = areas.length > 0 ? areas[0] : "";
  const [activeArea, setActiveArea] = useState(initialArea);

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
      title: "Khu vực",
      dataIndex: "area",
      key: "area",
      sorter: (a, b) => a.area.localeCompare(b.area),
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
            onClick={() => onDelete(record.table_id)}
            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700"
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  // Lọc bàn theo khu vực
  const filteredTables =
    activeArea === ""
      ? tables
      : tables.filter((table) => table.area === activeArea);

  // Danh sách khu vực cho Tabs (chỉ lấy các khu vực duy nhất từ tables)
  const tabAreas = [...new Set(tables.map((table) => table.area))];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={onAdd}
          className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Thêm bàn mới
        </Button>
      </div>
      {tabAreas.length > 0 ? (
        <Tabs activeKey={activeArea} onChange={setActiveArea} className="mb-4">
          {tabAreas.map((area) => (
            <TabPane tab={area} key={area} />
          ))}
        </Tabs>
      ) : (
        <div className="text-center">Không có khu vực nào</div>
      )}
      <Table
        columns={columns}
        dataSource={filteredTables}
        rowKey="table_number"
        pagination={{ pageSize: 10 }}
        className="mt-4"
      />
    </div>
  );
};

export default TableAdmin;
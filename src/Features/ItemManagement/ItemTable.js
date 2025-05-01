import React from "react";
import { Table, Button, Space, Dropdown, Menu } from "antd";

const itemColumns = [
  { title: "Tên món", dataIndex: "name", key: "name" },
  {
    title: "Hình ảnh",
    dataIndex: "image",
    key: "image",
    render: (text) =>
      text ? (
        <img src={text} alt="item" className="w-12 h-12 object-cover rounded" />
      ) : (
        "Không có ảnh"
      ),
  },
  { title: "Giá", dataIndex: "price", key: "price", render: (text) => <span>{text} VNĐ</span> },
  {
    title: "Size",
    dataIndex: "sizes",
    key: "sizes",
    render: (sizes) => {
      if (!Array.isArray(sizes) || sizes.length === 0) {
        return null; // Để trống nếu không có kích cỡ
      }
      const menu = (
        <Menu>
          {sizes.map((size, index) => (
            <Menu.Item key={index}>
              {size.name}: {size.price} VNĐ
            </Menu.Item>
          ))}
        </Menu>
      );
      return (
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button type="primary" size="small">
            Size
          </Button>
        </Dropdown>
      );
    },
  },
  {
    title: "Thao tác",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="link"
          onClick={() => record.onEdit(record)}
          className="text-blue-600 hover:text-blue-800"
        >
          Sửa
        </Button>
        <Button
          type="link"
          onClick={() => record.onDelete(record)}
          className="text-red-600 hover:text-red-800"
        >
          Xóa
        </Button>
      </Space>
    ),
  },
  {
    title: "Danh mục",
    dataIndex: "categories",
    key: "categories",
    render: (categories) =>
      Array.isArray(categories) && categories.length > 0
        ? categories.map((cat) => cat.name).join(", ")
        : "",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    render: (text) => <span>{text || ""}</span>,
  },
];

const categoryColumns = [
  { title: "Tên danh mục", dataIndex: "name", key: "name" },
  { title: "Mô tả", dataIndex: "description", key: "description" },
  {
    title: "Thao tác",
    key: "action",
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => record.onDeleteCategory(record)}
        className="text-red-600 hover:text-red-800"
      >
        Xóa
      </Button>
    ),
  },
];

const ItemTable = ({ menuItems, categories, loading, onEdit, onDelete, onDeleteCategory }) => {
  const itemCols = itemColumns.map((col) =>
    col.key === "action"
      ? { ...col, render: (_, record) => col.render(_, { ...record, onEdit, onDelete }) }
      : col
  );
  const categoryCols = categoryColumns.map((col) =>
    col.key === "action"
      ? { ...col, render: (_, record) => col.render(_, { ...record, onDeleteCategory }) }
      : col
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <h2 className="text-lg font-semibold p-4">Danh sách món ăn</h2>
        <Table
          columns={itemCols}
          dataSource={menuItems}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="w-full"
        />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Danh sách danh mục</h2>
        <Table
          columns={categoryCols}
          dataSource={categories.filter((cat) => cat && cat._id)}
          rowKey="_id"
          pagination={false}
          className="w-full"
        />
      </div>
    </>
  );
};

export default ItemTable;
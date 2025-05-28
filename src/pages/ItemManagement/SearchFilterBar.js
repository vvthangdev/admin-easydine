import React from "react";
import { Input, Select, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchFilterBar = ({ categories, onSearch, onFilter, onAddItem, onAddCategory }) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    onSearch(value);
  };

  return (
    <div className="flex flex-col mb-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Quản lý menu món ăn</h1>
      <Space direction="vertical" size="middle">
        <Input
          placeholder="Tìm kiếm món ăn theo tên"
          allowClear
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Lọc theo danh mục"
          onChange={onFilter}
          allowClear
          style={{ width: 200 }}
          onClear={() => onFilter("all")}
        >
          <Select.Option key="all" value="all">Tất cả</Select.Option>
          {categories
            .filter((cat) => cat && cat._id)
            .map((cat) => (
              <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
            ))}
        </Select>
        <Button
          type="primary"
          onClick={onAddCategory}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Thêm danh mục
        </Button>
        <Button
          type="primary"
          onClick={onAddItem}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Thêm món ăn mới
        </Button>
      </Space>
    </div>
  );
};

export default SearchFilterBar;
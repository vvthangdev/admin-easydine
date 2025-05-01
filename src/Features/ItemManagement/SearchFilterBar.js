import React from "react";
import { Input, Select, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons"; // Thêm icon tìm kiếm

const SearchFilterBar = ({ categories, onSearch, onFilter, onAddItem, onAddCategory }) => {
  // Hàm xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    onSearch(value); // Gọi hàm tìm kiếm với giá trị mới
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">Quản lý menu món ăn</h1>
      <Space>
        <Input
          placeholder="Tìm kiếm món ăn theo tên"
          allowClear
          onChange={handleSearchChange} // Sử dụng onChange thay vì onSearch
          prefix={<SearchOutlined />} // Thêm icon tìm kiếm
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
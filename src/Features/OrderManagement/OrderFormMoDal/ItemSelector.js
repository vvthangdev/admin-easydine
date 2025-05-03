import React, { useState, useEffect } from "react";
import { Table, Input, Button, Select } from "antd";
import { itemAPI } from "../../../services/apis/Item";

const { Option } = Select;

const ItemSelector = ({ setSelectedItems }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await itemAPI.getAllCategories();
      const categoriesData = Array.isArray(response)
        ? response
        : response.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchMenuItems = async (name = "", categoryId = null) => {
    setLoading(true);
    try {
      let response;
      if (categoryId) {
        response = await itemAPI.filterItemsByCategory(categoryId);
      } else if (name) {
        response = await itemAPI.searchItem({ name });
      } else {
        response = await itemAPI.getAllItem();
      }
      const items = response.item || response;
      setMenuItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchMenuItems(value, selectedCategory);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    fetchMenuItems(searchTerm, value);
  };

  const handleAddItem = (record) => {
    setSelectedItems((prev) => {
      const existing = prev.find(
        (item) => item.id === record._id && item.size === null
      );
      if (existing) {
        return prev.map((item) =>
          item.id === record._id && item.size === null
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: record._id,
          name: record.name,
          price: record.price,
          quantity: 1,
          size: null,
          note: "",
        },
      ];
    });
  };

  const columns = [
    { title: "Tên món", dataIndex: "name", key: "name" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString()} VND`,
    },
    {
      title: "Kích thước",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes) =>
        sizes?.length > 0
          ? sizes
              .map((s) => `${s.name} (${s.price.toLocaleString()} VND)`)
              .join(", ")
          : "Mặc định",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          className="text-blue-600 hover:text-blue-700"
          onClick={() => handleAddItem(record)}
        >
          Thêm
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn món ăn</h3>
      <div className="flex gap-4 mb-4">
        <Input.Search
          placeholder="Tìm kiếm món ăn"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          className="flex-1 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <Select
          placeholder="Lọc theo danh mục"
          value={selectedCategory}
          onChange={handleCategoryChange}
          allowClear
          className="w-48 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          onClear={() => handleCategoryChange(null)}
        >
          <Option value={null}>Tất cả</Option>
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={menuItems}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        size="small"
        className="text-sm text-gray-600 flex-1 overflow-y-auto"
        rowClassName="hover:bg-gray-100 transition-all duration-200"
      />
    </div>
  );
};

export default ItemSelector;

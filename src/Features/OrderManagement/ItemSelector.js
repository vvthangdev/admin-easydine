import React, { useState, useEffect } from "react";
import { Table, Input, Button, Select } from "antd";
import { itemAPI } from "../../services/apis/Item";

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

  const columns = [
    { title: "Tên món", dataIndex: "name", key: "name" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString()} VND`,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedItems((prev) => {
              const existing = prev.find((item) => item.id === record._id);
              if (existing) {
                return prev.map((item) =>
                  item.id === record._id
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
                },
              ];
            });
          }}
        >
          Thêm
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h3>Chọn món ăn</h3>
      <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
        <Input.Search
          placeholder="Tìm kiếm món ăn"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Lọc theo danh mục"
          value={selectedCategory}
          onChange={handleCategoryChange}
          allowClear
          style={{ width: "200px" }}
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
        style={{ flex: 1, overflowY: "auto" }}
      />
    </div>
  );
};

export default ItemSelector;

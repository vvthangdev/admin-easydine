import React, { useState, useEffect } from "react";
import { Table, Input, Button, Select, Modal, Form } from "antd";
import { itemAPI } from "../../services/apis/Item";

const { Option } = Select;

const ItemSelector = ({ setSelectedItems }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();

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

  const showAddItemModal = (record) => {
    setSelectedItem(record);
    form.setFieldsValue({
      size: null,
      note: "",
      quantity: 1,
    });
    setIsModalVisible(true);
  };

  const handleAddItem = () => {
    form.validateFields().then((values) => {
      setSelectedItems((prev) => {
        const existing = prev.find((item) => item.id === selectedItem._id && item.size === values.size);
        if (existing) {
          return prev.map((item) =>
            item.id === selectedItem._id && item.size === values.size
              ? { ...item, quantity: item.quantity + values.quantity, note: values.note }
              : item
          );
        }
        const sizeInfo = values.size
          ? selectedItem.sizes.find((s) => s.name === values.size)
          : null;
        return [
          ...prev,
          {
            id: selectedItem._id,
            name: selectedItem.name,
            price: sizeInfo ? sizeInfo.price : selectedItem.price,
            quantity: values.quantity,
            size: values.size || null,
            note: values.note || "",
          },
        ];
      });
      setIsModalVisible(false);
      form.resetFields();
      setSelectedItem(null);
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
          ? sizes.map((s) => `${s.name} (${s.price.toLocaleString()} VND)`).join(", ")
          : "Mặc định",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showAddItemModal(record)}>
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
      <Modal
        title={`Thêm ${selectedItem?.name}`}
        open={isModalVisible}
        onOk={handleAddItem}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setSelectedItem(null);
        }}
      >
        <Form form={form} layout="vertical">
          {selectedItem?.sizes?.length > 0 && (
            <Form.Item
              name="size"
              label="Kích thước"
              rules={[{ required: true, message: "Vui lòng chọn kích thước" }]}
            >
              <Select placeholder="Chọn kích thước">
                {selectedItem.sizes.map((size) => (
                  <Option key={size.name} value={size.name}>
                    {size.name} ({size.price.toLocaleString()} VND)
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input placeholder="Nhập ghi chú (ví dụ: Ít đá)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemSelector;
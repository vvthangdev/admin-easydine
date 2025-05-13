import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Select, Button, Modal, Typography } from "antd";
import { itemAPI } from "../../services/apis/Item";

const { Option } = Select;
const { Text } = Typography;

const ItemSelector = ({ setSelectedItems, menuItems, setMenuItems }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const fetchCategories = async () => {
    try {
      const categoriesData = await itemAPI.getAllCategories();
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchMenuItems = useCallback(async (name = "", categoryId = null) => {
    setLoading(true);
    try {
      let items;
      if (categoryId) {
        items = await itemAPI.filterItemsByCategory(categoryId);
      } else if (name) {
        items = await itemAPI.searchItem({ name });
      } else {
        items = await itemAPI.getAllItem();
      }
      setMenuItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [setMenuItems]);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [fetchMenuItems]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMenuItems(searchTerm, selectedCategory);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, fetchMenuItems]);

  const handleAddItem = (record) => {
    setSelectedItems((prev) => {
      const defaultSize = record.sizes?.length > 0 ? record.sizes[0].name : null;
      const price = defaultSize ? record.sizes[0].price : record.price;
      const existing = prev.find(
        (item) => item.id === record._id && item.size === defaultSize
      );
      if (existing) {
        return prev.map((item) =>
          item.id === record._id && item.size === defaultSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: record._id,
          name: record.name,
          price: price,
          quantity: 1,
          size: defaultSize,
          note: "",
        },
      ];
    });
  };

  const showDescriptionModal = (description) => {
    setSelectedDescription(description);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDescription("");
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="Món ăn"
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <Text type="secondary">Không có ảnh</Text>
        ),
    },
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
      render: (_, record) =>
        record.description ? (
          <Button
            type="link"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => showDescriptionModal(record.description)}
          >
            Chi tiết
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn món ăn</h3>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm món ăn"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <Select
          placeholder="Lọc theo danh mục"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          allowClear
          className="w-48 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          onClear={() => setSelectedCategory(null)}
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
        rowClassName="hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        onRow={(record) => ({
          onClick: (event) => {
            // Ngăn chặn sự kiện click trên nút "Chi tiết" kích hoạt thêm món
            if (event.target.tagName !== "BUTTON" && !event.target.closest("button")) {
              handleAddItem(record);
            }
          },
        })}
      />
      <Modal
        title="Thông tin món ăn"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
      >
        <Text>{selectedDescription || "Không có mô tả."}</Text>
      </Modal>
    </div>
  );
};

export default ItemSelector;
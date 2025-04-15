import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  InputNumber,
  Upload,
  Select,
} from "antd";
import { itemAPI } from "../../../services/apis/Item";
import { UploadOutlined } from "@ant-design/icons";
import { supabase } from "../../../supabase/supasbase";

export default function ItemManagements() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDeleteCategoryModalVisible, setIsDeleteCategoryModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);

  const fetchMenuItems = async (categoryId = null) => {
    setLoading(true);
    try {
      let response;
      if (categoryId) {
        response = await itemAPI.filterItemsByCategory(categoryId);
      } else {
        response = await itemAPI.getAllItem();
      }
      if (Array.isArray(response)) {
        setMenuItems(response);
      } else {
        setMenuItems(response.data || []);
      }
    } catch (error) {
      setError("Không thể tải danh sách món ăn");
      message.error("Lỗi khi tải danh sách món ăn");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await itemAPI.getAllCategories();
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories(response.data || []);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách danh mục");
      setCategories([]);
    }
  };

  const handleSearchByName = async (name) => {
    setLoading(true);
    try {
      if (!name) {
        fetchMenuItems(filterCategory);
      } else {
        const response = await itemAPI.searchItem({ name });
        console.log("Response from search:", response);
        
        // Lấy trực tiếp response.item
        const items = response.item || [];
        
        if (Array.isArray(items)) {
          setMenuItems(items);
          console.log("Updated menuItems:", items);
        } else {
          setMenuItems([]);
          message.error("Không tìm thấy món ăn nào khớp với tên");
        }
      }
    } catch (error) {
      setError("Không thể tìm kiếm món ăn");
      message.error("Lỗi khi tìm kiếm món ăn");
      setMenuItems([]);
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const categoryColumns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleDeleteCategory(record)}
          className="text-red-600 hover:text-red-800"
        >
          Xóa
        </Button>
      ),
    },
  ];

  const itemColumns = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>{text} VNĐ</span>,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img src={text} alt="item" className="w-12 h-12 object-cover rounded" />
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => (
        <span>{Array.isArray(categories) ? categories.map((cat) => cat.name).join(", ") : "Không có danh mục"}</span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          >
            Sửa
          </Button>
          <Button
            type="link"
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-800"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      categories: record.categories?.map((cat) => cat._id),
    });
    setFileList([
      { uid: "-1", name: record.image, status: "done", url: record.image },
    ]);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      setSelectedItem(record);
      setIsDeleteConfirmModalVisible(true);
    } catch (error) {
      message.error("Xóa món ăn không thành công");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      await itemAPI.deleteItem({ id: selectedItem._id });
      message.success("Xóa món ăn thành công");
      setMenuItems(menuItems.filter((item) => item._id !== selectedItem._id));
      setIsDeleteConfirmModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      message.error("Xóa món ăn không thành công");
      setIsDeleteConfirmModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmModalVisible(false);
    setSelectedItem(null);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let imageUrl = "";
  
      if (fileList?.length > 0 && fileList?.[0].originFileObj) {
        const file = fileList[0].originFileObj;
        const timestamp = Date.now();
        const fileName = `images/${timestamp}_${file.name}`;
  
        const { data, error } = await supabase.storage
          .from("test01")
          .upload(fileName, file);
  
        if (error) {
          throw new Error("Không thể upload file. Vui lòng thử lại.");
        }
  
        const { data: publicUrlData, error: publicUrlError } = supabase.storage
          .from("test01")
          .getPublicUrl(fileName);
  
        if (publicUrlError) {
          throw new Error("Không thể tạo URL công khai cho ảnh.");
        }
  
        imageUrl = publicUrlData.publicUrl;
      } else if (editingItem) {
        imageUrl = editingItem.image;
      }
  
      const requestData = {
        name: values.name,
        price: values.price,
        image: imageUrl,
        categories: values.categories,
      };
  
      if (editingItem) {
        const response = await itemAPI.updateItem({
          ...requestData,
          id: editingItem._id,
        });
        const updatedItem = response.Item;
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingItem._id ? updatedItem : item
          )
        );
        message.success("Cập nhật món ăn thành công");
      } else {
        const newItem = await itemAPI.addItem(requestData);
        setMenuItems([...menuItems, newItem]);
        message.success("Thêm món ăn mới thành công");
      }
  
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Lỗi khi thêm/sửa món ăn:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleAddCategory = () => {
    categoryForm.resetFields();
    setIsCategoryModalVisible(true);
  };

  const handleCategoryModalOk = async () => {
    try {
      const values = await categoryForm.validateFields();
      const newCategory = await itemAPI.createCategory(values);
      if (newCategory && newCategory._id) {
        setCategories([...categories, newCategory]);
        message.success("Tạo danh mục thành công");
        setIsCategoryModalVisible(false);
        categoryForm.resetFields();
      } else {
        throw new Error("Dữ liệu danh mục không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      message.error("Tạo danh mục không thành công");
    }
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setIsDeleteCategoryModalVisible(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await itemAPI.deleteCategory(selectedCategory._id);
      message.success("Xóa danh mục thành công");
      setCategories(
        categories.filter((cat) => cat._id !== selectedCategory._id)
      );
      fetchMenuItems(filterCategory);
      setIsDeleteCategoryModalVisible(false);
      setSelectedCategory(null);
    } catch (error) {
      message.error("Xóa danh mục không thành công");
      setIsDeleteCategoryModalVisible(false);
      setSelectedCategory(null);
    }
  };

  const handleCancelDeleteCategory = () => {
    setIsDeleteCategoryModalVisible(false);
    setSelectedCategory(null);
  };

  const handleFilterByCategory = (categoryId) => {
    setFilterCategory(categoryId);
    if (categoryId === "all") {
      fetchMenuItems(null);
    } else {
      fetchMenuItems(categoryId);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý menu món ăn
        </h1>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm món ăn theo tên"
            allowClear
            onSearch={(value) => handleSearchByName(value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo danh mục"
            onChange={handleFilterByCategory}
            allowClear
            style={{ width: 200 }}
            onClear={() => handleFilterByCategory("all")}
          >
            <Select.Option key="all" value="all">
              Tất cả
            </Select.Option>
            {Array.isArray(categories) &&
              categories
                .filter((cat) => cat && cat._id)
                .map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Select.Option>
                ))}
          </Select>
          <Button
            type="primary"
            onClick={handleAddCategory}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Thêm danh mục
          </Button>
          <Button
            type="primary"
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Thêm món ăn mới
          </Button>
        </Space>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <h2 className="text-lg font-semibold p-4">Danh sách món ăn</h2>
        <Table
          columns={itemColumns}
          dataSource={menuItems}
          rowKey="_id"
          loading={loading}
          className="w-full"
          pagination={{ pageSize: 5 }}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Danh sách danh mục</h2>
        <Table
          columns={categoryColumns}
          dataSource={Array.isArray(categories) ? categories.filter((cat) => cat && cat._id) : []}
          rowKey="_id"
          pagination={false}
          className="w-full"
        />
      </div>

      <Modal
        title={editingItem ? "Sửa thông tin món ăn" : "Thêm món ăn mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        className="rounded-lg"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên món"
            rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}
          >
            <Input placeholder="Nhập tên món" className="border rounded-md" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber
              className="w-full border rounded-md"
              placeholder="Nhập giá"
            />
          </Form.Item>
          <Form.Item
            name="categories"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất một danh mục!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn danh mục"
              allowClear
              style={{ width: "100%" }}
            >
              {Array.isArray(categories) &&
                categories
                  .filter((cat) => cat && cat._id)
                  .map((cat) => (
                    <Select.Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Select.Option>
                  ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ảnh">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button
                icon={<UploadOutlined />}
                className="bg-blue-500 text-white rounded-md"
              >
                Chọn ảnh
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa món ăn"
        open={isDeleteConfirmModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        className="rounded-lg"
      >
        <p>
          Bạn có chắc chắn muốn xóa món ăn <strong>{selectedItem?.name}</strong>{" "}
          không? Hành động này không thể hoàn tác.
        </p>
      </Modal>

      <Modal
        title="Thêm danh mục mới"
        open={isCategoryModalVisible}
        onOk={handleCategoryModalOk}
        onCancel={() => {
          setIsCategoryModalVisible(false);
          categoryForm.resetFields();
        }}
        className="rounded-lg"
      >
        <Form form={categoryForm} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" className="border rounded-md" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input placeholder="Nhập mô tả" className="border rounded-md" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa danh mục"
        open={isDeleteCategoryModalVisible}
        onOk={handleConfirmDeleteCategory}
        onCancel={handleCancelDeleteCategory}
        okText="Xóa"
        cancelText="Hủy"
        className="rounded-lg"
      >
        <p>
          Bạn có chắc chắn muốn xóa danh mục{" "}
          <strong>{selectedCategory?.name}</strong> không? Hành động này sẽ xóa
          danh mục khỏi tất cả món ăn liên quan.
        </p>
      </Modal>
    </div>
  );
}
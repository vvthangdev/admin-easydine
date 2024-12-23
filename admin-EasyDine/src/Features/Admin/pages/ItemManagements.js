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
} from "antd";
import { itemAPI } from "../../../services/apis/Item"; // Giả sử bạn có một API cho menu
import { UploadOutlined } from "@ant-design/icons";
import { supabase } from "../../../supabase/supasbase";
import { itemCategoryAPI } from "../../../services/apis/ItemCategory"; // Đảm bảo bạn đã cấu hình Supabase

export default function ItemManagements() {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // State để lưu trữ file ảnh
  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModelVisible] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await itemAPI.getAllItem(); // Lấy danh sách món ăn
      setMenuItems(response);
      console.log("check menu", response);
    } catch (error) {
      setError("Không thể tải danh sách món ăn");
      message.error("Lỗi khi tải danh sách món ăn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const columns = [
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
      ), // Hiển thị ảnh
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
    setFileList([]); // Reset file list
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log("check record", record);
    setEditingItem(record);
    form.setFieldsValue(record);
    setFileList([
      { uid: "-1", name: record.image, status: "done", url: record.image },
    ]); // Set file list for editing
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      setSelectedItem(record);
      setIsDeleteConfirmModelVisible(true);
      //   await itemAPI.deleteItem(record); // Xóa món ăn
      //   setMenuItems(menuItems.filter((item) => item.id !== record.id));
      //   message.success("Xóa món ăn thành công");
    } catch (error) {
      message.error("Xóa món ăn không thành công");
    }
  };

  const handleCofirmDelete = async (record) => {
    if (!selectedItem) return;

    try {
      await itemAPI.deleteItem(selectedItem);
      message.success("Xóa món ăn thành công");
      setMenuItems(menuItems.filter((item) => item.id !== selectedItem.id));
    } catch (error) {
      message.error("Xóa món ăn không thành công");
    } finally {
      setIsDeleteConfirmModelVisible(false);
      setSelectedItem(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmModelVisible(false);
    setSelectedItem(null);
  };

  const handleModalOk = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();
      let imageUrl = "";

      // Kiểm tra và upload file ảnh lên Supabase
      if (fileList?.length > 0 && fileList?.[0].originFileObj) {
        try {
          const file = fileList[0].originFileObj;
          const timestamp = Date.now(); // Tạo tên file duy nhất
          const fileName = `images/${timestamp}_${file.name}`; // Đường dẫn file trong bucket

          // Upload file lên bucket 'test01'
          const { data, error } = await supabase.storage
            .from("test01") // Thay 'test01' bằng tên bucket thực tế của bạn
            .upload(fileName, file);

          if (error) {
            console.error("Lỗi khi upload file lên Supabase:", error);
            throw new Error("Không thể upload file. Vui lòng thử lại.");
          }

          // Lấy URL công khai của ảnh
          const { data: publicUrlData, error: publicUrlError } =
            supabase.storage.from("test01").getPublicUrl(fileName);

          if (publicUrlError) {
            console.error("Lỗi khi lấy URL công khai:", publicUrlError);
            throw new Error("Không thể tạo URL công khai cho ảnh.");
          }

          imageUrl = publicUrlData.publicUrl; // Lưu URL ảnh vào biến
        } catch (uploadError) {
          console.error("Lỗi khi xử lý file upload:", uploadError);
          throw uploadError; // Ném lỗi để xử lý ngoài hàm
        }
      } else if (editingItem) {
        // Nếu không có file mới, sử dụng URL ảnh cũ
        imageUrl = editingItem.image;
      }

      // Chuẩn bị dữ liệu để gửi lên server
      const requestData = {
        name: values.name,
        price: values.price,
        image: imageUrl, // URL ảnh
      };

      if (editingItem) {
        // Cập nhật món ăn
        await itemAPI.updateItem({ ...requestData, id: editingItem.id });

        // Cập nhật danh sách món ăn trong state
        setMenuItems(
          menuItems.map((item) =>
            item.id === editingItem.id ? { ...item, ...requestData } : item
          )
        );

        message.success("Cập nhật món ăn thành công");
      } else {
        // Thêm món ăn mới
        const newItem = await itemAPI.addItem(requestData);

        // Cập nhật danh sách món ăn trong state
        setMenuItems([...menuItems, newItem]);

        message.success("Thêm món ăn mới thành công");
      }

      // Đóng modal, reset form và danh sách file
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Lỗi khi thêm/sửa món ăn:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList); // Cập nhật file list khi người dùng chọn ảnh
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý menu món ăn
        </h1>
        <Button
          type="primary"
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Thêm món ăn mới
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          columns={columns}
          dataSource={menuItems}
          rowKey="id"
          loading={loading}
          className="w-full"
          pagination={{ pageSize: 5 }} // Thêm phân trang
        />
      </div>

      <Modal
        title={editingItem ? "Sửa thông tin món ăn" : "Thêm món ăn mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setFileList([]); // Reset file list
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
          <Form.Item label="Ảnh">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Ngăn không cho tự động upload
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
        onOk={handleCofirmDelete}
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
    </div>
  );
}

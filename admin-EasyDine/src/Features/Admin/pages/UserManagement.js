import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, message } from "antd";
import { userAPI } from "../../../services/apis/User";
import { adminAPI } from "../../../services/apis/Admin"; // Giả sử bạn có một API cho contact

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUser(); // Lấy danh sách người dùng
      setUsers(response);
      console.log("check list user:", users);
    } catch (error) {
      setError("Không thể tải danh sách người dùng");
      message.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
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
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      // Gửi yêu cầu DELETE với body chứa thông tin username
      const response = await adminAPI.deleteUser({
        method: "DELETE", // Hoặc 'POST' nếu bạn sử dụng POST để xóa
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: record.username }), // Dữ liệu body là JSON
      });
      setUsers(users.filter((user) => user.id !== record.id)); // Cập nhật danh sách người dùng
      message.success("Xóa người dùng thành công");
    } catch (error) {
      message.error("Xóa người dùng không thành công");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        // Gửi yêu cầu PATCH để cập nhật người dùng
        await adminAPI.updateUser(editingUser.id, {
          name: values.name,
          phone: values.phone,
          address: values.address,
        });

        // Cập nhật danh sách người dùng trong state
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? { ...user, ...values } : user
          )
        );
        message.success("Cập nhật người dùng thành công");
      } else {
        // Logic thêm người dùng mới (nếu cần)
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý người dùng
        </h1>
        {/*<Button*/}
        {/*    type="primary"*/}
        {/*    onClick={handleAdd}*/}
        {/*    className="bg-blue-500 hover:bg-blue-600"*/}
        {/*>*/}
        {/*    Thêm người dùng mới*/}
        {/*</Button>*/}
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          className="w-full"
        />
      </div>

      <Modal
        title={editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên người dùng"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
            ]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            // rules={[
            //   { required: true, message: "Vui lòng nhập số điện thoại!" },
            //     { pattern: /^[0-9]+$/, message: "Số điện thoại không hợp lệ!" },
            // ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            // rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

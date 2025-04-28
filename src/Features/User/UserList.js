import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Select,
} from "antd";
import { userAPI } from "../../services/apis/User";
import { adminAPI } from "../../services/apis/Admin";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUser();
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      message.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    setLoading(true);
    try {
      if (!query) {
        setFilteredUsers(users);
      } else {
        const response = await userAPI.searchUsers(query);
        setFilteredUsers(response);
      }
    } catch (error) {
      message.error("Lỗi khi tìm kiếm người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchUsers(value);
  };

  const columns = [
    { 
      title: "Tên", 
      dataIndex: "name", 
      key: "name", 
      width: "20%", 
      ellipsis: true 
    },
    { 
      title: "Username", 
      dataIndex: "username", 
      key: "username", 
      width: "20%", 
      ellipsis: true, 
      className: "hidden sm:table-cell" 
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email", 
      width: "25%", 
      ellipsis: true, 
      className: "hidden sm:table-cell" 
    },
    { 
      title: "Số điện thoại", 
      dataIndex: "phone", 
      key: "phone", 
      width: "20%", 
      ellipsis: true, 
      className: "hidden sm:table-cell" 
    },
    { 
      title: "Địa chỉ", 
      dataIndex: "address", 
      key: "address", 
      width: "25%", 
      ellipsis: true, 
      className: "hidden lg:table-cell" 
    },
    { 
      title: "Vai trò", 
      dataIndex: "role", 
      key: "role", 
      width: "15%", 
      ellipsis: true 
    },
    {
      title: "Thao tác",
      key: "action",
      width: "25%",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
          <Button type="link" onClick={() => onSelectUser(record)}>
            Chọn
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      password: "",
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await adminAPI.deleteUser(record.username);
      setUsers(users.filter((user) => user._id !== record._id));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== record._id));
      message.success("Xóa người dùng thành công");
    } catch (error) {
      message.error("Xóa người dùng không thành công");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const userData = {
        email: values.email,
        username: values.username,
        name: values.name,
        phone: values.phone,
        role: values.role,
        address: values.address,
        avatar: values.avatar || "",
        ...(values.password && { password: values.password }),
      };

      if (editingUser) {
        await userAPI.adminUpdateUser(editingUser._id, userData);
        const updatedUser = { ...editingUser, ...userData };
        setUsers(
          users.map((user) =>
            user._id === editingUser._id ? updatedUser : user
          )
        );
        setFilteredUsers(
          filteredUsers.map((user) =>
            user._id === editingUser._id ? updatedUser : user
          )
        );
        message.success("Cập nhật người dùng thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật người dùng";
      message.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
        <Input
          placeholder="Tìm kiếm theo tên, số điện thoại hoặc ID"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-64 lg:w-80"
        />
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSizeOptions: [10, 20], // Tùy chọn 10 hoặc 20 người mỗi trang
            defaultPageSize: 10, // Mặc định 10 người mỗi trang
            showSizeChanger: true, // Hiển thị tùy chọn thay đổi số lượng
            showTotal: (total) => `Tổng cộng ${total} người dùng`, // Hiển thị tổng số
          }}
          className="min-w-0"
          tableLayout="fixed"
        />
      </div>
      <Modal
        title="Sửa thông tin người dùng"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Vui lòng nhập username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại phải có 10 chữ số!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select>
              <Select.Option value="CUSTOMER">Khách hàng</Select.Option>
              <Select.Option value="STAFF">Nhân viên</Select.Option>
              <Select.Option value="ADMIN">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="avatar" label="URL Avatar">
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu mới (để trống nếu không đổi)"
            rules={[
              {
                min: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự!",
                validator: (_, value) =>
                  value && value.length < 8
                    ? Promise.reject(new Error("Mật khẩu phải có ít nhất 8 ký tự!"))
                    : Promise.resolve(),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
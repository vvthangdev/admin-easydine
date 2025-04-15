import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Input as SearchInput,
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
      setFilteredUsers(response); // Ban đầu hiển thị tất cả
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
        setFilteredUsers(users); // Nếu không có từ khóa, hiển thị tất cả
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
    searchUsers(value); // Gọi API tìm kiếm
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
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
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await adminAPI.deleteUser({
        method: "DELETE",
        body: JSON.stringify({ username: record.username }),
      });
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
      if (editingUser) {
        await adminAPI.updateUser(editingUser._id, {
          name: values.name,
          phone: values.phone,
          address: values.address,
        });
        setUsers(
          users.map((user) =>
            user._id === editingUser._id ? { ...user, ...values } : user
          )
        );
        setFilteredUsers(
          filteredUsers.map((user) =>
            user._id === editingUser._id ? { ...user, ...values } : user
          )
        );
        message.success("Cập nhật người dùng thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật người dùng");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
        <SearchInput
          placeholder="Tìm kiếm theo tên, số điện thoại hoặc ID"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
      />
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
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
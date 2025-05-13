import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Select,
  Upload,
} from "antd";
import { userAPI } from "../../services/apis/User";
import { adminAPI } from "../../services/apis/Admin";
import { UploadOutlined } from "@ant-design/icons";
import minioClient from "../../Server/minioClient.js";

import placeholderImage from "../../assets/images/user_place_holder.jpg";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [avatar, setAvatar] = useState([]); // State để lưu file ảnh upload

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUser();
      const data = Array.isArray(response) ? response : [];
      console.log("Fetched users:", data);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách người dùng: " + error.message);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = useCallback(async (query) => {
    setLoading(true);
    try {
      if (!query) {
        setFilteredUsers(users);
      } else {
        const response = await userAPI.searchUsers(query);
        const data = Array.isArray(response) ? response : [];
        console.log("Searched users:", data);
        setFilteredUsers(data);
      }
    } catch (error) {
      message.error("Lỗi khi tìm kiếm người dùng: " + error.message);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, [users]); // Thêm dependency `users`

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    searchUsers(searchTerm);
  }, [searchTerm, searchUsers]); // Tự động gọi searchUsers khi searchTerm thay đổi

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      width: "10%",
      render: (avatar) => (
        <img
          src={avatar || ''}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = `${placeholderImage}`;
          }}
        />
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "15%",
      ellipsis: true,
      className: "hidden sm:table-cell",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ellipsis: true,
      className: "hidden sm:table-cell",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "15%",
      ellipsis: true,
      className: "hidden sm:table-cell",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: "20%",
      ellipsis: true,
      className: "hidden lg:table-cell",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: "10%",
      ellipsis: true,
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
    setAvatar(record.avatar ? [{ url: record.avatar, uid: "1" }] : []);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await adminAPI.deleteUser(record.username);
      const updatedUsers = users.filter((user) => user._id !== record._id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      message.success("Xóa người dùng thành công");
    } catch (error) {
      message.error("Xóa người dùng không thành công: " + error.message);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setAvatar(fileList);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let imageUrl = editingUser?.avatar || "";

      if (avatar?.length > 0 && avatar?.[0]?.originFileObj) {
        const timestamp = Date.now();
        const file = avatar[0].originFileObj;
        const fileName = `images/${timestamp}_${file.name}`;
        
        const minioStorage = minioClient.storage.from("test01");
        const { error } = await minioStorage.upload(fileName, file);

        if (error) {
          throw new Error(`Không thể upload file: ${error.message}`);
        }

        const { data: publicUrlData } = minioStorage.getPublicUrl(fileName);
        if (!publicUrlData.publicUrl) {
          throw new Error("Không thể lấy URL công khai cho ảnh.");
        }

        imageUrl = publicUrlData.publicUrl;
      }

      const userData = {
        email: values.email,
        username: values.username,
        name: values.name,
        phone: values.phone,
        role: values.role,
        address: values.address,
        avatar: imageUrl,
        ...(values.password && { password: values.password }),
      };

      if (editingUser) {
        await userAPI.adminUpdateUser(editingUser._id, userData);
        const updatedUser = { ...editingUser, ...userData };
        const updatedUsers = users.map((user) =>
          user._id === editingUser._id ? updatedUser : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        message.success("Cập nhật người dùng thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setAvatar([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra khi cập nhật người dùng";
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
          dataSource={Array.isArray(filteredUsers) ? filteredUsers : []}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSizeOptions: [10, 20],
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} người dùng`,
          }}
          className="min-w-0"
          tableLayout="fixed"
        />
      </div>
      <Modal
        title="Sửa thông tin người dùng"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setAvatar(editingUser?.avatar ? [{ url: editingUser.avatar, uid: "1" }] : []);
        }}
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
          <Form.Item label="Ảnh đại diện">
            <Upload
              listType="picture"
              fileList={avatar}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
            </Upload>
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
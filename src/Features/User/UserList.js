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
  Upload,
} from "antd";
import { userAPI } from "../../services/apis/User";
import { adminAPI } from "../../services/apis/Admin";
import { UploadOutlined } from "@ant-design/icons";
import minioClient from "../../Server/minioClient.js";

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
    // Khởi tạo avatar nếu có, để hiển thị ảnh hiện tại trong Upload component
    setAvatar(record.avatar ? [{ url: record.avatar, uid: "1" }] : []);
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

  const handleUploadChange = ({ fileList }) => {
    setAvatar(fileList);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let imageUrl = editingUser.avatar || ""; // Giữ URL ảnh hiện tại nếu không upload ảnh mới

      // Nếu có file ảnh mới được upload
      if (avatar?.length > 0 && avatar?.[0]?.originFileObj) {
        const timestamp = Date.now();
        const file = avatar[0].originFileObj;
        const fileName = `images/${timestamp}_${file.name}`;
        const { error } = await minioClient.storage
          .from("test01")
          .upload(fileName, file);

        if (error) {
          throw new Error("Không thể upload file. Vui lòng thử lại.");
        }

        const { data: publicUrlData, error: publicUrlError } =
          minioClient.storage.from("test01").getPublicUrl(fileName);

        if (publicUrlError) {
          throw new Error("Không thể tạo URL công khai cho ảnh.");
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
        avatar: imageUrl, // Cập nhật URL ảnh
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
      setAvatar([]); // Reset avatar sau khi lưu
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật người dùng";
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
          setAvatar(
            editingUser.avatar ? [{ url: editingUser.avatar, uid: "1" }] : []
          );
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
              beforeUpload={() => false} // Ngăn upload tự động, xử lý trong handleModalOk
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
                    ? Promise.reject(
                        new Error("Mật khẩu phải có ít nhất 8 ký tự!")
                      )
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

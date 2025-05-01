import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message, Upload } from "antd";
import { userAPI } from "../../services/apis/User";
import { UploadOutlined } from "@ant-design/icons";
import minioClient from "../../Server/minioClient.js";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [password, setPassword] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getUserInfo();
        setProfile(response);
        form.setFieldsValue({
          name: response.name,
          email: response.email,
          phone: response.phone,
          address: response.address,
        });
        setAvatar(response.avatar ? [{ url: response.avatar, uid: "1" }] : []);
      } catch (error) {
        message.error("Lỗi khi tải thông tin hồ sơ");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [form, navigate]);
  

  const handleEdit = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let imageUrl = profile.avatar || "";

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

      const requestData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        avatar: imageUrl,
      };

      await userAPI.updateUser(requestData);
      setProfile({ ...profile, ...requestData });
      message.success("Cập nhật hồ sơ thành công");
      setIsModalVisible(false);
      setAvatar(imageUrl ? [{ url: imageUrl, uid: "1" }] : []);
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setAvatar(fileList);
  };

  const handleDeleteUser = async () => {
    if (!password) {
      message.error("Vui lòng nhập mật khẩu!");
      return;
    }
    const token = localStorage.getItem("accessToken");
    try {
      const requestData = {
        password,
        accessToken: token,
      };
      await userAPI.deleteUser(requestData);
      setProfile(null);
      setIsDeleteModalVisible(false);
      message.success("Xóa hồ sơ thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi xóa hồ sơ:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa hồ sơ."
      );
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Quản lý hồ sơ cá nhân
          </h1>
          <div>
            <Button
              type="primary"
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-600 transition duration-300 mr-2"
            >
              Chỉnh sửa hồ sơ
            </Button>
            <Button type="danger" onClick={() => setIsDeleteModalVisible(true)}>
              Xóa hồ sơ
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
        ) : profile ? (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-4">
              <img
                src={profile.avatar || "https://via.placeholder.com/150"} // Ảnh mặc định nếu không có avatar
                alt="Avatar"
                className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4 object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Thông tin cá nhân
                </h2>
                <p className="text-gray-700">
                  <strong>Tên:</strong> {profile.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {profile.email}
                </p>
                <p className="text-gray-700">
                  <strong>Số điện thoại:</strong> {profile.phone}
                </p>
                <p className="text-gray-700">
                  <strong>Địa chỉ:</strong> {profile.address}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Không có thông tin hồ sơ.</p>
        )}

        <Modal
          title="Chỉnh sửa hồ sơ cá nhân"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setAvatar(
              profile.avatar ? [{ url: profile.avatar, uid: "1" }] : []
            );
          }}
          className="rounded-lg"
        >
          <Form form={form} layout="vertical" className="mt-4">
            <Form.Item
              name="name"
              label="Tên"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input placeholder="Nhập tên" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input placeholder="Nhập địa chỉ" />
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
          </Form>
        </Modal>

        <Modal
          title="Xác nhận xóa hồ sơ"
          open={isDeleteModalVisible}
          onOk={handleDeleteUser}
          onCancel={() => {
            setIsDeleteModalVisible(false);
            setPassword("");
          }}
          okText="Xóa"
          cancelText="Hủy"
          className="rounded-lg"
        >
          <p>
            Bạn có chắc chắn muốn xóa hồ sơ này không? Hành động này không thể
            hoàn tác.
          </p>
          <Form layout="vertical">
            <Form.Item
              label="Nhập mật khẩu để xác nhận"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

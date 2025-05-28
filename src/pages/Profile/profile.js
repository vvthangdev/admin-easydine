import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, Upload } from 'antd';
import { userAPI } from '../../services/apis/User';
import { UploadOutlined } from '@ant-design/icons';
import minioClient from '../../Server/minioClient.js';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Avatar, Button as MuiButton } from '@mui/material';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [password, setPassword] = useState('');
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
        setAvatar(response.avatar ? [{ url: response.avatar, uid: '1' }] : []);
      } catch (error) {
        message.error('Lỗi khi tải thông tin hồ sơ');
        navigate('/login');
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
      let imageUrl = profile.avatar || '';

      if (avatar?.length > 0 && avatar?.[0]?.originFileObj) {
        const timestamp = Date.now();
        const file = avatar[0].originFileObj;
        const fileName = `images/${timestamp}_${file.name}`;
        const { error } = await minioClient.storage
          .from('test01')
          .upload(fileName, file);

        if (error) {
          throw new Error('Không thể upload file. Vui lòng thử lại.');
        }

        const { data: publicUrlData, error: publicUrlError } =
          minioClient.storage.from('test01').getPublicUrl(fileName);

        if (publicUrlError) {
          throw new Error('Không thể tạo URL công khai cho ảnh.');
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
      message.success('Cập nhật hồ sơ thành công');
      setIsModalVisible(false);
      setAvatar(imageUrl ? [{ url: imageUrl, uid: '1' }] : []);
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setAvatar(fileList);
  };

  const handleDeleteUser = async () => {
    if (!password) {
      message.error('Vui lòng nhập mật khẩu!');
      return;
    }
    const token = localStorage.getItem('accessToken');
    try {
      const requestData = {
        password,
        accessToken: token,
      };
      await userAPI.deleteUser(requestData);
      setProfile(null);
      setIsDeleteModalVisible(false);
      message.success('Xóa hồ sơ thành công!');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi xóa hồ sơ:', error);
      message.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi xóa hồ sơ.'
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 6,
        background: 'linear-gradient(to bottom right, #fff7e6, #fefcbf)',
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            bgcolor: 'white',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Quản lý hồ sơ cá nhân
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <MuiButton
                  variant="contained"
                  onClick={handleEdit}
                  sx={{
                    bgcolor: '#1976d2',
                    '&:hover': { bgcolor: '#1565c0' },
                    transition: 'all 0.3s',
                  }}
                >
                  Chỉnh sửa hồ sơ
                </MuiButton>
                <MuiButton
                  variant="contained"
                  color="error"
                  onClick={() => setIsDeleteModalVisible(true)}
                >
                  Xóa hồ sơ
                </MuiButton>
              </Box>
            </Box>

            {loading ? (
              <Typography color="text.secondary">Đang tải thông tin hồ sơ...</Typography>
            ) : profile ? (
              <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    src={profile.avatar || 'https://via.placeholder.com/150'}
                    alt="Avatar"
                    sx={{
                      width: 96,
                      height: 96,
                      border: '2px solid #e0e0e0',
                      mr: 4,
                      objectFit: 'cover',
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      Thông tin cá nhân
                    </Typography>
                    <Typography color="text.secondary">
                      <strong>Tên:</strong> {profile.name}
                    </Typography>
                    <Typography color="text.secondary">
                      <strong>Email:</strong> {profile.email}
                    </Typography>
                    <Typography color="text.secondary">
                      <strong>Số điện thoại:</strong> {profile.phone}
                    </Typography>
                    <Typography color="text.secondary">
                      <strong>Địa chỉ:</strong> {profile.address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography color="text.secondary">Không có thông tin hồ sơ.</Typography>
            )}
          </CardContent>
        </Card>

        <Modal
          title="Chỉnh sửa hồ sơ cá nhân"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setAvatar(profile.avatar ? [{ url: profile.avatar, uid: '1' }] : []);
          }}
          okText="Lưu"
          cancelText="Hủy"
          style={{ borderRadius: 8 }}
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              name="name"
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input placeholder="Nhập tên" size="large" style={{ height: 48 }} />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input placeholder="Nhập email" size="large" style={{ height: 48 }} />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input placeholder="Nhập số điện thoại" size="large" style={{ height: 48 }} />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input placeholder="Nhập địa chỉ" size="large" style={{ height: 48 }} />
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
            setPassword('');
          }}
          okText="Xóa"
          cancelText="Hủy"
          style={{ borderRadius: 8 }}
        >
          <Typography sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa hồ sơ này không? Hành động này không thể hoàn tác.
          </Typography>
          <Form layout="vertical">
            <Form.Item
              label="Nhập mật khẩu để xác nhận"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                size="large"
                style={{ height: 48 }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Box>
    </Box>
  );
}
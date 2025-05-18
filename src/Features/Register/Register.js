import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { authAPI } from '../../services/apis/Auth';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Button as MuiButton } from '@mui/material';

export default function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password, username, name, phone, address } = values;
    const requestData = { email, password, username, name, phone, address };
    try {
      setLoading(true);
      const response = await authAPI.register(requestData);
      console.log(response);
      message.success('Đăng ký thành công!');
      navigate('/login');
    } catch (error) {
      const errorMessage = error?.response?.data || 'Đăng ký thất bại!';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(to bottom right, #fff7e6, #fefcbf)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <MuiButton
          variant="outlined"
          startIcon={<HomeOutlined />}
          onClick={() => navigate('/')}
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderColor: '#f59e0b',
            color: '#f59e0b',
            '&:hover': { bgcolor: '#fff3bf', borderColor: '#d97706' },
            transition: 'all 0.3s',
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 320,
          height: 320,
          borderRadius: '50%',
          bgcolor: '#f59e0b',
          opacity: 0.2,
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 320,
          height: 320,
          borderRadius: '50%',
          bgcolor: '#facc15',
          opacity: 0.2,
          filter: 'blur(40px)',
        }}
      />

      <Box sx={{ maxWidth: 400, width: '100%', mx: 2, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: -4,
            background: 'linear-gradient(to right, #f59e0b, #facc15)',
            borderRadius: 2,
            opacity: 0.5,
            filter: 'blur(10px)',
            zIndex: -1,
          }}
        />

        <Card
          style={{
            padding: 32,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 8,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -64,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 128,
              height: 128,
              borderRadius: '50%',
              bgcolor: 'white',
              p: 0.5,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(to right, #f59e0b, #facc15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h2" color="white">
                🍽️
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 16, mb: 8 }}>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              Tạo Tài Khoản
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 1, bgcolor: '#f59e0b' }} />
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                Trải nghiệm ẩm thực của chúng tôi
              </Typography>
              <Box sx={{ width: 48, height: 1, bgcolor: '#f59e0b' }} />
            </Box>
          </Box>

          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            style={{ marginTop: 24 }}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên của bạn!' },
                { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#f59e0b' }} />}
                placeholder="Họ và Tên"
                size="large"
                style={{
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderColor: '#d4a017',
                }}
              />
            </Form.Item>
            <Form.Item
              name="address"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ của bạn!' },
                { min: 2, message: 'Địa chỉ phải có ít nhất 2 ký tự!' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#f59e0b' }} />}
                placeholder="Địa chỉ"
                size="large"
                style={{
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderColor: '#d4a017',
                }}
              />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Vui lòng nhập tên người dùng!' },
                { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự!' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Tên người dùng chỉ có thể chứa chữ cái, số và dấu gạch dưới!' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#f59e0b' }} />}
                placeholder="Tên người dùng"
                size="large"
                style={{
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderColor: '#d4a017',
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
                { required: true, message: 'Vui lòng nhập email của bạn!' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#f59e0b' }} />}
                placeholder="Email"
                size="large"
                style={{
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderColor: '#d4a017',
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại của bạn!' },
                { pattern: /^[0-9]+$/, message: 'Vui lòng nhập số điện thoại hợp lệ!' },
                { min: 10, max: 11, message: 'Số điện thoại phải có từ 10-11 chữ số!' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: '#f59e0b' }} />}
                placeholder="Số điện thoại"
                size="large"
                style={{
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderColor: '#d4a017',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#f59e0b' }} />}
                placeholder="Mật khẩu"
                size="large"
                style={{
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderColor: '#d4a017',
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#f59e0b' }} />}
                placeholder="Xác nhận mật khẩu"
                size="large"
                style={{
                  height: 48,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderColor: '#d4a017',
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{
                  height: 48,
                  background: 'linear-gradient(to right, #f59e0b, #facc15)',
                  border: 0,
                  fontSize: '1.125rem',
                  fontFamily: 'serif',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                Đăng ký
              </Button>
            </Form.Item>

            <Box sx={{ textAlign: 'center', color: '#f59e0b' }}>
              Bạn đã có tài khoản?{' '}
              <MuiButton
                component={Link}
                to="/login"
                sx={{ color: '#f59e0b', fontWeight: 'bold', '&:hover': { color: '#b45309' } }}
              >
                Đăng nhập
              </MuiButton>
            </Box>

            <Box sx={{ pt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 1,
                  background: 'linear-gradient(to right, transparent, #f59e0b, transparent)',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                ✦
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 1,
                  background: 'linear-gradient(to right, transparent, #f59e0b, transparent)',
                }}
              />
            </Box>
          </Form>
        </Card>
      </Box>
    </Box>
  );
}
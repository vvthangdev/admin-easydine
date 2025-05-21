import { Form, Input, Button, Card, Checkbox, message } from 'antd';
import {
  LockOutlined,
  MailOutlined,
  HomeOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import { authAPI } from '../../services/apis/Auth';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, Button as MuiButton } from '@mui/material';

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get('accessToken');
    const refreshToken = query.get('refreshToken');
    const userData = query.get('userData');
    const error = query.get('error');

    if (error) {
      message.error('Đăng nhập Google thất bại! Vui lòng thử lại.');
      setGoogleLoading(false);
      return;
    }

    if (accessToken && refreshToken && userData) {
      try {
        const parsedUserData = JSON.parse(decodeURIComponent(userData));
        const cleanAccessToken = accessToken.replace(/^Bearer\s+/, '');
        const cleanRefreshToken = refreshToken.replace(/^Bearer\s+/, '');
        login({
          accessToken: cleanAccessToken,
          refreshToken: cleanRefreshToken,
          userData: parsedUserData,
        });
        message.success('Đăng nhập Google thành công!');
        // Use role from parsed userData for navigation
        if (parsedUserData.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        window.history.replaceState({}, document.title, '/login');
      } catch (err) {
        message.error('Lỗi xử lý dữ liệu Google login!');
        console.error(err);
        setGoogleLoading(false);
      }
    }
  }, [location, login, navigate]);

  const handleSubmit = async (values) => {
    const { email, password } = values;
    const requestData = { email, password };

    try {
      setLoading(true);
      const response = await authAPI.login(requestData);
      const cleanResponse = {
        ...response,
        accessToken: response.accessToken.replace(/^Bearer\s+/, ''),
        refreshToken: response.refreshToken ? response.refreshToken.replace(/^Bearer\s+/, '') : response.refreshToken,
      };
      login(cleanResponse);
      message.success('Đăng nhập thành công!');
      // Use role from response for navigation
      if (cleanResponse.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.message || 'Đăng nhập thất bại!';
      console.log(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    message.loading('Đang chuyển hướng đến Google...', 0);
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/users/auth/google`;
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

          <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              Chào mừng!
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 1, bgcolor: '#f59e0b' }} />
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                Trải nghiệm ẩm thực tuyệt vời
              </Typography>
              <Box sx={{ width: 48, height: 1, bgcolor: '#f59e0b' }} />
            </Box>
          </Box>

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            style={{ marginTop: 24 }}
          >
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#f59e0b' }}>Ghi nhớ tôi</Checkbox>
              </Form.Item>
              <MuiButton
                component={Link}
                to="/forgot-password"
                sx={{ color: '#f59e0b', '&:hover': { color: '#b45309' } }}
              >
                Quên mật khẩu?
              </MuiButton>
            </Box>

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
                Đăng nhập
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="default"
                size="large"
                block
                onClick={handleGoogleLogin}
                loading={googleLoading}
                style={{
                  height: 48,
                  background: 'white',
                  borderColor: '#d4a017',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <GoogleOutlined style={{ color: '#db4437' }} />
                Đăng nhập bằng Google
              </Button>
            </Form.Item>

            <Box sx={{ textAlign: 'center', color: '#f59e0b' }}>
              Bạn chưa có tài khoản?{' '}
              <MuiButton
                component={Link}
                to="/register"
                sx={{ color: '#f59e0b', fontWeight: 'bold', '&:hover': { color: '#b45309' } }}
              >
                Đăng ký ngay
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
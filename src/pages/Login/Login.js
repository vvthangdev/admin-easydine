"use client"

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
import * as styles from '../../styles';
import LogoImage from '../../assets/images/logo2.png';

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

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
        navigate('/overview');
        window.history.replaceState({}, document.title, '/login');
      } catch (err) {
        message.error('Lỗi xử lý dữ liệu Google login!');
        console.error(err);
        setGoogleLoading(false);
      }
    }
  }, [location, login, navigate]);

  useEffect(() => {
  if (user) {
    navigate('/overview');
  }
}, [user, navigate]);

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
      navigate('/overview');
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
    <Box sx={{
      ...styles.boxStyles.section,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: styles.gradients.dialog,
    }}>
      {/* Home Button */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <MuiButton
          variant="outlined"
          startIcon={<HomeOutlined />}
          onClick={() => navigate('/')}
          sx={styles.buttonStyles.iconButton}
        />
      </Box>

      <Box sx={{ maxWidth: 400, width: '100%', mx: 2, position: 'relative' }}>
        <Card style={styles.cardStyles.login}>
          {/* Logo Circle */}
          <Box sx={{
            ...styles.loginStyles.logoContainer,
            top: -64, // Nhô nửa ngoài Card
            zIndex: 2,
          }}>
            <Box sx={styles.loginStyles.logoInner}>
              <img
                src={LogoImage}
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%',
                }}
                onError={() => console.error('Failed to load logo2.png')} // Debug lỗi tải ảnh
              />
            </Box>
          </Box>

          {/* Title and Subtitle */}
          <Box sx={{ textAlign: 'center', mt: 10, mb: 4 }}>
            <Typography variant="h5" sx={styles.textStyles.blackBold}>
              Chào mừng!
            </Typography>
            <Box sx={styles.boxStyles.buttonGroup}>
              <Box sx={styles.loginStyles.dividerLine} />
              <Typography variant="body2" sx={styles.textStyles.grayLight} fontStyle="italic">
                Trải nghiệm ẩm thực tuyệt vời
              </Typography>
              <Box sx={styles.loginStyles.dividerLine} />
            </Box>
          </Box>

          {/* Form */}
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
                prefix={<MailOutlined style={{ color: styles.colors.primary.main }} />}
                placeholder="Email"
                size="large"
                style={styles.loginStyles.input}
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
                prefix={<LockOutlined style={{ color: styles.colors.primary.main }} />}
                placeholder="Mật khẩu"
                size="large"
                style={styles.loginStyles.input}
              />
            </Form.Item>

            <Box sx={styles.boxStyles.header}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={styles.checkboxStyles.default}>Ghi nhớ tôi</Checkbox>
              </Form.Item>
              <MuiButton
                component={Link}
                to="/forgot-password"
                sx={styles.loginStyles.linkButton}
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
                style={styles.buttonStyles.primary}
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
                style={styles.loginStyles.googleButton}
              >
                <GoogleOutlined style={{ color: '#db4437' }} />
                Đăng nhập bằng Google
              </Button>
            </Form.Item>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={styles.textStyles.grayLight}>
                Bạn chưa có tài khoản?{' '}
                <MuiButton
                  component={Link}
                  to="/register"
                  sx={styles.loginStyles.linkButton}
                >
                  Đăng ký ngay
                </MuiButton>
              </Typography>
            </Box>

            <Box sx={{ ...styles.boxStyles.buttonGroup, pt: 4, justifyContent: 'center' }}>
              <Box sx={styles.loginStyles.dividerLine} />
              <Typography variant="body2" sx={styles.textStyles.grayLight}>
                ✦
              </Typography>
              <Box sx={styles.loginStyles.dividerLine} />
            </Box>
          </Form>
        </Card>
      </Box>
    </Box>
  );
}
import { Form, Input, Button, Card, Checkbox, message } from "antd";
import {
  LockOutlined,
  MailOutlined,
  HomeOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { authAPI } from "../../services/apis/Auth";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Typography, Button as MuiButton } from "@mui/material";
import { useAppleStyles } from "../../theme/theme-hooks";
import LogoImage from "../../assets/images/logo2.png";

export default function Login() {
  const styles = useAppleStyles();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");
    const userData = query.get("userData");
    const error = query.get("error");

    if (error) {
      message.error("Đăng nhập Google thất bại! Vui lòng thử lại.");
      setGoogleLoading(false);
      return;
    }

    if (accessToken && refreshToken && userData) {
      try {
        const parsedUserData = JSON.parse(decodeURIComponent(userData));
        const cleanAccessToken = accessToken.replace(/^Bearer\s+/, "");
        const cleanRefreshToken = refreshToken.replace(/^Bearer\s+/, "");
        login({
          accessToken: cleanAccessToken,
          refreshToken: cleanRefreshToken,
          userData: parsedUserData,
        });
        message.success("Đăng nhập Google thành công!");
        navigate("/overview");
        window.history.replaceState({}, document.title, "/login");
      } catch (err) {
        message.error("Lỗi xử lý dữ liệu Google login!");
        console.error(err);
        setGoogleLoading(false);
      }
    }
  }, [location, login, navigate]);

  useEffect(() => {
    if (user) {
      navigate("/overview");
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
        accessToken: response.accessToken.replace(/^Bearer\s+/, ""),
        refreshToken: response.refreshToken
          ? response.refreshToken.replace(/^Bearer\s+/, "")
          : response.refreshToken,
      };
      login(cleanResponse);
      message.success("Đăng nhập thành công!");
      navigate("/overview");
    } catch (error) {
      const errorMessage = error.message || "Đăng nhập thất bại!";
      console.log(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    message.loading("Đang chuyển hướng đến Google...", 0);
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/users/auth/google`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: styles.gradients?.dialog || 'linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)',
      }}
    >
      <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
        <MuiButton
          variant="outlined"
          startIcon={<HomeOutlined />}
          onClick={() => navigate("/")}
          sx={styles.button('outline')}
        />
      </Box>

      <Box sx={{ maxWidth: 400, width: "100%", mx: 2, position: "relative" }}>
        <Card sx={{
          borderRadius: styles.rounded('lg'),
          boxShadow: styles.shadows?.lg,
          p: styles.spacing(3),
          position: 'relative',
        }}>
          <Box
            sx={{
              position: 'absolute',
              top: -64,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              width: 128,
              height: 128,
              borderRadius: '50%',
              backgroundColor: styles.colors?.background?.paper || '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: styles.shadows?.md,
            }}
          >
            <img
              src={LogoImage}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "50%",
              }}
              onError={() => console.error("Failed to load logo2.png")}
            />
          </Box>

          <Box sx={{ textAlign: "center", mt: 10, mb: 4 }}>
            <Typography variant="h5" sx={{ color: styles.colors?.text?.primary || '#1d1d1f', fontWeight: 600 }}>
              Chào mừng!
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: styles.spacing(2), mt: styles.spacing(2) }}>
              <Box sx={{ flex: 1, height: 1, backgroundColor: styles.colors?.neutral?.[200] || '#e0e0e0' }} />
              <Typography
                variant="body2"
                sx={{ color: styles.colors?.text?.secondary || '#86868b', fontStyle: 'italic' }}
              >
                Trải nghiệm ẩm thực tuyệt vời
              </Typography>
              <Box sx={{ flex: 1, height: 1, backgroundColor: styles.colors?.neutral?.[200] || '#e0e0e0' }} />
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
                { type: "email", message: "Vui lòng nhập email hợp lệ!" },
                { required: true, message: "Vui lòng nhập email của bạn!" },
              ]}
            >
              <Input
                prefix={
                  <MailOutlined style={{ color: styles.colors?.primary?.main || '#0071e3' }} />
                }
                placeholder="Email"
                size="large"
                style={{
                  borderRadius: styles.rounded('md'),
                  padding: styles.spacing(1),
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined style={{ color: styles.colors?.primary?.main || '#0071e3' }} />
                }
                placeholder="Mật khẩu"
                size="large"
                style={{
                  borderRadius: styles.rounded('md'),
                  padding: styles.spacing(1),
                }}
              />
            </Form.Item>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: styles.spacing(2) }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: styles.colors?.text?.primary || '#1d1d1f' }}>
                  Ghi nhận
                </Checkbox>
              </Form.Item>
              <MuiButton
                component={Link}
                to="/forgot-password"
                sx={{ color: styles.colors?.primary?.main || '#0071e3', textTransform: 'none' }}
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
                  backgroundColor: styles.colors?.primary?.main || '#0071e3',
                  borderRadius: styles.rounded('md'),
                  height: 40,
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
                  borderRadius: styles.rounded('md'),
                  borderColor: styles.colors?.neutral?.[200] || '#e0e0e0',
                  color: styles.colors?.text?.primary || '#333',
                  height: 40,
                }}
              >
                <GoogleOutlined style={{ color: "#db4437" }} />
                Đăng nhập bằng Google
              </Button>
            </Form.Item>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2"
                sx={{ color: styles.colors?.text?.secondary || '#757575' }}
              >
                Bạn chưa có tài khoản?{" "}
                <MuiButton
                  component={Link}
                  to="/register"
                  sx={{ color: styles.colors?.primary?.main || '#0071e3', textTransform: 'none' }}
                >
                  Đăng ký ngay
                </MuiButton>
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: styles.spacing(2),
              pt: styles.spacing(4),
              justifyContent: 'center'
            }}>
              <Box sx={{ flex: 1, height: 1, backgroundColor: styles.colors?.neutral?.[200] || '#e0e0e0' }} />
              <Typography variant="body2" sx={{ color: styles.colors?.text?.secondary || '#757575' }}>
                ✦
              </Typography>
              <Box sx={{ flex: 1, height: 1, backgroundColor: styles.colors?.neutral?.[200] || '#e0e0e0' }} />
            </Box>
          </Form>
        </Card>
      </Box>
    </Box>
  );
}
import { Form, Input, Button, Card, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import { authAPI } from "../../services/apis/Auth";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (values) => {
        const { email, password } = values;
        const requestData = { email, password };

        try {
            setLoading(true);
            const response = await authAPI.login(requestData);

            if (response?.accessToken) {
                login(response);
                message.success('Đăng nhập thành công!');

                // Giải mã token để kiểm tra vai trò
                const decoded = jwtDecode(response.accessToken);
                if (decoded.payload.role === 'ADMIN') {
                    navigate('/admin');
                    window.location.reload();
                } else {
                    navigate('/');
                    window.location.reload();
                }
            }
        } catch (error) {
            // Kiểm tra xem có phản hồi từ máy chủ không
            const errorMessage = error?.response?.data || 'Đăng nhập thất bại!';
            console.log(errorMessage);
            message.error(errorMessage); // Hiển thị thông báo lỗi từ phản hồi
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="absolute top-4 left-4 z-10">
                <Button
                    type="link"
                    icon={<HomeOutlined className="text-2xl" />}
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center w-12 h-12 bg-white/80 border border-amber-200 hover:border-amber-400 text-amber-700 hover:text-amber-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
                />
            </div>
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-200 opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-amber-200 opacity-20 blur-3xl"></div>
            </div>

            <div className="max-w-md w-full mx-4 relative">
                {/* Subtle border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-300 via-amber-300 to-orange-300 rounded-2xl opacity-50 blur"></div>

                <Card className="relative bg-white/90 backdrop-blur-sm rounded-xl border-0 shadow-lg">
                    {/* Restaurant Logo */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                        <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center">
                                <span className="text-5xl">🍽️</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-16 mb-8">
                        <h1 className="text-3xl font-serif font-bold text-amber-800 mb-2">
                            Chào mừng!
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-12 bg-amber-300"></div>
                            <p className="text-amber-700 font-serif italic">
                                Trải nghiệm ẩm thực tuyệt vời
                            </p>
                            <div className="h-px w-12 bg-amber-300"></div>
                        </div>
                    </div>

                    <Form
                        form={form}
                        name="login"
                        onFinish={handleSubmit}
                        layout="vertical"
                        className="space-y-6"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
                                { required: true, message: 'Vui lòng nhập email của bạn!' },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-amber-500" />}
                                placeholder="Email"
                                size="large"
                                className="h-12 bg-white/80 border-amber-200 hover:border-amber-400 focus:border-amber-500 text-amber-900 placeholder:text-amber-400"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-amber-500" />}
                                placeholder="Mật khẩu"
                                size="large"
                                className="h-12 bg-white/80 border-amber-200 hover:border-amber-400 focus:border-amber-500 text-amber-900 placeholder:text-amber-400"
                            />
                        </Form.Item>

                        <div className="flex items-center justify-between">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox className="text-amber-700">
                                    Ghi nhớ tôi
                                </Checkbox>
                            </Form.Item>

                            <a href="/forgot-password"
                               className="text-amber-600 hover:text-amber-800">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                loading={loading}
                                className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-lg font-serif hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div className="text-center text-amber-700">
                            Bạn chưa có tài khoản?{' '}
                            <a href="/register"
                               className="font-semibold text-amber-600 hover:text-amber-800">
                                Đăng ký ngay
                            </a>
                        </div>

                        {/* Decorative bottom element */}
                        <div className="pt-6 flex items-center justify-center gap-3">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                            <span className="text-amber-400">✦</span>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
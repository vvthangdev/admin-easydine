import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

import { contactAPI } from '../../services/apis/Contact';

export default function Contact() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        const { name, email, phone, message } = values;
        const requestData = { name, email, phone, message };
        try {
            setLoading(true);
            // Gửi request đến API để xử lý thông tin liên hệ
            await contactAPI.sendContact(requestData);
            alert('Gửi thông tin thành công!'); // Using alert instead of message
        } catch (error) {
            alert('Gửi thông tin thất bại!'); // Using alert instead of message
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 px-4 md:px-20 bg-white">
            <div className="max-w-md w-full mx-auto">
                <Card className="relative bg-white/90 backdrop-blur-sm rounded-xl border-0 shadow-lg p-6">
                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Liên Hệ Chúng Tôi
                        </h1>
                        <p className="text-gray-600 italic">
                            Chúng tôi luôn sẵn sàng hỗ trợ bạn
                        </p>
                    </div>

                    <Form
                        name="contact"
                        onFinish={handleSubmit}
                        layout="vertical"
                        scrollToFirstError
                        className="space-y-4"
                    >
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}>

                            <Input
                                prefix={<UserOutlined className="text-amber-500" />}
                                placeholder="Tên của bạn"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
                                { required: true, message: 'Vui lòng nhập email!' },
                            ]}>
                            <Input
                                prefix={<MailOutlined className="text-amber-500" />}
                                placeholder="Email"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                            <Input
                                prefix={<PhoneOutlined className="text-amber-500" />}
                                placeholder="Số điện thoại"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="message"
                            rules={[{ required: true, message: 'Vui lòng nhập tin nhắn của bạn!' }]}>
                            <Input.TextArea
                                rows={4}
                                placeholder="Tin nhắn của bạn"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-lg font-serif hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300 w-full">
                                Gửi
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </section>
    );
}
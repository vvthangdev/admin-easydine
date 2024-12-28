import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, InputNumber } from 'antd';
import { useLocation } from 'react-router-dom';
import { shipAPI } from '../../services/apis/Ship'; // Import API ship

const ShipOrder = () => {
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const location = useLocation();

    // Nhận giỏ hàng từ state
    const cart = location.state?.cart || [];

    useEffect(() => {
        if (cart.length > 0) {
            setSelectedItems(cart); // Giỏ hàng đã chọn, không cần tải lại
        }
    }, [cart]);

    const handleItemChange = (itemId, quantity) => {
        setSelectedItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Tạo dữ liệu theo cấu trúc yêu cầu
            const requestData = {
                userinfo: {
                    name: values.name,
                    address: values.address,
                    phone: values.phone,
                },
                status: "confirmed",
                type: "ship",
                order: selectedItems.map(item => ({
                    item_id: item.id,  // Sử dụng item_id thay vì id
                    quantity: item.quantity,
                })),
            };

            // Gửi yêu cầu API
            const response = await shipAPI.createShipOrder(requestData);
            message.success('Đặt hàng thành công!');
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            message.error('Không thể đặt hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="max-w-md w-full mx-4 relative">
                <Card className="relative bg-white/90 backdrop-blur-sm rounded-xl border-0 shadow-lg p-6">
                    <div className="text-center mt-4 mb-4">
                        <h1 className="text-3xl font-serif font-bold text-amber-800 mb-2">
                            Đặt Hàng Giao Tận Nơi
                        </h1>
                        <div className="text-amber-700">Vui lòng điền thông tin bên dưới</div>
                    </div>

                    <Form onFinish={handleSubmit} layout="vertical" scrollToFirstError>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn!' }]} >
                            <Input placeholder="Họ và Tên" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn!' }]} >
                            <Input placeholder="Số Điện Thoại" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]} >
                            <Input placeholder="Địa Chỉ Giao Hàng" size="large" />
                        </Form.Item>

                        <h3 className="font-semibold text-lg">Chọn Món Ăn</h3>
                        {selectedItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center mb-4">
                                <span>{item.name}</span>
                                <div className="flex items-center">
                                    <InputNumber
                                        min={1}
                                        value={item.quantity}
                                        onChange={(value) => handleItemChange(item.id, value)}
                                        style={{ width: 80 }}
                                    />
                                </div>
                            </div>
                        ))}

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
                                Đặt Hàng
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default ShipOrder;

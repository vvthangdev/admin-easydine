import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, DatePicker, message, Select, InputNumber } from 'antd';
import { useLocation } from 'react-router-dom'; // Dùng useLocation để lấy giỏ hàng
import { reservationAPI } from '../../services/apis/Reservation'; // API to create reservations

const { Option } = Select;

const Reservation = () => {
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});
    const location = useLocation(); // Lấy location từ react-router-dom
    const cart = location.state?.cart || []; // Giỏ hàng được truyền từ trang MenuItems

    // Khởi tạo selectedItems từ giỏ hàng
    useEffect(() => {
        const initialSelectedItems = {};
        cart.forEach(item => {
            initialSelectedItems[item.id] = item.quantity; // Lấy số lượng từ giỏ hàng
        });
        setSelectedItems(initialSelectedItems); // Cập nhật lại selectedItems
    }, [cart]);

    const handleItemChange = (itemId, quantity) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: quantity,
        }));
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Xây dựng dữ liệu cơ bản
            const orderData = {
                type: "reservation",
                status: "pending",
                start_time: new Date(values.date).toISOString(), // Chuyển đổi sang định dạng ISO
                num_people: values.num_people,
            };

            // Xử lý các món ăn (nếu có)
            const selectedItemsArray = Object.entries(selectedItems)
                .filter(([_, quantity]) => quantity > 0) // Lọc các món có số lượng lớn hơn 0
                .map(([itemId, quantity]) => ({ id: parseInt(itemId), quantity }));

            if (selectedItemsArray.length > 0) {
                orderData.items = selectedItemsArray; // Thêm món ăn vào dữ liệu nếu có
            }

            // Gửi yêu cầu đến API
            const response = await reservationAPI.createOrder(orderData); // reservationAPI là dịch vụ gọi API
            message.success('Đặt chỗ thành công!');
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            message.error('Không thể đặt chỗ. Vui lòng thử lại.');
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
                            Đặt Chỗ
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
                            name="num_people"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng người!' }]} >
                            <InputNumber
                                min={1}
                                placeholder="Số Lượng Người"
                                size="large"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="date"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày và giờ!' }]} >
                            <DatePicker
                                showTime
                                placeholder="Chọn Ngày và Giờ"
                                size="large"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        {/* Chọn Món Ăn */}
                        <h3 className="font-semibold text-lg">Chọn Món Ăn</h3>
                        {cart.map(item => (
                            <Form.Item key={item.id} label={item.name}>
                                <InputNumber
                                    min={0}
                                    value={selectedItems[item.id] || 0}
                                    onChange={(value) => handleItemChange(item.id, value)}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        ))}

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
                                Đặt Chỗ và Gọi Món
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Reservation;

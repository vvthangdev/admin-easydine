// src/Features/Order/OrderHistory.js
import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Spin, Rate, Form } from 'antd';
import { orderAPI } from '../../services/apis/Order';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Fetch danh sách đơn hàng
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderAPI.getAllOrders();
            setOrders(response.data); // Lưu danh sách đơn hàng
        } catch (error) {
            message.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // Fetch chi tiết đơn hàng
    const fetchOrderDetails = async (orderId) => {
        setLoadingDetails(true);
        try {
            const response = await orderAPI.getOrderDetails(orderId);
            setOrderDetails(response.data); // Lưu chi tiết đơn hàng
            setIsModalVisible(true);
        } catch (error) {
            message.error('Không thể tải chi tiết đơn hàng');
        } finally {
            setLoadingDetails(false);
        }
    };

    // Đóng modal chi tiết đơn hàng
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setOrderDetails(null);
        form.resetFields(); // Reset form khi đóng modal
    };

    // Gửi đánh giá cho sản phẩm
    const handleSubmitReview = async (itemId, values) => {
        const reviewData = {
            itemId,
            rating: values.rating,
            comment: values.comment,
        };

        try {
            await orderAPI.submitReview(reviewData);
            message.success('Đánh giá thành công!');
            handleCloseModal(); // Đóng modal sau khi đánh giá
        } catch (error) {
            message.error('Có lỗi xảy ra khi gửi đánh giá');
        }
    };

    // Cấu hình các cột của bảng
    const columns = [
        {
            title: 'Mã Đơn Hàng',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
            render: (text) => <span>{new Date(text).toLocaleString()}</span>,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => fetchOrderDetails(record.id)}>
                    Xem Chi Tiết
                </Button>
            ),
        },
    ];

    useEffect(() => {
        fetchOrders(); // Gọi API để tải danh sách đơn hàng khi component được render
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Đơn Hàng Của Tôi</h1>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            {/* Modal hiển thị chi tiết đơn hàng */}
            <Modal
                title="Chi Tiết Đơn Hàng"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={600}
            >
                {loadingDetails ? (
                    <Spin size="large" />
                ) : (
                    orderDetails && (
                        <div>
                            <p>
                                <strong>Thời gian đặt:</strong> {new Date(orderDetails.time).toLocaleString()}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong> {orderDetails.status}
                            </p>
                            <h2 className="text-xl font-semibold mt-4">Sản phẩm:</h2>
                            <ul>
                                {orderDetails.items.map((item) => (
                                    <li key={item.id} className="mb-4">
                                        <span>
                                            {item.name} - {item.quantity} x {item.price.toLocaleString()} Đ
                                        </span>
                                        <div className="mt-2">
                                            <Form
                                                form={form}
                                                layout="inline"
                                                initialValues={{
                                                    rating: item.rating || 0,
                                                    comment: item.comment || '',
                                                }}
                                                onFinish={(values) => handleSubmitReview(item.id, values)} // Gửi đánh giá
                                            >
                                                <Form.Item name="rating" style={{ margin: 0 }}>
                                                    <Rate allowHalf />
                                                </Form.Item>
                                                <Form.Item name="comment" style={{ marginLeft: 8, marginBottom: 0 }}>
                                                    <input
                                                        placeholder="Nhập đánh giá của bạn"
                                                        style={{ width: '200px' }}
                                                    />
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        style={{ marginLeft: 8 }}
                                                    >
                                                        Gửi Đánh Giá
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p>
                                <strong>Tổng cộng:</strong> {orderDetails.totalAmount.toLocaleString()} Đ
                            </p>
                        </div>
                    )
                )}
            </Modal>
        </div>
    );
};

export default OrderHistory;

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, InputNumber, Select, DatePicker } from 'antd';
import { canceledItemOrderAPI } from '../../../services/apis/CanceledItemOrderAPI';
import moment from 'moment';

export default function CancelItemManagement() {
    const [canceledItems, setCanceledItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    // Lấy danh sách bản ghi hủy món hàng
    const fetchCanceledItems = async () => {
        setLoading(true);
        try {
            const response = await canceledItemOrderAPI.getAllCanceledItemOrders();
            setCanceledItems(response || []);
            console.log("Danh sách bản ghi hủy:", response);
        } catch (error) {
            message.error("Lỗi khi tải danh sách bản ghi hủy");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCanceledItems();
    }, []);

    // Cấu hình cột cho bảng
    const columns = [
        {
            title: 'Ảnh',
            dataIndex: ['item_id', 'image'],
            key: 'image',
            render: (image) => (
                <img
                    src={image}
                    alt="item"
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                />
            ),
        },
        {
            title: 'Tên món hàng',
            dataIndex: ['item_id', 'name'],
            key: 'item_name',
        },
        {
            title: 'Giá',
            dataIndex: ['item_id', 'price'],
            key: 'price',
            render: (price) => `${price.toLocaleString()} VNĐ`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: ['order_id', '_id'],
            key: 'order_id',
        },
        {
            title: 'Kích thước',
            dataIndex: 'size',
            key: 'size',
            render: (size) => size || 'Không có',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: (note) => note || 'Không có',
        },
        {
            title: 'Lý do hủy',
            dataIndex: 'cancel_reason',
            key: 'cancel_reason',
        },
        {
            title: 'Người hủy',
            dataIndex: ['canceled_by', 'name'],
            key: 'canceled_by',
        },
        {
            title: 'Thời gian hủy',
            dataIndex: 'canceled_at',
            key: 'canceled_at',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(record._id)}
                    >
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    // Xử lý thêm bản ghi
    const handleAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    // Xử lý sửa bản ghi
    const handleEdit = (record) => {
        setEditingItem(record);
        form.setFieldsValue({
            ...record,
            item_id: record.item_id._id,
            order_id: record.order_id._id,
            canceled_by: record.canceled_by._id,
            canceled_at: record.canceled_at ? moment(record.canceled_at) : null,
        });
        setIsModalVisible(true);
    };

    // Xử lý xóa bản ghi
    const handleDelete = async (id) => {
        try {
            await canceledItemOrderAPI.deleteCanceledItemOrder(id);
            setCanceledItems(canceledItems.filter(item => item._id !== id));
            message.success('Xóa bản ghi hủy thành công');
        } catch (error) {
            message.error('Lỗi khi xóa bản ghi hủy');
        }
    };

    // Xử lý khi submit form (thêm hoặc sửa)
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                canceled_at: values.canceled_at ? values.canceled_at.toISOString() : undefined,
            };

            if (editingItem) {
                // Cập nhật bản ghi
                await canceledItemOrderAPI.updateCanceledItemOrder(editingItem._id, payload);
                setCanceledItems(canceledItems.map(item =>
                    item._id === editingItem._id ? { ...item, ...payload } : item
                ));
                message.success('Cập nhật bản ghi hủy thành công');
            } else {
                // Thêm bản ghi mới
                const newItem = await canceledItemOrderAPI.createCanceledItemOrder(payload);
                setCanceledItems([...canceledItems, newItem]);
                message.success('Thêm bản ghi hủy thành công');
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    // Lấy danh sách món hàng và đơn hàng duy nhất để hiển thị trong Select
    const uniqueItems = Array.from(new Map(canceledItems.map(item => [item.item_id._id, item.item_id])).values());
    const uniqueOrders = Array.from(new Map(canceledItems.map(item => [item.order_id._id, item.order_id])).values());
    const uniqueUsers = Array.from(new Map(canceledItems.map(item => [item.canceled_by._id, item.canceled_by])).values());

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Quản lý hủy món hàng</h1>
                <Button type="primary" onClick={handleAdd}>Thêm bản ghi hủy mới</Button>
            </div>

            <Table
                columns={columns}
                dataSource={canceledItems}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
                style={{ backgroundColor: '#fff' }}
            />

            <Modal
                title={editingItem ? "Sửa bản ghi hủy" : "Thêm bản ghi hủy mới"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="item_id"
                        label="Món hàng"
                        rules={[{ required: true, message: 'Vui lòng chọn món hàng!' }]}
                    >
                        <Select placeholder="Chọn món hàng">
                            {uniqueItems.map(item => (
                                <Select.Option key={item._id} value={item._id}>
                                    {item.name} ({item.price.toLocaleString()} VNĐ)
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                    >
                        <InputNumber min={1} placeholder="Nhập số lượng" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="order_id"
                        label="Mã đơn hàng"
                        rules={[{ required: true, message: 'Vui lòng chọn mã đơn hàng!' }]}
                    >
                        <Select placeholder="Chọn mã đơn hàng">
                            {uniqueOrders.map(order => (
                                <Select.Option key={order._id} value={order._id}>
                                    {order._id} ({order.final_amount.toLocaleString()} VNĐ)
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="size"
                        label="Kích thước"
                    >
                        <Input placeholder="Nhập kích thước (tùy chọn)" />
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Ghi chú"
                    >
                        <Input placeholder="Nhập ghi chú (tùy chọn)" />
                    </Form.Item>
                    <Form.Item
                        name="cancel_reason"
                        label="Lý do hủy"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do hủy!' }]}
                    >
                        <Input placeholder="Nhập lý do hủy" />
                    </Form.Item>
                    <Form.Item
                        name="canceled_by"
                        label="Người hủy"
                        rules={[{ required: true, message: 'Vui lòng chọn người hủy!' }]}
                    >
                        <Select placeholder="Chọn người hủy">
                            {uniqueUsers.map(user => (
                                <Select.Option key={user._id} value={user._id}>
                                    {user.name} ({user.username})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="canceled_at"
                        label="Thời gian hủy"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian hủy!' }]}
                    >
                        <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
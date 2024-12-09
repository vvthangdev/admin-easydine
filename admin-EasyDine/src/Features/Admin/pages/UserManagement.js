import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { userAPI } from "../../../services/apis/User"
import {adminAPI} from "../../../services/apis/Admin"; // Giả sử bạn có một API cho contact


export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userAPI.getAllUser(); // Lấy danh sách người dùng
            setUsers(response);
            console.log("check list user:",users)
        } catch (error) {
            setError("Không thể tải danh sách người dùng");
            message.error("Lỗi khi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        onClick={() => handleDelete(record)}
                        className="text-red-600 hover:text-red-800"
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingUser(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await adminAPI.deleteUser(record); // Xóa người dùng
            setUsers(users.filter(user => user.id !== record.id));
            message.success('Xóa người dùng thành công');
        } catch (error) {
            message.error('Xóa người dùng không thành công');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const requestData = {
                name: values.name,
                email: values.email,
            };

            if (editingUser) {
                // Cập nhật người dùng
                await adminAPI.updateUser({ ...requestData, id: editingUser.id });
                setUsers(users.map(user => (user.id === editingUser.id ? { ...user, ...requestData } : user)));
                message.success('Cập nhật người dùng thành công');
            } else {
                // Thêm người dùng mới
                const newUser = await userAPI.addUser(requestData);
                setUsers([...users, newUser]);
                message.success('Thêm người dùng mới thành công');
            }

            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Lỗi khi thêm/sửa người dùng:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Quản lý người dùng</h1>
                {/*<Button*/}
                {/*    type="primary"*/}
                {/*    onClick={handleAdd}*/}
                {/*    className="bg-blue-500 hover:bg-blue-600"*/}
                {/*>*/}
                {/*    Thêm người dùng mới*/}
                {/*</Button>*/}
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                    className="w-full"
                />
            </div>

            <Modal
                title={editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Tên người dùng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                    >
                        <Input placeholder="Nhập tên người dùng" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
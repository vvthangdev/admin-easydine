import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { contactAPI } from "../../../services/apis/Contact";

export default function ContactManagement() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [form] = Form.useForm();

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await contactAPI.getALlContact(); // Lấy danh sách liên hệ
            setContacts(response.contacts); // Giả sử response có thuộc tính contacts
            console.log("check contact:", response.contacts);
        } catch (error) {
            message.error("Lỗi khi tải danh sách liên hệ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Tin nhắn',
            dataIndex: 'message',
            key: 'message',
        },
        // {
        //     title: 'Thao tác',
        //     key: 'action',
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
        //             <Button type="link" onClick={() => handleDelete(record)}>Xóa</Button>
        //         </Space>
        //     ),
        // },
    ];

    const handleAdd = () => {
        setEditingContact(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingContact(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await contactAPI.deleteContact(record.id); // Xóa liên hệ
            setContacts(contacts.filter(contact => contact.id !== record.id));
            message.success('Xóa liên hệ thành công');
        } catch (error) {
            message.error('Xóa liên hệ không thành công');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingContact) {
                // Cập nhật liên hệ
                await contactAPI.updateContact({ ...values, id: editingContact.id });
                setContacts(contacts.map(contact => (contact.id === editingContact.id ? { ...contact, ...values } : contact)));
                message.success('Cập nhật liên hệ thành công');
            } else {
                // Thêm liên hệ mới
                const newContact = await contactAPI.addContact(values);
                setContacts([...contacts, newContact]);
                message.success('Thêm liên hệ mới thành công');
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Quản lý liên hệ</h1>
                <Button type="primary" onClick={handleAdd}>Thêm liên hệ mới</Button>
            </div>

            <Table
                columns={columns}
                dataSource={contacts}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
                style={{ backgroundColor: '#fff' }}
            />

            <Modal
                title={editingContact ? "Sửa liên hệ" : "Thêm liên hệ mới"}
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
                        name="name"
                        label="Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập tên" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
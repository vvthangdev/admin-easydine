import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Space, message } from 'antd';
import { tableAPI } from "../../../services/apis/Table";

export default function TableManagement() {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingTable, setEditingTable] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchTables = async () => {
        setLoading(true);
        try {
            const response = await tableAPI.getAllTable();
            setTables(response);
        } catch (error) {
            setError("Không thể tải danh sách bàn");
            message.error("Lỗi khi tải danh sách bàn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const columns = [
        {
            title: 'Số bàn',
            dataIndex: 'table_number',
            key: 'table_number',
        },
        {
            title: 'Sức chứa',
            dataIndex: 'capacity',
            key: 'capacity',
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
        setEditingTable(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingTable(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await tableAPI.deleteTable(record); // Xóa bàn
            setTables(tables.filter(table => table.table_number !== record.table_number));
            message.success('Xóa bàn thành công');
        } catch (error) {
            console.log(error);
            message.error('Xóa bàn không thành công');
        }
    };

    const handleModalOk = () => {
        form.validateFields()
            .then(async values => {
                const requestData = {
                    table_number: values.table_number,
                    capacity: values.capacity
                };

                if (editingTable) {
                    // Cập nhật bàn
                    await tableAPI.updateTable({ ...requestData, id: editingTable.id });
                    // Cập nhật state tables
                    setTables(tables.map(table => (table.table_number === editingTable.table_number ? { ...table, ...requestData } : table)));
                    message.success('Cập nhật thành công');
                } else {
                    // Thêm bàn mới
                    const newTable = await tableAPI.addTable(requestData);
                    setTables([...tables, newTable]); // Cập nhật state với bàn mới
                    message.success('Thêm bàn mới thành công');
                }

                setIsModalVisible(false);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Quản lý bàn</h1>
                <Button
                    type="primary"
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Thêm bàn mới
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table
                    columns={columns}
                    dataSource={tables}
                    rowKey="table_number" // Sử dụng table_number làm khóa cho mỗi dòng
                    loading={loading}
                    className="w-full"
                />
            </div>

            <Modal
                title={editingTable ? "Sửa thông tin bàn" : "Thêm bàn mới"}
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
                        name="table_number"
                        label="Số bàn"
                        rules={[{ required: true, message: 'Vui lòng nhập số bàn!' }]}
                    >
                        <InputNumber className="w-full" type="number" placeholder="Nhập số bàn" />
                    </Form.Item>
                    <Form.Item
                        name="capacity"
                        label="Sức chứa"
                        rules={[{ required: true, message: 'Vui lòng nhập sức chứa!' }]}
                    >
                        <InputNumber className="w-full" placeholder="Nhập sức chứa" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Select,
  DatePicker,
} from "antd";
import { voucherAPI } from "../../services/apis/Voucher";
import moment from "moment";

const VoucherList = ({ selectedUser }) => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await voucherAPI.getAllVouchers();
      const data = Array.isArray(response) ? response : [];
      console.log("Fetched vouchers:", data); // Debug dữ liệu
      setVouchers(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách voucher: " + error.message);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const columns = [
    { 
      title: "Mã", 
      dataIndex: "code", 
      key: "code", 
      width: "20%", 
      ellipsis: true 
    },
    { 
      title: "Giảm giá", 
      dataIndex: "discount", 
      key: "discount", 
      width: "15%", 
      ellipsis: true 
    },
    { 
      title: "Loại", 
      dataIndex: "discountType", 
      key: "discountType", 
      width: "15%", 
      ellipsis: true, 
      className: "hidden sm:table-cell" 
    },
    {
      title: "Giá trị tối thiểu",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      width: "20%",
      ellipsis: true,
      className: "hidden lg:table-cell",
    },
    {
      title: "Người dùng áp dụng",
      dataIndex: "applicableUsers",
      key: "applicableUsers",
      width: "25%",
      ellipsis: true,
      className: "hidden lg:table-cell",
      render: (users) => (users && users.length > 0 ? users.join(", ") : "Tất cả"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: "25%",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
          {selectedUser && (
            <Button type="link" onClick={() => handleAddUserToVoucher(record)}>
              Thêm người dùng
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingVoucher(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingVoucher(record);
    form.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      endDate: moment(record.endDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await voucherAPI.deleteVoucher(record._id);
      const updatedVouchers = vouchers.filter((v) => v._id !== record._id);
      setVouchers(updatedVouchers);
      message.success("Xóa voucher thành công");
    } catch (error) {
      message.error("Xóa voucher không thành công: " + error.message);
    }
  };

  const handleAddUserToVoucher = async (record) => {
    try {
      await voucherAPI.addUsersToVoucher(record._id, [selectedUser._id]);
      fetchVouchers();
      message.success(`Đã thêm ${selectedUser.name} vào voucher ${record.code}`);
    } catch (error) {
      message.error("Thêm người dùng vào voucher thất bại: " + error.message);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const voucherData = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };

      if (editingVoucher) {
        await voucherAPI.updateVoucher(editingVoucher._id, voucherData);
        const updatedVouchers = vouchers.map((v) =>
          v._id === editingVoucher._id ? { ...v, ...voucherData } : v
        );
        setVouchers(updatedVouchers);
        message.success("Cập nhật voucher thành công");
      } else {
        const newVoucher = await voucherAPI.createVoucher(voucherData);
        setVouchers([...vouchers, newVoucher]);
        message.success("Thêm voucher thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xử lý voucher: " + error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-xl font-semibold">Danh sách Voucher</h2>
        <Button type="primary" onClick={handleAdd}>
          Thêm Voucher
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={Array.isArray(vouchers) ? vouchers : []} // Đảm bảo dataSource là mảng
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSizeOptions: [5, 10],
            defaultPageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} voucher`,
          }}
          className="min-w-0"
          tableLayout="fixed"
        />
      </div>
      <Modal
        title={editingVoucher ? "Sửa Voucher" : "Thêm Voucher"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="code" label="Mã" rules={[{ required: true, message: "Vui lòng nhập mã!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="discount" label="Giảm giá" rules={[{ required: true, message: "Vui lòng nhập giá trị giảm giá!" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="discountType"
            label="Loại giảm giá"
            rules={[{ required: true, message: "Vui lòng chọn loại giảm giá!" }]}
          >
            <Select>
              <Select.Option value="percentage">Phần trăm</Select.Option>
              <Select.Option value="fixed">Cố định</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="minOrderValue" label="Giá trị tối thiểu">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}>
            <DatePicker showTime />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherList;
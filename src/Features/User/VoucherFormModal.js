import React from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";

const VoucherFormModal = ({ visible, onOk, onCancel, form, editingVoucher }) => {
  return (
    <Modal
      title={editingVoucher ? "Sửa Voucher" : "Thêm Voucher"}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="code"
          label="Mã"
          rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="discount"
          label="Giảm giá"
          rules={[{ required: true, message: "Vui lòng nhập giá trị giảm giá!" }]}
        >
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
        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="Ngày kết thúc"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
        >
          <DatePicker showTime />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VoucherFormModal;
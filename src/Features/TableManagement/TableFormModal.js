import React from "react";
import { Modal, Form, InputNumber, Button, Select } from "antd";

const TableFormModal = ({ visible, onCancel, onSubmit, editingTable, areas }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={editingTable ? "Sửa thông tin bàn" : "Thêm bàn mới"}
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onCancel();
            form.resetFields();
          }}
          className="bg-gray-200 hover:bg-gray-300"
        >
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {editingTable ? "Cập nhật" : "Thêm"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={editingTable || {}}
        onFinish={onSubmit}
        className="mt-4"
      >
        <Form.Item
          name="table_number"
          label="Số bàn"
          rules={[{ required: true, message: "Vui lòng nhập số bàn!" }]}
        >
          <InputNumber
            className="w-full"
            type="number"
            placeholder="Nhập số bàn"
            min={1}
          />
        </Form.Item>
        <Form.Item
          name="capacity"
          label="Sức chứa"
          rules={[{ required: true, message: "Vui lòng nhập sức chứa!" }]}
        >
          <InputNumber
            className="w-full"
            type="number"
            placeholder="Nhập sức chứa"
            min={1}
          />
        </Form.Item>
        <Form.Item
          name="area"
          label="Khu vực (Tầng)"
          rules={[{ required: true, message: "Vui lòng chọn hoặc nhập khu vực!" }]}
        >
          <Select
            className="w-full"
            placeholder="Chọn hoặc nhập khu vực (ví dụ: Tầng 1)"
            mode="tags"
            options={areas.map((area) => ({ label: area, value: area }))}
            maxTagCount={1} // Chỉ cho phép chọn/nhập một khu vực
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableFormModal;
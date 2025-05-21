import React from "react";
import { Form, Input, Button, message } from "antd";
import { voucherAPI } from "../../services/apis/Voucher";

const ApplyVoucherForm = ({ orderId }) => {
  const [form] = Form.useForm();

  const handleApplyVoucher = async (values) => {
    try {
      const { voucherCode } = values;
      const response = await voucherAPI.applyVoucher(voucherCode, orderId);
      message.success(
        `Áp dụng voucher thành công! Giảm: ${response.discountAmount}, Tổng cuối: ${response.finalAmount}`
      );
      form.resetFields();
    } catch (error) {
      message.error("Áp dụng voucher thất bại: " + error.message);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Áp dụng Voucher</h3>
      <Form form={form} layout="inline" onFinish={handleApplyVoucher}>
        <Form.Item
          name="voucherCode"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
        >
          <Input placeholder="Nhập mã voucher" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Áp dụng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ApplyVoucherForm;
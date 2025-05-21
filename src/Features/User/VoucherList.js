import React, { useEffect, useState } from "react";
import { Button, message, Form } from "antd";
import { voucherAPI } from "../../services/apis/Voucher";
import VoucherTable from "./VoucherTable";
import VoucherFormModal from "./VoucherFormModal";
import ApplyVoucherForm from "./ApplyVoucherForm";
import moment from "moment";

const VoucherList = ({ selectedUser, orderId }) => {
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
      console.log("Fetched vouchers:", data);
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
      <VoucherTable
        vouchers={vouchers}
        loading={loading}
        selectedUser={selectedUser}
        onEdit={handleEdit}
        onAddUser={handleAddUserToVoucher}
        fetchVouchers={fetchVouchers}
      />
      {orderId && <ApplyVoucherForm orderId={orderId} />}
      <VoucherFormModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        form={form}
        editingVoucher={editingVoucher}
      />
    </div>
  );
};

export default VoucherList;
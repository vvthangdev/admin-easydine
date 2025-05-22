import { useEffect, useState, useCallback } from "react";
import { voucherAPI } from "../../../services/apis/Voucher";
import { userAPI } from "../../../services/apis/User";

const VoucherScreenViewModel = ({ selectedUsers, setSelectedUsers, setSnackbar }) => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const users = await userAPI.getAllUser();
      setAllUsers(Array.isArray(users) ? users : []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Lỗi khi tải danh sách người dùng: ${error.message}`,
        severity: "error",
      });
      setAllUsers([]);
    }
  }, [setSnackbar]);

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await voucherAPI.getAllVouchers();
      const vouchersWithUserData = data.map((voucher) => {
        const userIds = [...new Set(voucher.applicableUsers || [])];
        const userData = userIds
          .map((id) => allUsers.find((user) => user._id === id))
          .filter(Boolean);
        return {
          ...voucher,
          applicableUsersData: userData,
        };
      });
      setVouchers(Array.isArray(vouchersWithUserData) ? vouchersWithUserData : []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Lỗi khi tải danh sách voucher: ${error.message}`,
        severity: "error",
      });
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  }, [allUsers, setSnackbar]);

  const handleAdd = useCallback(() => {
    setEditingVoucher(null);
    setForm({
      code: "",
      discount: "",
      discountType: "percentage",
      minOrderValue: 0,
      startDate: null,
      endDate: null,
      isActive: true,
      usageLimit: null,
      usedCount: 0,
      applicableUsers: [],
    });
    setSelectedUsers([]);
    setIsModalVisible(true);
  }, [setSelectedUsers]);

  const handleEdit = useCallback((voucher) => {
    setEditingVoucher(voucher);
    setForm({
      code: voucher.code,
      discount: voucher.discount,
      discountType: voucher.discountType,
      minOrderValue: voucher.minOrderValue,
      startDate: voucher.startDate ? new Date(voucher.startDate) : null,
      endDate: voucher.endDate ? new Date(voucher.endDate) : null,
      isActive: voucher.isActive,
      usageLimit: voucher.usageLimit,
      usedCount: voucher.usedCount,
      applicableUsers: voucher.applicableUsers || [],
    });
    setSelectedUsers(voucher.applicableUsers || []);
    setIsModalVisible(true);
  }, [setSelectedUsers]);

  const handleDelete = useCallback(async (voucher) => {
    if (window.confirm(`Bạn có chắc muốn xóa voucher ${voucher.code}?`)) {
      try {
        await voucherAPI.deleteVoucher(voucher._id);
        setVouchers((prev) => prev.filter((v) => v._id !== voucher._id));
        setSnackbar({
          open: true,
          message: "Xóa voucher thành công",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Xóa voucher không thành công: ${error.message}`,
          severity: "error",
        });
      }
    }
  }, [setSnackbar]);

  const handleModalOk = useCallback(async () => {
    const errors = {};
    if (!form.code) errors.code = "Mã voucher là bắt buộc";
    if (!form.discount || form.discount <= 0 || isNaN(form.discount))
      errors.discount = "Giảm giá phải là số lớn hơn 0";
    if (!form.discountType) errors.discountType = "Loại giảm giá là bắt buộc";
    if (form.minOrderValue < 0) errors.minOrderValue = "Đơn tối thiểu không được âm";
    if (!form.startDate) errors.startDate = "Ngày bắt đầu là bắt buộc";
    if (!form.endDate) errors.endDate = "Ngày kết thúc là bắt buộc";
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) <= new Date(form.startDate)
    )
      errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    if (form.usageLimit && form.usageLimit < 0)
      errors.usageLimit = "Giới hạn sử dụng không được âm";

    setFormTouched(errors);

    if (Object.keys(errors).length > 0) {
      setSnackbar({
        open: true,
        message: "Vui lòng kiểm tra lại các trường thông tin!",
        severity: "error",
      });
      return;
    }

    try {
      const voucherData = {
        code: form.code,
        discount: parseFloat(form.discount),
        discountType: form.discountType,
        minOrderValue: parseFloat(form.minOrderValue) || 0,
        startDate: form.startDate.toISOString(),
        endDate: form.endDate.toISOString(),
        isActive: form.isActive,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
        usedCount: form.usedCount || 0,
        applicableUsers: [...new Set(selectedUsers)],
      };

      let updatedVoucher;
      if (editingVoucher) {
        updatedVoucher = await voucherAPI.updateVoucher(editingVoucher._id, voucherData);
      } else {
        updatedVoucher = await voucherAPI.createVoucher(voucherData);
      }

      const userData = updatedVoucher.applicableUsers
        .map((id) => allUsers.find((user) => user._id === id))
        .filter(Boolean);

      setVouchers((prev) =>
        editingVoucher
          ? prev.map((v) =>
              v._id === editingVoucher._id
                ? { ...updatedVoucher, applicableUsersData: userData }
                : v
            )
          : [...prev, { ...updatedVoucher, applicableUsersData: userData }]
      );

      setSnackbar({
        open: true,
        message: editingVoucher ? "Cập nhật voucher thành công" : "Tạo voucher thành công",
        severity: "success",
      });

      setIsModalVisible(false);
      setForm({});
      setFormTouched({});
      setSelectedUsers([]);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Có lỗi xảy ra khi lưu voucher",
        severity: "error",
      });
    }
  }, [form, editingVoucher, selectedUsers, allUsers, setSelectedUsers, setSnackbar]);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    setForm({});
    setFormTouched({});
    setSelectedUsers([]);
  }, [setSelectedUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (allUsers.length > 0) {
      fetchVouchers();
    }
  }, [allUsers, fetchVouchers]);

  return {
    vouchers,
    isModalVisible,
    form,
    formTouched,
    editingVoucher,
    loading,
    allUsers,
    selectedUsers,
    setSelectedUsers,
    handleAdd,
    handleEdit,
    handleDelete,
    handleModalOk,
    handleModalCancel,
    setForm,
  };
};

export default VoucherScreenViewModel;
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
} from "@mui/material";
import VoucherFormModal from "./VoucherFormModal";
import { voucherAPI } from "../../../services/apis/Voucher";
import { userAPI } from "../../../services/apis/User";

const VoucherScreen = ({ selectedUsers, setSelectedUsers, setSnackbar }) => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const fetchUsers = async () => {
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
  };

  const fetchVouchers = async () => {
    setLoading(true);
   

 try {
      const data = await voucherAPI.getAllVouchers();
      const vouchersWithUserData = data.map((voucher) => {
        const userIds = [...new Set(voucher.applicableUsers || [])]; // Loại bỏ trùng lặp
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
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) {
      fetchVouchers();
    }
  }, [allUsers]);

  const handleAdd = () => {
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
      usedCount: 0, // Giá trị mặc định cho voucher mới
      applicableUsers: [],
    });
    setSelectedUsers([]);
    setIsModalVisible(true);
  };

  const handleEdit = (voucher) => {
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
      usedCount: voucher.usedCount, // Lấy usedCount từ voucher
      applicableUsers: voucher.applicableUsers || [],
    });
    setSelectedUsers(voucher.applicableUsers || []);
    setIsModalVisible(true);
  };

  const handleDelete = async (voucher) => {
    if (window.confirm(`Bạn có chắc muốn xóa voucher ${voucher.code}?`)) {
      try {
        await voucherAPI.deleteVoucher(voucher._id);
        setVouchers(vouchers.filter((v) => v._id !== voucher._id));
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
  };

  const handleModalOk = async () => {
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
        usedCount: form.usedCount || 0, // Gửi usedCount
        applicableUsers: [...new Set(selectedUsers)], // Loại bỏ trùng lặp
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
  };

  const columns = [
    { id: "code", label: "Mã Voucher", width: "15%" },
    { id: "discount", label: "Giảm giá", width: "10%" },
    { id: "discountType", label: "Loại", width: "10%" },
    { id: "minOrderValue", label: "Đơn tối thiểu", width: "12%" },
    { id: "startDate", label: "Bắt đầu", width: "12%" },
    { id: "endDate", label: "Kết thúc", width: "12%" },
    { id: "isActive", label: "Trạng thái", width: "8%" },
    { id: "usedCount", label: "Số lượt sử dụng", width: "10%" }, // Thêm cột usedCount
    { id: "action", label: "Thao tác", width: "21%" },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          Danh sách voucher
        </h2>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{ fontSize: "0.85rem" }}
        >
          Thêm voucher
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    width: column.width,
                    fontSize: "0.75rem",
                    padding: "6px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(vouchers) && vouchers.length > 0 ? (
              vouchers.map((voucher) => (
                <TableRow key={voucher._id}>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {voucher.code}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {voucher.discount}
                    {voucher.discountType === "percentage" ? "%" : " VNĐ"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {voucher.discountType === "percentage" ? "Phần trăm" : "Cố định"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {voucher.minOrderValue} VNĐ
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {new Date(voucher.startDate).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {voucher.isActive ? "Kích hoạt" : "Không kích hoạt"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {voucher.usedCount}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    <Button
                      size="small"
                      onClick={() => handleEdit(voucher)}
                      sx={{
                        minWidth: "auto",
                        padding: "2px",
                        fontSize: "0.75rem",
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(voucher)}
                      sx={{
                        minWidth: "auto",
                        padding: "2px",
                        fontSize: "0.75rem",
                      }}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    textAlign: "center",
                    fontSize: "0.75rem",
                    padding: "6px",
                  }}
                >
                  {loading ? "Đang tải..." : "Không có dữ liệu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <VoucherFormModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setForm({});
          setFormTouched({});
          setSelectedUsers([]);
        }}
        form={{
          ...form,
          setFieldsValue: (values) => setForm({ ...form, ...values }),
          touched: formTouched,
        }}
        editingVoucher={editingVoucher}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        setSnackbar={setSnackbar}
        allUsers={allUsers}
      />
    </Box>
  );
};

export default VoucherScreen;
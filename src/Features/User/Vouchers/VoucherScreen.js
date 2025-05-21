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

const VoucherScreen = ({ selectedUsers, setSelectedUsers, setSnackbar }) => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await voucherAPI.getAllVouchers();
      const data = Array.isArray(response) ? response : [];
      setVouchers(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi tải danh sách voucher: " + error.message,
        severity: "error",
      });
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
    setForm({
      code: "",
      discount: "",
      discountType: "",
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
      usedCount: voucher.usedCount,
      applicableUsers: voucher.applicableUsers || [],
    });
    setSelectedUsers(voucher.applicableUsersData || []);
    setIsModalVisible(true);
  };

  const handleDelete = async (voucher) => {
    try {
      await voucherAPI.deleteVoucher(voucher._id);
      const updatedVouchers = vouchers.filter((v) => v._id !== voucher._id);
      setVouchers(updatedVouchers);
      setSnackbar({
        open: true,
        message: "Xóa voucher thành công",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Xóa voucher không thành công: " + error.message,
        severity: "error",
      });
    }
  };

  const handleModalOk = async () => {
    const errors = {};
    if (!form.code) errors.code = true;
    if (!form.discount || form.discount <= 0 || isNaN(form.discount))
      errors.discount = true;
    if (!form.discountType) errors.discountType = true;
    if (form.minOrderValue < 0) errors.minOrderValue = true;
    if (!form.startDate) errors.startDate = true;
    if (!form.endDate) errors.endDate = true;
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) <= new Date(form.startDate)
    )
      errors.endDate = true;
    if (form.usageLimit && form.usageLimit < 0) errors.usageLimit = true;

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
        discount: form.discount,
        discountType: form.discountType,
        minOrderValue: form.minOrderValue,
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
        usageLimit: form.usageLimit,
        applicableUsers: form.applicableUsers,
      };

      if (editingVoucher) {
        await voucherAPI.updateVoucher(editingVoucher._id, voucherData);
        const updatedVoucher = {
          ...editingVoucher,
          ...voucherData,
          applicableUsersData: selectedUsers,
        };
        const updatedVouchers = vouchers.map((v) =>
          v._id === editingVoucher._id ? updatedVoucher : v
        );
        setVouchers(updatedVouchers);
        setSnackbar({
          open: true,
          message: "Cập nhật voucher thành công",
          severity: "success",
        });
      } else {
        const response = await voucherAPI.createVoucher(voucherData);
        setVouchers([
          ...vouchers,
          { ...response, applicableUsersData: selectedUsers },
        ]);
        setSnackbar({
          open: true,
          message: "Tạo voucher thành công",
          severity: "success",
        });
      }
      setIsModalVisible(false);
      setForm({});
      setFormTouched({});
      setSelectedUsers([]);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi lưu voucher",
        severity: "error",
      });
    }
  };

  const columns = [
    { id: "code", label: "Mã Voucher", width: "15%" },
    { id: "discount", label: "Giảm giá", width: "10%" },
    { id: "discountType", label: "Loại", width: "10%" },
    { id: "minOrderValue", label: "Đơn tối thiểu", width: "15%" },
    { id: "startDate", label: "Bắt đầu", width: "15%" },
    { id: "endDate", label: "Kết thúc", width: "15%" },
    { id: "isActive", label: "Trạng thái", width: "10%" },
    { id: "action", label: "Thao tác", width: "20%" },
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
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {voucher.discountType}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {voucher.minOrderValue}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {new Date(voucher.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {new Date(voucher.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", padding: "6px" }}>
                    {voucher.isActive ? "Kích hoạt" : "Không kích hoạt"}
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
      />
    </Box>
  );
};

export default VoucherScreen;
